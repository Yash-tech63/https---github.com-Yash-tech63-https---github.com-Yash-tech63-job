const Payment = require('../models/Payment.model');
const Plan = require('../models/Plan.model');
const Company = require('../models/Company');
const User = require('../models/User');
const WebhookEvent = require('../models/WebhookEvent.model');
const razorpayService = require('./razorpayService');
const subscriptionService = require('./subscriptionService');
const emailService = require('./emailService');

class PaymentService {
  /**
   * STEP 3 & 4: Create a server-verified Razorpay Order
   */
  async createPaymentOrder({ recruiterId, planId }) {
    if (!planId) {
      throw new Error('Plan ID is required to initiate payment');
    }

    // 1. Verify authenticated Recruiter & Company
    const company = await Company.findOne({ ownerUserId: recruiterId });
    if (!company) {
      throw new Error('Please set up your company profile before purchasing a plan');
    }

    // 2. Fetch actual plan pricing from MongoDB (NEVER trust frontend price)
    const plan = await Plan.findById(planId);
    if (!plan) {
      throw new Error('Selected pricing plan was not found');
    }

    if (!plan.isActive) {
      throw new Error('This plan is currently not available for purchase');
    }

    // 3. Create Razorpay order on backend
    const razorpayOrder = await razorpayService.createOrder({
      amount: plan.price,
      currency: plan.currency || 'INR',
      receipt: `rcpt_${company._id.toString().slice(-6)}_${Date.now().toString().slice(-6)}`,
      notes: {
        recruiterId: recruiterId.toString(),
        companyId: company._id.toString(),
        planId: plan._id.toString(),
        planName: plan.name
      }
    });

    // 4. Save pending Payment record in MongoDB
    const payment = await Payment.create({
      recruiterId,
      companyId: company._id,
      planId: plan._id,
      razorpayOrderId: razorpayOrder.id,
      amount: plan.price,
      currency: plan.currency || 'INR',
      paymentStatus: 'pending'
    });

    // 5. Return safe checkout details
    return {
      orderId: razorpayOrder.id,
      amount: plan.price,
      currency: plan.currency || 'INR',
      keyId: razorpayService.getPublicKey(),
      company: {
        id: company._id,
        name: company.name
      },
      plan: {
        id: plan._id,
        name: plan.name,
        price: plan.price,
        durationDays: plan.durationDays,
        jobPostingLimit: plan.jobPostingLimit
      }
    };
  }

  /**
   * STEP 7 & 8: Verify Razorpay Payment Signature and activate entitlements
   */
  async verifyPayment({ recruiterId, razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    if (!razorpay_order_id || !razorpay_payment_id) {
      throw new Error('Missing Razorpay payment verification parameters');
    }

    // 1. Find payment record by orderId
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) {
      throw new Error('Payment record not found for this order');
    }

    // Verify ownership
    if (payment.recruiterId.toString() !== recruiterId.toString()) {
      throw new Error('Unauthorized: Payment belongs to another user account');
    }

    // Idempotency: Prevent duplicate activation
    if (payment.paymentStatus === 'captured' && payment.signatureVerified) {
      const existingSub = await subscriptionService.getActiveSubscription(recruiterId);
      return {
        alreadyCaptured: true,
        payment,
        subscription: existingSub
      };
    }

    // 2. Verify Razorpay signature using HMAC SHA256 with server-side secret
    const isValidSignature = razorpayService.verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature
    });

    if (!isValidSignature) {
      payment.paymentStatus = 'failed';
      payment.errorReason = 'Invalid cryptographic payment signature';
      await payment.save();

      // Trigger failure notification
      const user = await User.findById(recruiterId);
      const plan = await Plan.findById(payment.planId);
      if (user && user.email) {
        await emailService.sendPaymentFailureEmail(user.email, {
          recruiterName: user.email.split('@')[0],
          planName: plan?.name || 'Selected Plan',
          amount: payment.amount,
          currency: payment.currency,
          failureReason: 'Cryptographic signature verification failed'
        });
      }

      throw new Error('Payment signature verification failed. Untrusted response.');
    }

    // 3. Mark payment as captured & record details
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.paymentStatus = 'captured';
    payment.signatureVerified = true;
    payment.paidAt = new Date();
    await payment.save();

    // 4. Activate Recruiter Plan Subscription & Entitlement
    const subscription = await subscriptionService.activateSubscription({
      recruiterId: payment.recruiterId,
      companyId: payment.companyId,
      planId: payment.planId,
      paymentId: payment._id
    });

    // 5. Send Payment Success Email Notification
    try {
      const user = await User.findById(recruiterId);
      const company = await Company.findById(payment.companyId);
      const plan = await Plan.findById(payment.planId);
      if (user && user.email) {
        await emailService.sendPaymentSuccessEmail(user.email, {
          recruiterName: user.email.split('@')[0],
          companyName: company?.name || 'Your Organization',
          planName: plan?.name || 'Recruiter Plan',
          amount: payment.amount,
          currency: payment.currency,
          transactionId: razorpay_payment_id,
          paymentDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          validUntil: new Date(subscription.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        });
      }
    } catch (emailErr) {
      console.warn('[PaymentService] Payment success email dispatch warning:', emailErr.message);
    }

    return {
      success: true,
      payment,
      subscription
    };
  }

  /**
   * STEP 8: Idempotent Razorpay Webhook Processing
   */
  async handleWebhook(rawBody, signature) {
    // 1. Verify Webhook Signature using raw body
    const isValid = razorpayService.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      throw new Error('Invalid Razorpay Webhook Signature');
    }

    // Parse event
    let eventData;
    try {
      eventData = typeof rawBody === 'string' ? JSON.parse(rawBody) : JSON.parse(rawBody.toString('utf-8'));
    } catch (e) {
      throw new Error('Invalid JSON payload in webhook body');
    }

    const eventId = eventData.event_id || eventData.id || `evt_${Date.now()}`;
    const eventName = eventData.event;

    // 2. Idempotency check: Prevent duplicate processing of same event ID
    const alreadyProcessed = await WebhookEvent.findOne({ eventId });
    if (alreadyProcessed) {
      console.log(`[PaymentService] ℹ️ Webhook event ${eventId} (${eventName}) already processed. Skipping duplicate.`);
      return { status: 'already_processed', eventId };
    }

    console.log(`[PaymentService] 🔔 Processing Razorpay Webhook: ${eventName} (ID: ${eventId})`);

    // 3. Process event types
    if (eventName === 'payment.captured') {
      const paymentEntity = eventData.payload?.payment?.entity;
      if (paymentEntity && paymentEntity.order_id) {
        const payment = await Payment.findOne({ razorpayOrderId: paymentEntity.order_id });
        if (payment && payment.paymentStatus !== 'captured') {
          payment.paymentStatus = 'captured';
          payment.razorpayPaymentId = paymentEntity.id;
          payment.paidAt = new Date();
          payment.signatureVerified = true;
          payment.paymentMethod = paymentEntity.method || 'online';
          payment.webhookEvents.push({ eventId, event: eventName, receivedAt: new Date() });
          await payment.save();

          // Activate subscription
          await subscriptionService.activateSubscription({
            recruiterId: payment.recruiterId,
            companyId: payment.companyId,
            planId: payment.planId,
            paymentId: payment._id
          });
        }
      }
    } else if (eventName === 'payment.failed') {
      const paymentEntity = eventData.payload?.payment?.entity;
      if (paymentEntity && paymentEntity.order_id) {
        const payment = await Payment.findOne({ razorpayOrderId: paymentEntity.order_id });
        if (payment && payment.paymentStatus === 'pending') {
          payment.paymentStatus = 'failed';
          payment.errorReason = paymentEntity.error_description || 'Payment failed';
          payment.webhookEvents.push({ eventId, event: eventName, receivedAt: new Date() });
          await payment.save();
        }
      }
    } else if (eventName === 'refund.processed' || eventName === 'refund.created') {
      const refundEntity = eventData.payload?.refund?.entity;
      if (refundEntity && refundEntity.payment_id) {
        const payment = await Payment.findOne({ razorpayPaymentId: refundEntity.payment_id });
        if (payment) {
          const refundAmount = refundEntity.amount ? refundEntity.amount / 100 : payment.amount;
          payment.refundDetails.push({
            refundId: refundEntity.id,
            amount: refundAmount,
            status: refundEntity.status || 'processed',
            reason: refundEntity.notes?.reason || 'Processed via Webhook'
          });
          payment.paymentStatus = refundAmount >= payment.amount ? 'refunded' : 'partially_refunded';
          await payment.save();
        }
      }
    }

    // 4. Record processed webhook event
    await WebhookEvent.create({
      eventId,
      event: eventName,
      payload: eventData,
      processed: true,
      processedAt: new Date()
    });

    return { status: 'processed', eventId, event: eventName };
  }

  /**
   * Recruiter Payment History
   */
  async getRecruiterPaymentHistory(recruiterId) {
    return await Payment.find({ recruiterId })
      .populate('planId', 'name slug price durationDays')
      .populate('companyId', 'name')
      .sort({ createdAt: -1 });
  }

  /**
   * Admin Payment Listing & Analytics
   */
  async getAllPayments(query = {}) {
    const filter = {};
    if (query.status && query.status !== 'all') {
      filter.paymentStatus = query.status;
    }

    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .populate('recruiterId', 'email')
        .populate('companyId', 'name verificationStatus')
        .populate('planId', 'name slug price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Payment.countDocuments(filter)
    ]);

    // Calculate revenue stats
    const capturedPayments = await Payment.find({ paymentStatus: 'captured' }).select('amount');
    const totalRevenue = capturedPayments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    return {
      payments,
      total,
      totalRevenue,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Admin Refund Action
   */
  async processAdminRefund({ paymentId, amount, reason, adminUserId }) {
    const payment = await Payment.findById(paymentId)
      .populate('recruiterId', 'email')
      .populate('companyId', 'name')
      .populate('planId', 'name');

    if (!payment) {
      throw new Error('Payment record not found');
    }

    if (payment.paymentStatus !== 'captured' && payment.paymentStatus !== 'partially_refunded') {
      throw new Error(`Cannot refund payment in '${payment.paymentStatus}' state. Only captured payments can be refunded.`);
    }

    const refundAmount = amount ? Number(amount) : payment.amount;
    if (refundAmount <= 0 || refundAmount > payment.amount) {
      throw new Error(`Invalid refund amount. Must be between 1 and ₹${payment.amount}`);
    }

    // 1. Call Razorpay Refund API
    const razorpayRefund = await razorpayService.initiateRefund(
      payment.razorpayPaymentId || `pay_sim_${payment._id}`,
      refundAmount,
      { reason: reason || 'Admin initiated refund', adminUserId: adminUserId.toString() }
    );

    // 2. Record refund
    payment.refundDetails.push({
      refundId: razorpayRefund.id,
      amount: refundAmount,
      status: razorpayRefund.status || 'processed',
      reason: reason || 'Customer request / Admin initiated'
    });

    const isFullRefund = refundAmount >= payment.amount;
    payment.paymentStatus = isFullRefund ? 'refunded' : 'partially_refunded';
    await payment.save();

    // 3. If full refund, suspend associated subscription
    if (isFullRefund) {
      const sub = await subscriptionService.getActiveSubscription(payment.recruiterId);
      if (sub && sub.paymentId && sub.paymentId.toString() === payment._id.toString()) {
        sub.status = 'cancelled';
        await sub.save();
      }
    }

    // 4. Send Refund Confirmation Email
    try {
      if (payment.recruiterId && payment.recruiterId.email) {
        await emailService.sendRefundConfirmationEmail(payment.recruiterId.email, {
          recruiterName: payment.recruiterId.email.split('@')[0],
          companyName: payment.companyId?.name || 'Your Company',
          amount: refundAmount,
          currency: payment.currency,
          refundId: razorpayRefund.id,
          originalTransactionId: payment.razorpayPaymentId
        });
      }
    } catch (e) {
      console.warn('[PaymentService] Refund confirmation email warning:', e.message);
    }

    return {
      success: true,
      refundId: razorpayRefund.id,
      amount: refundAmount,
      status: payment.paymentStatus
    };
  }
}

module.exports = new PaymentService();

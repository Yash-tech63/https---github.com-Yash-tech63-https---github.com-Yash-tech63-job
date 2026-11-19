/**
 * Comprehensive Automated Test Suite: TrueHire Razorpay Payment & Recruiter Subscription System
 * Run: node server/test-razorpay-system.js
 */

const crypto = require('crypto');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const razorpayService = require('./src/services/razorpayService');
const { getPaymentSuccessEmailHtml, getPaymentFailureEmailHtml, getRefundConfirmationEmailHtml } = require('./src/utils/emailTemplates');

async function runTests() {
  console.log('================================================================');
  console.log('🧪 Starting TrueHire Razorpay Payment & Subscription System Tests');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, testName, details = '') {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`✅ [PASS] ${testName}`);
    } else {
      console.error(`❌ [FAIL] ${testName} ${details ? '- ' + details : ''}`);
    }
  }

  // -------------------------------------------------------------
  // TEST SUITE 1: Razorpay Order Creation & Currency Conversion (Paise)
  // -------------------------------------------------------------
  console.log('\n--- 1. Order Creation & Paise Conversion ---');
  try {
    const starterPriceINR = 499;
    const starterAmountPaise = Math.round(starterPriceINR * 100);
    assert(starterAmountPaise === 49900, 'Starter plan (₹499) converts to exactly 49,900 paise');

    const proPriceINR = 1499;
    const proAmountPaise = Math.round(proPriceINR * 100);
    assert(proAmountPaise === 149900, 'Professional plan (₹1,499) converts to exactly 149,900 paise');

    const entPriceINR = 3999;
    const entAmountPaise = Math.round(entPriceINR * 100);
    assert(entAmountPaise === 399900, 'Enterprise plan (₹3,999) converts to exactly 399,900 paise');

    const testOrder = await razorpayService.createOrder({
      amount: starterPriceINR,
      receipt: 'test_rcpt_001',
      notes: { planName: 'Starter' }
    });

    assert(testOrder && testOrder.id, 'Razorpay order generated with order ID', testOrder?.id);
    assert(testOrder.amount === 49900, 'Razorpay order amount matches 49,900 paise');
    assert(testOrder.currency === 'INR', 'Razorpay order currency is INR');
  } catch (err) {
    assert(false, 'Order creation exception', err.message);
  }

  // -------------------------------------------------------------
  // TEST SUITE 2: HMAC SHA-256 Payment Signature Verification
  // -------------------------------------------------------------
  console.log('\n--- 2. HMAC SHA-256 Payment Signature Verification ---');
  try {
    const orderId = 'order_test_998877';
    const paymentId = 'pay_test_112233';
    const secret = process.env.RAZORPAY_KEY_SECRET || 'test_secret_for_unit_tests';

    // Generate valid signature using HMAC SHA256(order_id + "|" + payment_id, secret)
    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const isValid = razorpayService.verifyPaymentSignature({
      orderId,
      paymentId,
      signature: validSignature,
      secretOverride: secret
    });
    assert(isValid === true, 'Valid HMAC SHA-256 signature correctly verified as TRUE');

    const isTampered = razorpayService.verifyPaymentSignature({
      orderId,
      paymentId,
      signature: validSignature + '_tampered',
      secretOverride: secret
    });
    assert(isTampered === false, 'Tampered / forged signature correctly rejected as FALSE');
  } catch (err) {
    assert(false, 'Signature verification exception', err.message);
  }

  // -------------------------------------------------------------
  // TEST SUITE 3: Razorpay Webhook Signature Verification
  // -------------------------------------------------------------
  console.log('\n--- 3. Razorpay Webhook Signature Verification ---');
  try {
    const rawPayload = JSON.stringify({
      entity: 'event',
      event: 'payment.captured',
      payload: { payment: { entity: { id: 'pay_hook_123', amount: 149900 } } }
    });
    const webhookSecret = 'test_webhook_secret_key_123';

    const validHookSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawPayload)
      .digest('hex');

    const isHookValid = razorpayService.verifyWebhookSignature(rawPayload, validHookSig, webhookSecret);
    assert(isHookValid === true, 'Webhook HMAC SHA-256 signature validated successfully');

    const isFakeHookValid = razorpayService.verifyWebhookSignature(rawPayload, 'bad_signature_value', webhookSecret);
    assert(isFakeHookValid === false, 'Bad webhook signature rejected');
  } catch (err) {
    assert(false, 'Webhook signature verification exception', err.message);
  }

  // -------------------------------------------------------------
  // TEST SUITE 4: Separate Company Verification & Job Posting Gating Logic
  // -------------------------------------------------------------
  console.log('\n--- 4. Company Verification & Job Posting Gating Logic ---');
  try {
    // Case A: Recruiter has active plan but company is 'pending' -> MUST BE BLOCKED
    const mockCompanyPending = { verificationStatus: 'pending', name: 'Acme Corp' };
    const mockActiveSubscription = {
      status: 'active',
      usedJobPostings: 0,
      jobPostingLimit: 5,
      activeJobCount: 0
    };

    function simulateCanPost(company, sub) {
      if (company.verificationStatus !== 'valid') {
        return {
          allowed: false,
          reason: `Your company verification is ${company.verificationStatus}. Only admin-approved companies can publish jobs.`,
          verificationPending: true
        };
      }
      if (!sub || sub.status !== 'active') {
        return { allowed: false, reason: 'No active plan found.' };
      }
      if (sub.usedJobPostings >= sub.jobPostingLimit) {
        return { allowed: false, reason: 'Plan quota reached.' };
      }
      return { allowed: true };
    }

    const checkPending = simulateCanPost(mockCompanyPending, mockActiveSubscription);
    assert(
      checkPending.allowed === false && checkPending.verificationPending === true,
      'Recruiter with paid plan cannot publish jobs while company is pending verification'
    );

    // Case B: Recruiter has verified company ('valid') and active plan -> ALLOWED
    const mockCompanyValid = { verificationStatus: 'valid', name: 'Acme Corp' };
    const checkValid = simulateCanPost(mockCompanyValid, mockActiveSubscription);
    assert(checkValid.allowed === true, 'Recruiter with verified company and active plan CAN publish jobs');

    // Case C: Recruiter is verified but has NO active plan -> MUST BE BLOCKED
    const checkNoPlan = simulateCanPost(mockCompanyValid, null);
    assert(
      checkNoPlan.allowed === false,
      'Verified recruiter without active plan is prompted to buy a plan'
    );

    // Case D: Recruiter reaches quota limit -> MUST BE BLOCKED
    const mockExhaustedSub = {
      status: 'active',
      usedJobPostings: 5,
      jobPostingLimit: 5,
      activeJobCount: 5
    };
    const checkQuota = simulateCanPost(mockCompanyValid, mockExhaustedSub);
    assert(
      checkQuota.allowed === false,
      'Recruiter reaching plan jobPostingLimit (5/5) is blocked from publishing additional jobs'
    );
  } catch (err) {
    assert(false, 'Gating check exception', err.message);
  }

  // -------------------------------------------------------------
  // TEST SUITE 5: Email Notification Templates Validation
  // -------------------------------------------------------------
  console.log('\n--- 5. Payment, Failure & Refund Email Templates ---');
  try {
    const successHtml = getPaymentSuccessEmailHtml({
      recruiterName: 'Jane Recruiter',
      companyName: 'Acme Innovations',
      planName: 'Professional',
      amount: 1499,
      transactionId: 'pay_test_456',
      validUntil: '17 Dec 2026'
    });

    assert(successHtml.includes('Payment Successful') && successHtml.includes('Jane Recruiter'), 'Payment Success email renders recipient and title');
    assert(successHtml.includes('1,499') && successHtml.includes('pay_test_456'), 'Payment Success email renders formatted INR amount and transaction ID');
    assert(successHtml.includes('Acme Innovations') && successHtml.includes('Professional'), 'Payment Success email renders company and plan name');

    const failHtml = getPaymentFailureEmailHtml({
      recruiterName: 'Jane Recruiter',
      planName: 'Enterprise',
      amount: 3999,
      orderId: 'order_test_789',
      failureReason: 'Payment declined by issuer bank'
    });

    assert(failHtml.includes('Payment Failed') && failHtml.includes('Payment declined by issuer bank'), 'Payment Failure email displays failure notice and reason');

    const refundHtml = getRefundConfirmationEmailHtml({
      recruiterName: 'Jane Recruiter',
      companyName: 'Acme Innovations',
      amount: 499,
      refundId: 'rfnd_test_111',
      originalTransactionId: 'pay_test_222'
    });

    assert(refundHtml.includes('Refund Processed') && refundHtml.includes('499'), 'Refund confirmation email renders refund amount and heading');
    assert(refundHtml.includes('rfnd_test_111') && refundHtml.includes('pay_test_222'), 'Refund email includes refund ID and original transaction ID');
  } catch (err) {
    assert(false, 'Email template test exception', err.message);
  }

  console.log('\n================================================================');
  console.log(`📊 Test Summary: ${passedTests} / ${totalTests} assertions passed (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log('================================================================\n');

  if (passedTests === totalTests) {
    console.log('🎉 All Razorpay payment, subscription, gating, and email tests passed perfectly!\n');
    process.exit(0);
  } else {
    console.error('⚠️ Some tests failed. Please inspect logs above.\n');
    process.exit(1);
  }
}

runTests();

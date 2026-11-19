import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { paymentService } from '../../services/paymentService';
import { Button } from '../common/Button';
import { ShieldCheck, AlertCircle, Loader2, Sparkles, X } from 'lucide-react';

/**
 * Loads Razorpay official script dynamically
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * RazorpayCheckout Component & Handler
 */
export const RazorpayCheckoutModal = ({
  isOpen,
  onClose,
  plan,
  onSuccess,
  onError
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testOrderData, setTestOrderData] = useState(null);

  if (!isOpen || !plan) return null;

  const handleInitiatePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Create Order on Backend
      const res = await paymentService.createOrder(plan._id);
      const orderData = res.data;

      // Step 2: Load Razorpay checkout script
      const scriptLoaded = await loadRazorpayScript();

      // Check if real key or test placeholder
      const isPlaceholder = !orderData.keyId || orderData.keyId.includes('placeholder');

      if (!scriptLoaded || isPlaceholder) {
        setTestOrderData(orderData);
        setLoading(false);
        return;
      }

      // Step 3: Configure Razorpay Checkout options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'TrueHire Recruitment Solutions',
        description: `${orderData.plan?.name || plan.name} Subscription Plan`,
        image: 'https://cdn-icons-png.flaticon.com/512/9497/9497086.png',
        order_id: orderData.orderId,
        prefill: {
          name: orderData.company?.name || 'Recruiter',
          email: orderData.user?.email || ''
        },
        theme: {
          color: '#202124',
          backdrop_color: 'rgba(32, 33, 36, 0.7)'
        },
        handler: async function (response) {
          try {
            setLoading(true);
            const verifyRes = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            setLoading(false);
            if (onSuccess) onSuccess(verifyRes.data);
            onClose();
          } catch (vErr) {
            setLoading(false);
            const msg = vErr.response?.data?.message || 'Payment verification failed';
            setError(msg);
            if (onError) onError(msg);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function (response) {
        setError(response.error?.description || 'Payment transaction failed');
        setLoading(false);
      });
      razorpayInstance.open();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to initialize payment';
      setError(errMsg);
      if (onError) onError(errMsg);
      setLoading(false);
    }
  };

  // Simulated Test Verification for local development with test credentials
  const handleSimulatedVerification = async (shouldSucceed = true) => {
    if (!testOrderData) return;
    setLoading(true);
    setError(null);

    try {
      if (!shouldSucceed) {
        throw new Error('Transaction cancelled by user or test card declined.');
      }

      const mockPaymentId = `pay_sim_${Date.now()}`;
      const verifyRes = await paymentService.verifyPayment({
        razorpay_order_id: testOrderData.orderId,
        razorpay_payment_id: mockPaymentId,
        razorpay_signature: `sim_sig_${testOrderData.orderId}_${mockPaymentId}`
      });

      setLoading(false);
      if (onSuccess) onSuccess(verifyRes.data);
      onClose();
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || err.message || 'Verification failed';
      setError(msg);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202124]/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-[#E9E6DF] shadow-2xl overflow-hidden bg-[#FFFFFF] text-[#202124]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E9E6DF]">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] flex items-center justify-center text-[#C6A15B]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#202124]">Razorpay Secure Checkout</h3>
                <p className="text-xs text-[#666666]">256-bit SSL encrypted payment</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#666666] hover:text-[#202124] hover:bg-[#FAF9F6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Plan Summary */}
          <div className="mt-6 p-4 rounded-2xl bg-[#FAF9F6] border border-[#E9E6DF] space-y-3">
            <div className="flex justify-between items-baseline">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#666666]">Selected Plan</span>
                <h4 className="text-xl font-extrabold text-[#202124]">{plan.name}</h4>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[#202124]">₹{plan.price.toLocaleString('en-IN')}</span>
                <span className="text-xs text-[#666666] block">
                  {plan.billingType === 'per_job' ? 'per job posting' : '/ 30 days'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E9E6DF] grid grid-cols-2 gap-2 text-xs text-[#202124]">
              <div>
                <span className="text-[#666666]">Postings limit: </span>
                <strong className="text-[#202124]">{plan.jobPostingLimit} Jobs</strong>
              </div>
              <div>
                <span className="text-[#666666]">Validity: </span>
                <strong className="text-[#202124]">{plan.durationDays || 30} Days</strong>
              </div>
            </div>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="mt-4 p-3 rounded-xl bg-[#FAF9F6] border border-[#202124] text-[#202124] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#C6A15B]" />
              <span>{error}</span>
            </div>
          )}

          {/* Test Simulation Panel */}
          {testOrderData ? (
            <div className="mt-5 p-4 rounded-2xl bg-[#FAF9F6] border border-[#E9E6DF] space-y-3">
              <div className="flex items-center gap-2 text-[#202124] text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-[#C6A15B]" />
                <span>Test Gateway Mode</span>
              </div>
              <p className="text-xs text-[#666666]">
                Razorpay test order <code className="text-[#202124] font-mono">{testOrderData.orderId}</code> generated.
                Simulate payment authorization or card decline:
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  variant="primary"
                  onClick={() => handleSimulatedVerification(true)}
                  disabled={loading}
                  className="w-full text-xs"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : '✓ Simulate Success'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSimulatedVerification(false)}
                  disabled={loading}
                  className="w-full text-xs text-[#666666] hover:text-[#202124] border-[#E9E6DF]"
                >
                  ✕ Simulate Failure
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              <Button
                variant="primary"
                onClick={handleInitiatePayment}
                disabled={loading}
                className="w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting to Razorpay...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹{plan.price.toLocaleString('en-IN')} with Razorpay</span>
                  </>
                )}
              </Button>
              <p className="text-center text-[11px] text-[#666666]">
                Supports UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, and Wallets.
              </p>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-[#E9E6DF] text-center text-[10px] text-[#666666] flex items-center justify-center gap-1">
            <span>Powered by Razorpay Payments</span>
            <span>•</span>
            <span>TrueHire SaaS Marketplace</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RazorpayCheckoutModal;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Mail,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { Button } from '../../components/common/Button';

export const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyLoginOtp, resendLoginOtp } = useAuth();

  const [challengeId, setChallengeId] = useState(location.state?.challengeId || null);
  const initialEmail = location.state?.email || 'alex.dev@stanford.edu';
  const initialPurpose = location.state?.purpose || 'login';

  const [email, setEmail] = useState(initialEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState(initialEmail);

  // 6 OTP digit boxes
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef([]);

  // States: 'idle' | 'loading' | 'success' | 'error'
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [previewCode, setPreviewCode] = useState(location.state?.previewOtp || '');

  // Resend Countdown Timer (starts at 60 seconds)
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendNotice, setResendNotice] = useState('');

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Handle single digit input
  const handleChange = (index, value) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    const digit = cleaned.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setStatus('idle');
    setErrorMessage('');

    if (index < 5) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace and navigation keys
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        setActiveIndex(index - 1);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste for quick verification
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    setOtp(newOtp);
    setStatus('idle');
    setErrorMessage('');

    const nextIndex = Math.min(pastedData.length, 5);
    setActiveIndex(nextIndex);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async (e) => {
    e?.preventDefault();
    const fullOtp = otp.join('');

    if (fullOtp.length !== 6) {
      setStatus('error');
      setErrorMessage('Please enter all 6 digits of your verification code.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      if (challengeId) {
        const res = await verifyLoginOtp(challengeId, fullOtp);
        setStatus('success');
        setTimeout(() => {
          const user = res?.user || res;
          if (user?.role === 'admin') navigate('/admin/dashboard', { replace: true });
          else if (user?.role === 'recruiter') navigate('/recruiter/dashboard', { replace: true });
          else navigate('/candidate/dashboard', { replace: true });
        }, 800);
      } else {
        await authService.verifyOtp({
          email,
          otp: fullOtp,
          purpose: initialPurpose
        });
        setStatus('success');
        setTimeout(() => {
          navigate('/candidate/dashboard');
        }, 800);
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(
        err.response?.data?.message ||
        err.message ||
        'Verification failed. The code may be incorrect or expired.'
      );
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    setResendNotice('');
    setErrorMessage('');

    try {
      if (challengeId) {
        const res = await resendLoginOtp(challengeId);
        if (res?.challengeId) {
          setChallengeId(res.challengeId);
        }
      } else {
        const res = await authService.sendOtp({ email, purpose: initialPurpose });
        if (res?.data?.previewOtp) {
          setPreviewCode(res.data.previewOtp);
        }
      }
      setResendNotice('New 6-digit verification code has been dispatched to your email.');
      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      setStatus('idle');
      inputRefs.current[0]?.focus();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to resend verification code');
    } finally {
      setIsResending(false);
    }
  };

  const handleUpdateEmail = (e) => {
    e.preventDefault();
    if (newEmailInput && newEmailInput.includes('@')) {
      setEmail(newEmailInput);
      setIsEditingEmail(false);
      authService.sendOtp({ email: newEmailInput, purpose: initialPurpose })
        .then((res) => {
          if (res?.data?.previewOtp) setPreviewCode(res.data.previewOtp);
          setResendNotice(`Verification code sent to ${newEmailInput}`);
          setCountdown(60);
          setCanResend(false);
          setOtp(['', '', '', '', '', '']);
        })
        .catch(() => {});
    }
  };

  const handleQuickFill = (codeToFill) => {
    const chars = codeToFill.split('');
    setOtp(chars);
    setStatus('idle');
    setErrorMessage('');
    inputRefs.current[5]?.focus();
  };

  const formattedCountdown = `0:${countdown < 10 ? '0' : ''}${countdown}`;

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-12 relative bg-[#FAF9F6] text-[#202124]">
      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Top Branding & Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#202124] text-[#C6A15B] flex items-center justify-center mx-auto shadow-subtle border border-[#C6A15B]/30">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#202124]">
            Verify Your Email
          </h1>

          <div className="flex items-center justify-center gap-1.5 text-xs text-[#666666] flex-wrap">
            <span>We sent a 6-digit code to</span>
            {!isEditingEmail ? (
              <span className="font-semibold text-[#202124] inline-flex items-center gap-1 bg-[#FFFFFF] px-2.5 py-0.5 rounded-lg border border-[#E9E6DF]">
                <Mail className="w-3 h-3 text-[#C6A15B]" />
                {email}
                <button
                  type="button"
                  onClick={() => setIsEditingEmail(true)}
                  className="ml-1 text-[10px] text-[#C6A15B] hover:text-[#A98443] underline cursor-pointer font-bold"
                >
                  Change
                </button>
              </span>
            ) : (
              <form onSubmit={handleUpdateEmail} className="inline-flex items-center gap-1">
                <input
                  type="email"
                  value={newEmailInput}
                  onChange={(e) => setNewEmailInput(e.target.value)}
                  className="px-2 py-0.5 text-xs bg-[#FFFFFF] border border-[#C6A15B] rounded-md text-[#202124] focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2 py-0.5 bg-[#C6A15B] text-[#202124] rounded text-[11px] font-bold"
                >
                  Save
                </button>
              </form>
            )}
          </div>
        </div>

        {/* OTP Verification Card */}
        <div className="rounded-2xl p-6 sm:p-8 border border-[#E9E6DF] bg-[#FFFFFF] shadow-card relative overflow-hidden">
          {/* Feedback Alerts */}
          <AnimatePresence mode="wait">
            {status === 'error' && errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-5 p-3 rounded-xl bg-[#FAF9F6] border border-[#A98443] text-[#202124] text-xs flex items-center gap-2 font-medium"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-[#C6A15B]" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {resendNotice && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-5 p-3 rounded-xl bg-[#FAF9F6] border border-[#C6A15B] text-[#202124] text-xs flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#C6A15B]" />
                <span>{resendNotice}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SUCCESS STATE ANIMATION */}
          <AnimatePresence>
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="py-8 flex flex-col items-center justify-center text-center space-y-3"
              >
                <div className="w-16 h-16 rounded-full bg-[#FAF9F6] border border-[#C6A15B] text-[#C6A15B] flex items-center justify-center shadow-subtle">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-xl font-bold text-[#202124]">Identity Verified</h3>
                <p className="text-xs text-[#666666]">
                  Redirecting safely to your TrueHire account workspace...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ACTIVE OTP FORM */}
          {status !== 'success' && (
            <form onSubmit={handleVerify} className="space-y-6">
              {/* Six individual OTP input boxes */}
              <div
                className="flex items-center justify-center gap-2 sm:gap-3"
                onPaste={handlePaste}
              >
                {otp.map((digit, idx) => {
                  const isFilled = !!digit;
                  const isActive = activeIndex === idx;

                  return (
                    <div key={idx} className="relative">
                      <input
                        ref={(el) => (inputRefs.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onFocus={() => setActiveIndex(idx)}
                        onChange={(e) => handleChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        className={`w-11 h-14 sm:w-13 sm:h-16 text-xl sm:text-2xl font-bold font-mono text-center rounded-xl sm:rounded-2xl bg-[#FAF9F6] text-[#202124] transition-all duration-200 outline-none select-none ${
                          isActive
                            ? 'border-2 border-[#C6A15B] bg-[#FFFFFF]'
                            : isFilled
                            ? 'border border-[#C6A15B] bg-[#FFFFFF]'
                            : 'border border-[#E9E6DF] hover:border-[#C6A15B]'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3.5 text-sm font-bold shadow-gold"
                isLoading={status === 'loading'}
                disabled={status === 'loading' || otp.join('').length < 6}
              >
                <span>Verify &amp; Continue</span>
                <ArrowRight className="w-4 h-4 ml-2 inline-block text-[#202124]" />
              </Button>

              {/* Resend Countdown & Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#666666]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>Didn't receive the email?</span>
                </div>

                <div className="flex items-center">
                  <AnimatePresence mode="wait">
                    {!canResend ? (
                      <span className="text-[#666666] font-medium inline-flex items-center gap-1">
                        Resend in <span className="text-[#202124] font-mono font-bold">{formattedCountdown}</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending}
                        className="text-[#C6A15B] hover:text-[#A98443] hover:underline font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                        <span>Resend Code</span>
                      </button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </form>
          )}

          {/* Quick-Fill Helper for Testing */}
          <div className="mt-6 pt-5 border-t border-[#E9E6DF]">
            <div className="flex items-center justify-between text-[11px] text-[#666666]">
              <span>Test Quick Fill:</span>
              <div className="flex items-center gap-2">
                {previewCode && (
                  <button
                    type="button"
                    onClick={() => handleQuickFill(previewCode)}
                    className="px-2 py-1 rounded-lg bg-[#FAF9F6] hover:bg-[#E9E6DF] text-[#202124] font-mono border border-[#E9E6DF] transition-colors"
                  >
                    Sent Code: {previewCode}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleQuickFill('123456')}
                  className="px-2 py-1 rounded-lg bg-[#FAF9F6] hover:bg-[#E9E6DF] text-[#202124] font-mono border border-[#E9E6DF] transition-colors"
                >
                  Fill 123456
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Password Login */}
        <div className="flex items-center justify-between text-xs text-[#666666] px-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-[#666666] hover:text-[#C6A15B] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Role Selection</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;

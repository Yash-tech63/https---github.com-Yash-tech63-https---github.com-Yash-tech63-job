import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const EmailOTPVerification = ({
  challengeId: initialChallengeId,
  email,
  expectedRole,
  onSuccess,
  onBack
}) => {
  const { verifyLoginOtp, resendLoginOtp } = useAuth();
  const [challengeId, setChallengeId] = useState(initialChallengeId);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef([]);

  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendNotice, setResendNotice] = useState('');

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const maskEmail = (rawEmail) => {
    if (!rawEmail) return '';
    const parts = rawEmail.split('@');
    if (parts.length !== 2) return rawEmail;
    const name = parts[0];
    const domain = parts[1];
    if (name.length <= 2) {
      return `${name[0]}*@${domain}`;
    }
    const maskedName = `${name[0]}${'*'.repeat(Math.min(name.length - 2, 4))}${name[name.length - 1]}`;
    return `${maskedName}@${domain}`;
  };

  const handleDigitChange = (index, value) => {
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

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || '';
    }
    setOtp(newOtp);
    setStatus('idle');
    setErrorMessage('');

    const nextIndex = Math.min(pasted.length, 5);
    setActiveIndex(nextIndex);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async (e) => {
    e?.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      setStatus('error');
      setErrorMessage('Please enter all 6 digits of the verification code.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const result = await verifyLoginOtp(challengeId, code, expectedRole);
      setStatus('success');
      setTimeout(() => {
        const authenticatedUser = result?.user || result;
        onSuccess(authenticatedUser);
      }, 500);
    } catch (err) {
      console.error('OTP verification failed:', err);
      setStatus('error');
      setErrorMessage(
        err?.response?.data?.message ||
        err?.message ||
        'Invalid or expired code. Please try again.'
      );
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    setResendNotice('');
    setErrorMessage('');

    try {
      const res = await resendLoginOtp(challengeId);
      if (res?.challengeId) {
        setChallengeId(res.challengeId);
      }
      setResendNotice('A new 6-digit code has been delivered to your inbox.');
      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      setActiveIndex(0);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message ||
        'Could not resend OTP. Please wait a moment and try again.'
      );
      setStatus('error');
    } finally {
      setIsResending(false);
    }
  };

  const formattedCountdown = `${Math.floor(countdown / 60)}:${(countdown % 60)
    .toString()
    .padStart(2, '0')}`;

  return (
    <div className="space-y-5">
      {/* Informative Header */}
      <div className="text-center space-y-1.5">
        <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] flex items-center justify-center mx-auto text-[#C6A15B]">
          <Mail className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-[#202124]">Two-Step Security Verification</h3>
        <p className="text-xs text-[#666666] max-w-xs mx-auto leading-relaxed">
          We sent a 6-digit code to{' '}
          <span className="font-mono text-[#202124] font-semibold">{maskEmail(email)}</span>
        </p>
      </div>

      {/* Error / Resend Banners */}
      {status === 'error' && errorMessage && (
        <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#A98443] text-[#202124] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#C6A15B]" />
          <span>{errorMessage}</span>
        </div>
      )}

      {resendNotice && (
        <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#C6A15B] text-[#202124] text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#C6A15B]" />
          <span>{resendNotice}</span>
        </div>
      )}

      {/* Success State */}
      {status === 'success' && (
        <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#FAF9F6] border border-[#C6A15B] text-[#C6A15B] flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-[#C6A15B]" />
          </div>
          <h3 className="text-sm font-bold text-[#202124]">Verification Successful</h3>
          <p className="text-xs text-[#666666]">Opening your TrueHire workspace...</p>
        </div>
      )}

      {/* OTP Input Form */}
      {status !== 'success' && (
        <form onSubmit={handleVerify} className="space-y-5">
          <div
            className="flex items-center justify-center gap-2 sm:gap-2.5"
            onPaste={handlePaste}
          >
            {otp.map((digit, idx) => {
              const isActive = activeIndex === idx;
              const isInvalid = status === 'error';

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
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className={`w-10 h-12 sm:w-11 sm:h-13 text-xl font-bold font-mono text-center rounded-xl bg-[#FAF9F6] text-[#202124] transition-colors outline-none
                      ${
                        isInvalid
                          ? 'border-2 border-[#A98443] bg-[#FFFFFF]'
                          : isActive
                          ? 'border-2 border-[#C6A15B] bg-[#FFFFFF]'
                          : digit
                          ? 'border border-[#C6A15B] bg-[#FFFFFF]'
                          : 'border border-[#E9E6DF] hover:border-[#C6A15B]'
                      }
                    `}
                  />
                </div>
              );
            })}
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || otp.join('').length < 6}
            className="w-full py-2.5 px-4 rounded-xl bg-[#C6A15B] hover:bg-[#A98443] text-[#202124] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-gold"
          >
            {status === 'loading' ? (
              <span>Verifying...</span>
            ) : (
              <>
                <span>Verify &amp; Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {/* Resend Cooldown Controls */}
          <div className="flex items-center justify-between text-xs text-[#666666] pt-0.5">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Expires in 5m</span>
            </span>

            <div>
              {!canResend ? (
                <span>
                  Resend in <span className="text-[#202124] font-mono font-bold">{formattedCountdown}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-[#C6A15B] hover:text-[#A98443] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                  <span>Resend Code</span>
                </button>
              )}
            </div>
          </div>
        </form>
      )}

      {/* Back to credentials */}
      <div className="pt-1 text-center">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-xs text-[#666666] hover:text-[#C6A15B] font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Back to credentials</span>
        </button>
      </div>
    </div>
  );
};

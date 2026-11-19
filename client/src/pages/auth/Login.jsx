import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { EmailOTPVerification } from '../../components/auth/EmailOTPVerification';
import {
  GraduationCap,
  Building2,
  Shield,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';

export const Login = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRoleParam = searchParams.get('role');
  const validRoles = ['candidate', 'recruiter', 'admin'];

  // null (Role Selection View) | 'candidate' | 'recruiter' | 'admin'
  const [selectedRole, setSelectedRole] = useState(
    validRoles.includes(initialRoleParam) ? initialRoleParam : null
  );

  const [email, setEmail] = useState(() => {
    return localStorage.getItem('truehire_remembered_email') || '';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return !!localStorage.getItem('truehire_remembered_email');
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Challenge state when Candidate or Recruiter triggers OTP step
  const [otpChallenge, setOtpChallenge] = useState(null);

  // Forgot Password Modal State
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState(1);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const { user, isAuthenticated, loading: authLoading, login, forgotPassword: apiForgotPassword, resetPassword: apiResetPassword } = useAuth();
  const navigate = useNavigate();

  // Prevent authenticated users from returning to or remaining on the login page
  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.role) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'recruiter') {
        navigate('/recruiter/dashboard', { replace: true });
      } else if (user.role === 'candidate') {
        navigate('/candidate/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  useEffect(() => {
    if (selectedRole) {
      setSearchParams({ role: selectedRole }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [selectedRole, setSearchParams]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError('');
    setPassword('');
  };

  const handleBackToRoleSelection = () => {
    setSelectedRole(null);
    setOtpChallenge(null);
    setError('');
    setPassword('');
  };

  const handleLoginSuccess = (loggedUser) => {
    if (!loggedUser || !loggedUser.role) return;

    if (rememberMe && email) {
      localStorage.setItem('truehire_remembered_email', email);
    } else {
      localStorage.removeItem('truehire_remembered_email');
    }

    // Role-based redirection using actual backend role
    if (loggedUser.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    } else if (loggedUser.role === 'recruiter') {
      navigate('/recruiter/dashboard', { replace: true });
    } else if (loggedUser.role === 'candidate') {
      navigate('/candidate/dashboard', { replace: true });
    } else {
      navigate('/jobs', { replace: true });
    }
  };

  const handleLoginSubmit = async (e) => {
    e?.preventDefault();
    if (isLoading) return;

    setError('');
    setIsLoading(true);

    try {
      const res = await login(email.trim(), password, selectedRole);

      if (res && res.requiresOtp) {
        setOtpChallenge({
          challengeId: res.challengeId,
          email: res.email,
          role: res.role
        });
        return;
      }

      const authenticatedUser = res?.user || res;
      if (authenticatedUser && authenticatedUser.role) {
        handleLoginSuccess(authenticatedUser);
      }
    } catch (err) {
      console.error('Login failed:', err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Authentication failed. Please verify your credentials.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendResetCode = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotError('Please enter your email address.');
      return;
    }
    setForgotError('');
    setForgotSuccess('');
    setIsForgotLoading(true);

    try {
      if (apiForgotPassword) {
        await apiForgotPassword(forgotEmail.trim());
      }
      setForgotSuccess('A 6-digit verification code has been sent to your email.');
      setForgotStep(2);
    } catch (err) {
      setForgotError(
        err?.response?.data?.message ||
        'Unable to send reset code. Please check the email and try again.'
      );
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setForgotError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError('Passwords do not match.');
      return;
    }

    setForgotError('');
    setForgotSuccess('');
    setIsForgotLoading(true);

    try {
      if (apiResetPassword) {
        await apiResetPassword(forgotEmail.trim(), resetCode.trim(), newPassword);
      }
      setForgotSuccess('Password updated successfully. You can now sign in.');
      setForgotStep(3);
    } catch (err) {
      setForgotError(
        err?.response?.data?.message ||
        'Failed to reset password. The code may be expired or incorrect.'
      );
    } finally {
      setIsForgotLoading(false);
    }
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false);
    setForgotStep(1);
    setForgotError('');
    setForgotSuccess('');
    setResetCode('');
    setNewPassword('');
    setConfirmPassword('');
  };

  if (authLoading && localStorage.getItem('truehire_token')) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#FAF9F6] text-[#666666] text-xs">
        Authenticating session...
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center px-4 py-12 bg-[#FAF9F6] text-[#202124]">
      {/* Brand Header */}
      <div className="w-full max-w-4xl text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E9E6DF] text-xs font-semibold text-[#202124] mb-3 shadow-subtle">
          <span className="w-2 h-2 rounded-full bg-[#C6A15B]" />
          <span>TrueHire Authentication</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#202124]">
          {selectedRole === null
            ? 'Sign in to TrueHire'
            : selectedRole === 'candidate'
            ? 'Candidate Sign In'
            : selectedRole === 'recruiter'
            ? 'Recruiter Sign In'
            : 'Admin Sign In'}
        </h1>
        <p className="mt-2 text-sm text-[#666666] max-w-md mx-auto">
          {selectedRole === null
            ? 'Select your role to access your workspace.'
            : selectedRole === 'candidate'
            ? 'Access your applications, resume, and verified job postings.'
            : selectedRole === 'recruiter'
            ? 'Post jobs, review qualified applicants, and manage hiring pipelines.'
            : 'Authorized platform administration and moderation.'}
        </p>
      </div>

      {/* VIEW 1: Three Role Selection Cards */}
      {selectedRole === null && (
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Candidate Card */}
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#E9E6DF] p-6 sm:p-7 shadow-card hover:border-[#C6A15B] transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] flex items-center justify-center text-[#C6A15B] mb-4">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FAF9F6] text-[#A98443] border border-[#C6A15B] mb-2.5">
                  Job Seekers
                </div>
                <h3 className="text-lg font-bold text-[#202124] mb-1.5">Candidate Login</h3>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Search jobs, apply and track applications with real-time status.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E9E6DF]">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('candidate')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#C6A15B] hover:bg-[#A98443] text-[#202124] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-gold"
                >
                  <span>Continue as Candidate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Recruiter Card */}
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#E9E6DF] p-6 sm:p-7 shadow-card hover:border-[#C6A15B] transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] flex items-center justify-center text-[#C6A15B] mb-4">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FAF9F6] text-[#A98443] border border-[#C6A15B] mb-2.5">
                  Employers
                </div>
                <h3 className="text-lg font-bold text-[#202124] mb-1.5">Recruiter Login</h3>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Post verified roles and manage authenticated candidates.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E9E6DF]">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('recruiter')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#202124] hover:bg-[#343538] text-[#FAF9F6] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-subtle"
                >
                  <span>Continue as Recruiter</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C6A15B]" />
                </button>
              </div>
            </div>

            {/* Admin Card */}
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#E9E6DF] p-6 sm:p-7 shadow-card hover:border-[#C6A15B] transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] flex items-center justify-center text-[#C6A15B] mb-4">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FAF9F6] text-[#202124] border border-[#E9E6DF] mb-2.5">
                  Platform
                </div>
                <h3 className="text-lg font-bold text-[#202124] mb-1.5">Admin Login</h3>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Manage users, jobs and platform trust operations.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E9E6DF]">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('admin')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#343538] hover:bg-[#202124] text-[#FAF9F6] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-subtle"
                >
                  <span>Admin Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C6A15B]" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Register Links */}
          <div className="mt-8 text-center text-xs text-[#666666] space-y-1">
            <p>
              Need a candidate account?{' '}
              <Link to="/register/candidate" className="text-[#C6A15B] hover:text-[#A98443] font-bold underline">
                Create Candidate Account
              </Link>
              {' • '}
              Hiring for an organization?{' '}
              <Link to="/register/recruiter" className="text-[#C6A15B] hover:text-[#A98443] font-bold underline">
                Register as Recruiter
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* VIEW 2: Dedicated Role Login Forms */}
      {selectedRole !== null && (
        <div className="w-full max-w-md">
          {/* Back to Role Selection */}
          <div className="mb-3">
            <button
              type="button"
              onClick={handleBackToRoleSelection}
              className="inline-flex items-center gap-1.5 text-xs text-[#666666] hover:text-[#C6A15B] font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Role Selection</span>
            </button>
          </div>

          {/* Main Login Card */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E9E6DF] p-6 sm:p-7 shadow-card">
            {/* Form Role Header Badge */}
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#E9E6DF]">
              <div>
                <h2 className="text-base font-bold text-[#202124]">
                  {selectedRole === 'candidate'
                    ? 'Candidate Sign In'
                    : selectedRole === 'recruiter'
                    ? 'Recruiter Sign In'
                    : 'Admin Sign In'}
                </h2>
                <p className="text-xs text-[#666666] mt-0.5">
                  {selectedRole === 'candidate'
                    ? 'Enter your candidate email and password'
                    : selectedRole === 'recruiter'
                    ? 'Enter your organization email and password'
                    : 'Authorized administrator credentials required'}
                </p>
              </div>
              <div className="px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize bg-[#FAF9F6] text-[#A98443] border border-[#C6A15B]">
                {selectedRole}
              </div>
            </div>

            {/* OTP Challenge Screen vs Standard Credentials Form */}
            {otpChallenge ? (
              <EmailOTPVerification
                challengeId={otpChallenge.challengeId}
                email={otpChallenge.email}
                expectedRole={selectedRole}
                onSuccess={handleLoginSuccess}
                onBack={() => {
                  setOtpChallenge(null);
                  setError('');
                }}
              />
            ) : (
              <div>
                {/* Error Banner */}
                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-[#FAF9F6] border border-[#A98443] text-[#202124] text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#C6A15B]" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#202124] mb-1">
                      {selectedRole === 'admin'
                        ? 'Authorized Admin Email'
                        : selectedRole === 'recruiter'
                        ? 'Registered Recruiter Email'
                        : 'Registered Email Address'}
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={
                          selectedRole === 'admin'
                            ? 'admin@truehire.io'
                            : selectedRole === 'recruiter'
                            ? 'recruiter@company.com'
                            : 'name@university.edu'
                        }
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder-[#666666] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#C6A15B] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-[#202124]">
                        {selectedRole === 'admin' ? 'Admin Password' : 'Password'}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(email);
                          setShowForgotPassword(true);
                        }}
                        className="text-xs text-[#C6A15B] hover:text-[#A98443] font-semibold cursor-pointer underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder-[#666666] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#C6A15B] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-[#666666] hover:text-[#202124] transition-colors cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Option */}
                  <div className="flex items-center justify-between pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-[#E9E6DF] text-[#C6A15B] focus:ring-[#C6A15B]"
                      />
                      <span className="text-xs text-[#666666]">Remember me on this device</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 rounded-xl bg-[#C6A15B] hover:bg-[#A98443] text-[#202124] text-xs font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-gold"
                    >
                      {isLoading ? (
                        <span>Authenticating...</span>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Role Specific Registration / Security Note */}
                <div className="mt-5 pt-4 border-t border-[#E9E6DF] text-center text-xs text-[#666666]">
                  {selectedRole === 'candidate' ? (
                    <p>
                      New candidate?{' '}
                      <Link
                        to="/register/candidate"
                        className="text-[#C6A15B] hover:text-[#A98443] font-bold underline"
                      >
                        Create Candidate Account
                      </Link>
                    </p>
                  ) : selectedRole === 'recruiter' ? (
                    <p>
                      New organization?{' '}
                      <Link
                        to="/register/recruiter"
                        className="text-[#C6A15B] hover:text-[#A98443] font-bold underline"
                      >
                        Create Recruiter Account
                      </Link>
                    </p>
                  ) : (
                    <div className="text-[11px] text-[#666666] flex items-center justify-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#C6A15B]" />
                      <span>Authorized personnel only. Sessions are audited.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202124]/60 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] w-full max-w-md rounded-2xl border border-[#E9E6DF] p-6 shadow-modal relative text-[#202124]">
            <button
              type="button"
              onClick={closeForgotPasswordModal}
              className="absolute top-4 right-4 text-[#666666] hover:text-[#202124] p-1 rounded-md hover:bg-[#FAF9F6] transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <h3 className="text-base font-bold text-[#202124]">Reset Your Password</h3>
              <p className="text-xs text-[#666666] mt-1">
                {forgotStep === 1
                  ? 'Enter your registered email address to receive a 6-digit password reset code.'
                  : forgotStep === 2
                  ? 'Enter the 6-digit code sent to your email and your new password.'
                  : 'Your password has been successfully updated.'}
              </p>
            </div>

            {forgotError && (
              <div className="mb-3 p-2.5 rounded-xl bg-[#FAF9F6] border border-[#A98443] text-[#202124] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#C6A15B]" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccess && forgotStep !== 3 && (
              <div className="mb-3 p-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-[#202124] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#C6A15B]" />
                <span>{forgotSuccess}</span>
              </div>
            )}

            {forgotStep === 1 && (
              <form onSubmit={handleSendResetCode} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#202124] mb-1">
                    Registered Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeForgotPasswordModal}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#666666] hover:bg-[#FAF9F6]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isForgotLoading}
                    className="px-4 py-2 rounded-xl bg-[#C6A15B] hover:bg-[#A98443] text-[#202124] text-xs font-bold transition-colors disabled:opacity-40 shadow-gold"
                  >
                    {isForgotLoading ? 'Sending...' : 'Send Reset Code'}
                  </button>
                </div>
              </form>
            )}

            {forgotStep === 2 && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#202124] mb-1">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] font-mono tracking-widest text-center focus:bg-[#FFFFFF] focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#202124] mb-1">
                    New Password (min 6 characters)
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 pr-8 py-2 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#C6A15B]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2.5 top-2.5 text-[#666666] hover:text-[#202124]"
                    >
                      {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#202124] mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="text-xs text-[#666666] hover:text-[#C6A15B] underline"
                  >
                    Resend Code
                  </button>
                  <button
                    type="submit"
                    disabled={isForgotLoading}
                    className="px-4 py-2 rounded-xl bg-[#C6A15B] hover:bg-[#A98443] text-[#202124] text-xs font-bold transition-colors disabled:opacity-40 shadow-gold"
                  >
                    {isForgotLoading ? 'Updating...' : 'Set New Password'}
                  </button>
                </div>
              </form>
            )}

            {forgotStep === 3 && (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#FAF9F6] border border-[#C6A15B] flex items-center justify-center mx-auto text-[#C6A15B]">
                  <CheckCircle2 className="w-6 h-6 text-[#C6A15B]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#202124]">Password Reset Complete</h4>
                  <p className="text-xs text-[#666666] mt-0.5">
                    You can now sign in with your new password.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmail(forgotEmail);
                    closeForgotPasswordModal();
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#C6A15B] hover:bg-[#A98443] text-[#202124] text-xs font-bold transition-colors shadow-gold"
                >
                  Proceed to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

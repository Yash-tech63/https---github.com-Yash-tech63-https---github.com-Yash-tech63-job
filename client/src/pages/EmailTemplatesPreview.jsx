import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Smartphone,
  Monitor,
  Copy,
  Check,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/common/Button';
import {
  generateOtpEmailHtml,
  generateLoginSuccessEmailHtml,
  generateApplicationSubmittedEmailHtml
} from '../utils/emailTemplates';

export const EmailTemplatesPreview = () => {
  const [activeTab, setActiveTab] = useState('otp'); // 'otp' | 'login-success' | 'application'
  const [deviceView, setDeviceView] = useState('desktop'); // 'desktop' | 'mobile'
  const [copied, setCopied] = useState(false);

  // Form controls for interactive preview customization
  const [otpCode, setOtpCode] = useState('849201');
  const [userName, setUserName] = useState('Alex Chen');
  const [recipientEmail, setRecipientEmail] = useState('alex.dev@stanford.edu');
  const [role, setRole] = useState('candidate');
  const [jobTitle, setJobTitle] = useState('Frontend Engineering Intern');
  const [companyName, setCompanyName] = useState('Linear Labs');
  const [location, setLocation] = useState('San Francisco, CA (Hybrid)');

  // Dynamic template generator based on user input
  const getHtmlContent = () => {
    switch (activeTab) {
      case 'otp':
        return generateOtpEmailHtml({
          name: userName,
          otp: otpCode,
          email: recipientEmail,
          purpose: 'Login Authentication & Trust Check'
        });
      case 'login-success':
        return generateLoginSuccessEmailHtml({
          name: userName,
          role,
          email: recipientEmail,
          loginTime: new Date().toUTCString(),
          ipAddress: '192.168.1.1 (San Francisco, CA)',
          device: 'Chrome on macOS Sonoma'
        });
      case 'application':
        return generateApplicationSubmittedEmailHtml({
          candidateName: userName,
          jobTitle,
          companyName,
          location,
          appliedAt: new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        });
      default:
        return '';
    }
  };

  const currentHtml = getHtmlContent();

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(currentHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#202124] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E9E6DF]">
          <div className="space-y-1">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-[#666666] hover:text-[#202124] transition-colors mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Back to Sign In</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#202124] flex items-center gap-2.5">
              <span>TrueHire Email Templates</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FAF9F6] text-[#202124] border border-[#E9E6DF] font-mono">
                SMTP • Inline HTML
              </span>
            </h1>
            <p className="text-xs text-[#666666]">
              Verified HTML email templates delivered via Nodemailer SMTP for Login OTP, Login Alerts, and Job Applications.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyHtml}
              icon={copied ? Check : Copy}
              className="text-xs"
            >
              {copied ? 'HTML Copied!' : 'Copy Inline HTML'}
            </Button>
            <Link to="/login">
              <Button variant="primary" size="sm" className="text-xs font-bold">
                Test Real Login OTP →
              </Button>
            </Link>
          </div>
        </div>

        {/* Tab Selection & Device Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#FFFFFF] p-2 rounded-2xl border border-[#E9E6DF] shadow-sm">
          
          {/* Template Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('otp')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'otp'
                  ? 'bg-[#202124] text-[#FAF9F6] border border-[#C6A15B]'
                  : 'text-[#666666] hover:text-[#202124] hover:bg-[#FAF9F6]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#C6A15B]" />
              <span>1. Login OTP Code</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('login-success')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'login-success'
                  ? 'bg-[#202124] text-[#FAF9F6] border border-[#C6A15B]'
                  : 'text-[#666666] hover:text-[#202124] hover:bg-[#FAF9F6]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-[#C6A15B]" />
              <span>2. Login Success Alert</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('application')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'application'
                  ? 'bg-[#202124] text-[#FAF9F6] border border-[#C6A15B]'
                  : 'text-[#666666] hover:text-[#202124] hover:bg-[#FAF9F6]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#C6A15B]" />
              <span>3. Job Application Submitted</span>
            </button>
          </div>

          {/* Device Frame Toggle */}
          <div className="flex items-center gap-1 bg-[#FAF9F6] p-1 rounded-xl border border-[#E9E6DF]">
            <button
              type="button"
              onClick={() => setDeviceView('desktop')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                deviceView === 'desktop'
                  ? 'bg-[#202124] text-[#FAF9F6] shadow-sm'
                  : 'text-[#666666] hover:text-[#202124]'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop (580px)</span>
            </button>

            <button
              type="button"
              onClick={() => setDeviceView('mobile')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                deviceView === 'mobile'
                  ? 'bg-[#202124] text-[#FAF9F6] shadow-sm'
                  : 'text-[#666666] hover:text-[#202124]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile (380px)</span>
            </button>
          </div>
        </div>

        {/* Live Controls & Interactive Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-sm text-xs">
          {activeTab === 'otp' && (
            <>
              <div>
                <label className="block text-[#666666] mb-1 font-medium">OTP Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#FAF9F6] border border-[#E9E6DF] text-[#202124] font-mono font-bold focus:border-[#C6A15B] focus:bg-[#FFFFFF] outline-none"
                />
              </div>
              <div>
                <label className="block text-[#666666] mb-1 font-medium">Recipient Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#FAF9F6] border border-[#E9E6DF] text-[#202124] focus:border-[#C6A15B] focus:bg-[#FFFFFF] outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[#666666] mb-1 font-medium">Recipient Email</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#FAF9F6] border border-[#E9E6DF] text-[#202124] focus:border-[#C6A15B] focus:bg-[#FFFFFF] outline-none"
                />
              </div>
            </>
          )}

          {activeTab === 'login-success' && (
            <>
              <div>
                <label className="block text-[#666666] mb-1 font-medium">User Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#FAF9F6] border border-[#E9E6DF] text-[#202124] focus:border-[#C6A15B] focus:bg-[#FFFFFF] outline-none"
                />
              </div>
              <div>
                <label className="block text-[#666666] mb-1 font-medium">Account Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#FAF9F6] border border-[#E9E6DF] text-[#202124] focus:border-[#C6A15B] focus:bg-[#FFFFFF] outline-none capitalize"
                >
                  <option value="candidate">Candidate</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[#666666] mb-1 font-medium">Logged-In Email</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#FAF9F6] border border-[#E9E6DF] text-[#202124] focus:border-[#C6A15B] focus:bg-[#FFFFFF] outline-none"
                />
              </div>
            </>
          )}

          {activeTab === 'application' && (
            <>
              <div>
                <label className="block text-[#666666] mb-1 font-medium">Candidate Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#FAF9F6] border border-[#E9E6DF] text-[#202124] focus:border-[#C6A15B] focus:bg-[#FFFFFF] outline-none"
                />
              </div>
              <div>
                <label className="block text-[#666666] mb-1 font-medium">Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#FAF9F6] border border-[#E9E6DF] text-[#202124] focus:border-[#C6A15B] focus:bg-[#FFFFFF] outline-none"
                />
              </div>
              <div>
                <label className="block text-[#666666] mb-1 font-medium">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#FAF9F6] border border-[#E9E6DF] text-[#202124] focus:border-[#C6A15B] focus:bg-[#FFFFFF] outline-none"
                />
              </div>
              <div>
                <label className="block text-[#666666] mb-1 font-medium">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#FAF9F6] border border-[#E9E6DF] text-[#202124] focus:border-[#C6A15B] focus:bg-[#FFFFFF] outline-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Live Email Renderer Canvas */}
        <div className="flex justify-center items-center py-6">
          <motion.div
            layout
            className={`transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl border border-[#E9E6DF] bg-[#FFFFFF] ${
              deviceView === 'mobile' ? 'w-[385px]' : 'w-full max-w-[620px]'
            }`}
          >
            {/* Device chrome mockup bar */}
            <div className="bg-[#FAF9F6] px-4 py-2.5 border-b border-[#E9E6DF] flex items-center justify-between text-[11px] text-[#666666]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E9E6DF] inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#C6A15B] inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#202124] inline-block" />
                <span className="ml-2 font-mono text-[#202124]">
                  {activeTab === 'otp'
                    ? 'subject: TrueHire – Your Login Verification Code'
                    : activeTab === 'login-success'
                    ? 'subject: Successful Login Alert – TrueHire'
                    : 'subject: Application Submitted Successfully – TrueHire'}
                </span>
              </div>
              <span className="text-[10px] text-[#666666]">
                {deviceView === 'mobile' ? '380px Mobile' : '580px Desktop'}
              </span>
            </div>

            {/* Email HTML IFrame */}
            <iframe
              title="TrueHire Email Preview"
              srcDoc={currentHtml}
              className="w-full h-[680px] border-0 bg-[#FFFFFF]"
            />
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default EmailTemplatesPreview;

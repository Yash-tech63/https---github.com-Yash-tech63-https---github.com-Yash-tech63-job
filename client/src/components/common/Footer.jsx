import React from 'react';
import { Compass, ShieldCheck, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-[#343538] bg-[#202124] text-[#E9E6DF]/80 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#343538] border border-[#C6A15B]/40 flex items-center justify-center">
                <Compass className="w-4 h-4 text-[#C6A15B]" />
              </div>
              <span className="font-bold text-base text-[#FAF9F6] tracking-tight">
                TRUEHIRE
              </span>
            </div>
            <p className="text-[#FAF9F6] text-xs font-semibold">
              Verified recruitment marketplace for candidates and employers.
            </p>
            <p className="text-[#E9E6DF]/70 text-xs max-w-sm leading-relaxed">
              TrueHire connects candidates with vetted employers. Zero ghosting, direct application tracking, and strict organizational verification.
            </p>
            <div className="flex items-center gap-4 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-[#FAF9F6] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C6A15B]" />
                100% Verified Employers
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#FAF9F6] font-medium">
                <Lock className="w-3.5 h-3.5 text-[#C6A15B]" />
                Free for Candidates
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-[11px] uppercase font-bold text-[#C6A15B] tracking-wider mb-3.5">
              Platform
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/jobs" className="text-[#FAF9F6] hover:text-[#C6A15B] transition-colors">
                  Job Catalog
                </Link>
              </li>
              <li>
                <Link to="/register/candidate" className="text-[#FAF9F6] hover:text-[#C6A15B] transition-colors">
                  Candidate Registration
                </Link>
              </li>
              <li>
                <Link to="/register/recruiter" className="text-[#FAF9F6] hover:text-[#C6A15B] transition-colors">
                  Recruiter Registration
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-[#FAF9F6] hover:text-[#C6A15B] transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Operations */}
          <div>
            <h4 className="text-[11px] uppercase font-bold text-[#C6A15B] tracking-wider mb-3.5">
              Trust &amp; Governance
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-[#FAF9F6]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B]"></span>
                Employer Verification Audit
              </li>
              <li className="flex items-center gap-2 text-[#FAF9F6]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B]"></span>
                Encrypted Authentication
              </li>
              <li className="flex items-center gap-2 text-[#FAF9F6]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B]"></span>
                Privacy-Preserving Resumes
              </li>
              <li className="flex items-center gap-2 text-[#FAF9F6]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B]"></span>
                Anti-Ghosting Policy
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#343538] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#E9E6DF]/60 gap-3">
          <p>© {new Date().getFullYear()} TrueHire Technologies. All rights reserved.</p>
          <p className="text-[#C6A15B]">Premium Charcoal, Warm White &amp; Gold Edition</p>
        </div>
      </div>
    </footer>
  );
};

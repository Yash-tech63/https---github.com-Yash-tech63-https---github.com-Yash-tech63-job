import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const RecruiterCTA = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#202124] text-[#FAF9F6] relative overflow-hidden">
      {/* Subtle geometric background line */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(to right, #343538 1px, transparent 1px), linear-gradient(to bottom, #343538 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#343538] border border-[#C6A15B]/30 text-xs font-semibold uppercase tracking-wider text-[#C6A15B]">
            <Building2 className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>FOR EMPLOYERS &amp; HIRING MANAGERS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#FAF9F6] tracking-tight leading-tight">
            Great Talent Changes Everything.
          </h2>

          <p className="text-base sm:text-lg text-[#E9E6DF]/80 max-w-2xl mx-auto leading-relaxed">
            Eliminate agency overhead and unverified resumes. Post open roles, screen authenticated candidates, and hire top talent through a streamlined modern portal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/register/recruiter" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#C6A15B] hover:bg-[#A98443] text-[#202124] font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-gold"
              >
                <span>Start Hiring Now</span>
                <ArrowRight className="w-4 h-4 text-[#202124]" />
              </motion.button>
            </Link>

            <Link to="/recruiter/pricing" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#343538] hover:bg-[#202124] text-[#FAF9F6] font-semibold text-sm border border-[#C6A15B]/40 hover:border-[#C6A15B] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-subtle"
              >
                <span>Explore Plans &amp; Pricing</span>
              </motion.button>
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-[#E9E6DF]/80">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C6A15B]" />
              <span>Verified Employer Badge</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C6A15B]" />
              <span>Integrated Razorpay Subscriptions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C6A15B]" />
              <span>Full Pipeline Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

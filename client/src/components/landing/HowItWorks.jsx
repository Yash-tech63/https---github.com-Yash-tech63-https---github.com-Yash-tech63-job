import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  GraduationCap,
  Building2,
  FileText,
  Search,
  CheckCircle,
  ShieldCheck,
  Briefcase,
  Users,
  ArrowRight,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const HowItWorks = () => {
  const sectionRef = useRef(null);
  const candidateCardRef = useRef(null);
  const recruiterCardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [candidateCardRef.current, recruiterCardRef.current],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const candidateSteps = [
    {
      step: '01',
      title: 'Build Profile & Upload Resume',
      desc: 'Create an authenticated profile, upload your resume, and tag your core technical competencies.',
      icon: FileText,
    },
    {
      step: '02',
      title: 'Discover Verified Opportunities',
      desc: 'Browse transparent listings with verified employer credentials, verified salaries, and work arrangements.',
      icon: Search,
    },
    {
      step: '03',
      title: 'Direct Application & Real-Time Tracking',
      desc: 'Submit applications directly without intermediaries and receive prompt, transparent review notifications.',
      icon: CheckCircle,
    },
  ];

  const recruiterSteps = [
    {
      step: '01',
      title: 'Register & Verify Organization',
      desc: 'Submit your company credentials for verification to establish immediate credibility with top talent.',
      icon: ShieldCheck,
    },
    {
      step: '02',
      title: 'Publish Targeted Openings',
      desc: 'Post job and internship listings with comprehensive skill filters, compensation ranges, and requirements.',
      icon: Briefcase,
    },
    {
      step: '03',
      title: 'Screen Applicants & Hire Directly',
      desc: 'Manage your candidate pipeline with structured status transitions, candidate resumes, and direct hiring.',
      icon: Users,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-28 bg-[#FAF9F6] border-b border-[#E9E6DF]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFFFF] border border-[#E9E6DF] text-xs font-semibold uppercase tracking-wider text-[#202124] shadow-subtle">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B]" />
            <span>SYSTEM ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202124] tracking-tight">
            How TrueHire Works
          </h2>
          <p className="text-sm sm:text-base text-[#666666]">
            A transparent, double-sided hiring platform built to eliminate spam, delays, and ghosting.
          </p>
        </div>

        {/* Dual Track Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Candidate Track */}
          <div
            ref={candidateCardRef}
            className="p-8 sm:p-10 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card flex flex-col justify-between space-y-8"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-[#E9E6DF]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#202124] text-[#C6A15B] flex items-center justify-center border border-[#C6A15B]/30">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#202124]">For Job Seekers</h3>
                    <p className="text-xs text-[#666666]">Free lifelong access for candidates</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#FAF9F6] text-xs font-bold text-[#A98443] border border-[#C6A15B]">
                  ₹0 Cost
                </span>
              </div>

              {/* Steps with connecting visual line */}
              <div className="space-y-6 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-[1px] before:bg-[#E9E6DF]">
                {candidateSteps.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <div key={idx} className="relative flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#C6A15B] text-[#202124] text-xs font-extrabold flex items-center justify-center shrink-0 z-10 shadow-sm">
                        {s.step}
                      </div>
                      <div className="pt-0.5 space-y-1">
                        <h4 className="text-sm font-bold text-[#202124] flex items-center gap-2">
                          <Icon className="w-4 h-4 text-[#C6A15B]" />
                          {s.title}
                        </h4>
                        <p className="text-xs text-[#666666] leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Link to="/register/candidate" className="block pt-2">
              <motion.button
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl bg-[#C6A15B] hover:bg-[#A98443] text-[#202124] font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-gold"
              >
                <span>Create Free Candidate Profile</span>
                <ArrowRight className="w-4 h-4 text-[#202124]" />
              </motion.button>
            </Link>
          </div>

          {/* Recruiter Track */}
          <div
            ref={recruiterCardRef}
            className="p-8 sm:p-10 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card flex flex-col justify-between space-y-8"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-[#E9E6DF]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#202124] text-[#C6A15B] flex items-center justify-center border border-[#C6A15B]/30">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#202124]">For Employers &amp; Teams</h3>
                    <p className="text-xs text-[#666666]">Authenticated hiring infrastructure</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#FAF9F6] text-xs font-bold text-[#A98443] border border-[#C6A15B]">
                  Verified Organization
                </span>
              </div>

              {/* Steps with connecting visual line */}
              <div className="space-y-6 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-[1px] before:bg-[#E9E6DF]">
                {recruiterSteps.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <div key={idx} className="relative flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#202124] text-[#FAF9F6] text-xs font-extrabold flex items-center justify-center shrink-0 z-10 border border-[#C6A15B]/50">
                        {s.step}
                      </div>
                      <div className="pt-0.5 space-y-1">
                        <h4 className="text-sm font-bold text-[#202124] flex items-center gap-2">
                          <Icon className="w-4 h-4 text-[#C6A15B]" />
                          {s.title}
                        </h4>
                        <p className="text-xs text-[#666666] leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Link to="/register/recruiter" className="block pt-2">
              <motion.button
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl bg-[#202124] hover:bg-[#343538] text-[#FAF9F6] font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-subtle"
              >
                <span>Register as Verified Recruiter</span>
                <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

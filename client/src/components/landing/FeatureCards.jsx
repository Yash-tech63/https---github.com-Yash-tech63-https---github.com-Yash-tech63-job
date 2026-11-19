import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Compass,
  GraduationCap,
  FileText,
  Clock,
  LayoutDashboard,
  Users,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FeatureCards = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
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

  const features = [
    {
      title: 'Smart Job Discovery',
      description:
        'Discover relevant positions through precision filters for technical skills, compensation thresholds, and flexible work modes.',
      icon: Compass,
    },
    {
      title: 'Internship Opportunities',
      description:
        'Dedicated tracks for students and early-career talent to discover verified stipends and real mentoring experiences.',
      icon: GraduationCap,
    },
    {
      title: 'Resume Management',
      description:
        'Upload PDF resumes seamlessly with structured profile parsing and one-click viewing for employers.',
      icon: FileText,
    },
    {
      title: 'Application Tracking',
      description:
        'Transparent status monitoring from initial submission through review, interview stages, and final outcomes.',
      icon: Clock,
    },
    {
      title: 'Recruiter Dashboard',
      description:
        'A comprehensive management portal to create openings, inspect applicants, update stages, and export data.',
      icon: LayoutDashboard,
    },
    {
      title: 'Candidate Management',
      description:
        'Deep profile evaluation with verified skill tags, direct resume downloads, and timeline progression.',
      icon: Users,
    },
    {
      title: 'Secure Payments',
      description:
        'Frictionless Razorpay payment processing for job posting packages, recurring subscriptions, and tier upgrades.',
      icon: CreditCard,
    },
    {
      title: 'Verified Employers',
      description:
        'Every recruiting entity undergoes administrative validation to eliminate predatory job postings and fake recruiters.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-28 bg-[#FFFFFF] border-b border-[#E9E6DF]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF9F6] border border-[#E9E6DF] text-xs font-semibold uppercase tracking-wider text-[#202124] shadow-subtle">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B]" />
            <span>ENGINEERED FOR TRUST</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202124] tracking-tight">
            Comprehensive Platform Capabilities
          </h2>
          <p className="text-sm sm:text-base text-[#666666]">
            Built from first principles to provide candidates and employers with an uncompromising hiring experience.
          </p>
        </div>

        {/* 8 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                ref={(el) => (cardsRef.current[index] = el)}
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  className="h-full p-6 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] hover:border-[#C6A15B] transition-all duration-200 shadow-card flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] group-hover:bg-[#202124] transition-colors flex items-center justify-center text-[#C6A15B]">
                      <Icon className="w-5 h-5 transition-colors" />
                    </div>
                    <h3 className="text-base font-bold text-[#202124] group-hover:text-[#C6A15B] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#666666] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#E9E6DF] flex items-center gap-1.5 text-[11px] font-semibold text-[#666666] group-hover:text-[#202124]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B]" />
                    <span>Included in TrueHire</span>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

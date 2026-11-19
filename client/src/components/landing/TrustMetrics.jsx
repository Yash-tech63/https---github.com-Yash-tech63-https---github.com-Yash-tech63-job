import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Lock, CheckCircle2, Zap } from 'lucide-react';
import { jobService } from '../../services/jobService';

gsap.registerPlugin(ScrollTrigger);

export const TrustMetrics = () => {
  const sectionRef = useRef(null);
  const [totalJobs, setTotalJobs] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await jobService.getPublicJobs({ limit: 1 });
        const total = res?.data?.total || res?.data?.jobs?.length || 0;
        setTotalJobs(total > 0 ? `${total}+` : 'Active');
      } catch {
        setTotalJobs('Active');
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.metric-box',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [totalJobs]);

  const metrics = [
    {
      value: '100%',
      label: 'Verified Employers',
      detail: 'Every hiring company is manually authenticated by TrueHire administrators.',
      icon: ShieldCheck,
    },
    {
      value: '₹0',
      label: 'Candidate Fee',
      detail: 'No paywalls, application charges, or hidden fees for job seekers. Ever.',
      icon: Lock,
    },
    {
      value: totalJobs || 'Live',
      label: 'Active Opportunities',
      detail: 'Live positions currently accepting applications across tech & business.',
      icon: Zap,
    },
    {
      value: 'Real-Time',
      label: 'Pipeline Tracking',
      detail: 'Immediate notification on profile review, shortlist, and interview scheduling.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-24 bg-[#202124] border-b border-[#343538] text-[#FAF9F6]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#343538] border border-[#C6A15B]/30 text-xs font-semibold uppercase tracking-wider text-[#C6A15B]">
            <span>PLATFORM INTEGRITY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FAF9F6] tracking-tight">
            Built on Verifiable Accountability
          </h2>
          <p className="text-xs sm:text-sm text-[#E9E6DF]/70">
            TrueHire enforces strict trust standards to protect candidates and empower genuine recruiters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="metric-box p-6 rounded-2xl bg-[#343538] border border-[#343538] hover:border-[#C6A15B] transition-colors space-y-3 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#C6A15B] tracking-tight">
                    {m.value}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#202124] border border-[#C6A15B]/30 flex items-center justify-center text-[#C6A15B]">
                    <Icon className="w-5 h-5 text-[#C6A15B]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#FAF9F6]">{m.label}</h3>
                  <p className="text-xs text-[#E9E6DF]/70 leading-relaxed">{m.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

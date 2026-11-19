import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Briefcase,
  MapPin,
  ArrowRight,
  Sparkles,
  Building2,
  ChevronRight,
} from 'lucide-react';
import { VerificationBadge, WorkModeBadge, JobTypeBadge } from '../common/Badge';
import { jobService } from '../../services/jobService';

gsap.registerPlugin(ScrollTrigger);

export const FeaturedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('featured');
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await jobService.getPublicJobs({ limit: 12 });
        const list = res?.data?.jobs;
        if (Array.isArray(list)) {
          setJobs(list);
        }
      } catch (err) {
        console.error('Failed to load opportunities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const tabs = [
    { id: 'featured', label: 'Featured' },
    { id: 'latest', label: 'Latest' },
    { id: 'internships', label: 'Internships' },
    { id: 'remote', label: 'Remote Only' },
    { id: 'full-time', label: 'Full-Time' },
  ];

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === 'internships') {
      return job.type === 'internship';
    }
    if (activeTab === 'remote') {
      return job.workMode === 'remote';
    }
    if (activeTab === 'full-time') {
      return job.type === 'full-time';
    }
    if (activeTab === 'latest') {
      return true;
    }
    return job.featured || job.salaryMin > 40000 || job.type === 'full-time';
  });

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-28 bg-[#FFFFFF] border-b border-[#E9E6DF]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#E9E6DF] text-xs font-semibold text-[#202124]">
              <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>AUTHENTIC OPPORTUNITIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202124] tracking-tight">
              Opportunities Worth Exploring
            </h2>
            <p className="text-sm text-[#666666] max-w-xl">
              Verified openings from vetted organizations. Filter by track, work mode, and schedule.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#202124] text-[#FAF9F6] shadow-subtle'
                    : 'text-[#666666] hover:text-[#202124] hover:bg-[#FFFFFF]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#C6A15B] border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-[#666666]">Fetching authentic opportunities...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-16 px-6 text-center bg-[#FAF9F6] border border-[#E9E6DF] rounded-2xl max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFFFFF] border border-[#E9E6DF] flex items-center justify-center text-[#202124] mx-auto">
              <Briefcase className="w-6 h-6 text-[#666666]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#202124]">
                No live roles found in this filter
              </h3>
              <p className="text-xs text-[#666666]">
                Try selecting a different filter tab or explore all positions in the catalog.
              </p>
            </div>
            <Link to="/jobs">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2.5 rounded-xl bg-[#C6A15B] hover:bg-[#A98443] text-[#202124] text-xs font-bold transition-colors shadow-gold"
              >
                View Full Catalog
              </motion.button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredJobs.slice(0, 6).map((job, index) => (
                <motion.div
                  key={job._id || index}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <Link
                    to={`/jobs/${job._id}`}
                    className="block h-full p-6 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] group-hover:border-[#C6A15B] transition-all duration-200 shadow-card flex flex-col justify-between"
                  >
                    <div>
                      {/* Company Header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] flex items-center justify-center font-bold text-sm text-[#202124] shrink-0">
                            {job.companyId?.name?.charAt(0) || 'T'}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#202124] line-clamp-1">
                              {job.companyId?.name || 'Verified Organization'}
                            </h4>
                            <div className="flex items-center gap-1 text-[11px] text-[#666666] mt-0.5">
                              <MapPin className="w-3 h-3 text-[#666666]" />
                              <span>{job.location || 'Remote'}</span>
                            </div>
                          </div>
                        </div>

                        <VerificationBadge
                          status={job.companyId?.verificationStatus || 'valid'}
                        />
                      </div>

                      {/* Job Title */}
                      <h3 className="text-base font-bold text-[#202124] group-hover:text-[#C6A15B] transition-colors line-clamp-1 mb-3">
                        {job.title}
                      </h3>

                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <JobTypeBadge type={job.type} />
                        <WorkModeBadge mode={job.workMode} />
                      </div>

                      {/* Skills */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {job.skills.slice(0, 3).map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#FAF9F6] text-[#343538] border border-[#E9E6DF]"
                            >
                              {s}
                            </span>
                          ))}
                          {job.skills.length > 3 && (
                            <span className="px-2 py-1 rounded-md text-[11px] text-[#666666] bg-[#FFFFFF] border border-[#E9E6DF]">
                              +{job.skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Metadata & Link */}
                    <div className="pt-4 border-t border-[#E9E6DF] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#666666] tracking-wider block">
                          Compensation
                        </span>
                        <span className="font-extrabold text-[#202124]">
                          {job.salary || 'Competitive'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 font-semibold text-[#202124] group-hover:text-[#C6A15B] group-hover:translate-x-1 transition-all">
                        <span>View Role</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Section Footer Link */}
        <div className="mt-12 text-center">
          <Link to="/jobs">
            <motion.button
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3.5 rounded-xl bg-[#202124] hover:bg-[#343538] text-[#FAF9F6] font-semibold text-xs sm:text-sm transition-colors inline-flex items-center gap-2 cursor-pointer shadow-subtle"
            >
              <span>Explore All Opportunities</span>
              <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
};

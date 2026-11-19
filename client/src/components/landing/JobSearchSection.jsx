import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, ArrowRight, Sparkles } from 'lucide-react';

export const JobSearchSection = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('search', keyword.trim());
    if (location.trim()) params.append('location', location.trim());
    if (jobType) params.append('type', jobType);
    navigate(`/jobs?${params.toString()}`);
  };

  const trendingSearches = [
    'Frontend Developer',
    'Full Stack Engineer',
    'AI Engineer',
    'React',
    'Python',
    'Product Designer',
    'Data Scientist',
    'Remote',
  ];

  return (
    <section className="py-14 bg-[#FAF9F6] border-b border-[#E9E6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-[#202124] tracking-tight">
              Explore Live Roles Across Verified Teams
            </h2>
            <p className="text-xs sm:text-sm text-[#666666]">
              Real opportunities, direct recruiter tracking, no recruiter ghosting.
            </p>
          </div>

          {/* Interactive Search Bar */}
          <form
            onSubmit={handleSearch}
            className={`p-2.5 rounded-2xl bg-[#FFFFFF] border transition-all duration-300 shadow-card flex flex-col md:flex-row items-stretch gap-2.5 ${
              isFocused ? 'border-[#C6A15B] ring-2 ring-[#C6A15B]/30' : 'border-[#E9E6DF]'
            }`}
          >
            {/* Keyword Field */}
            <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] focus-within:border-[#C6A15B] transition-colors">
              <Search className="w-4 h-4 text-[#666666] shrink-0" />
              <input
                type="text"
                placeholder="Job title, technical skill, or keyword..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full bg-transparent text-xs sm:text-sm text-[#202124] placeholder-[#666666] focus:outline-none"
              />
            </div>

            {/* Location Field */}
            <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] focus-within:border-[#C6A15B] transition-colors">
              <MapPin className="w-4 h-4 text-[#666666] shrink-0" />
              <input
                type="text"
                placeholder="Location (e.g., Bengaluru, Remote)..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full bg-transparent text-xs sm:text-sm text-[#202124] placeholder-[#666666] focus:outline-none"
              />
            </div>

            {/* Job Type Dropdown */}
            <div className="md:w-44 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF]">
              <Briefcase className="w-4 h-4 text-[#666666] shrink-0" />
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-[#202124] focus:outline-none cursor-pointer"
              >
                <option value="">All Types</option>
                <option value="full-time">Full-Time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
                <option value="part-time">Part-Time</option>
              </select>
            </div>

            {/* Search Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#C6A15B] hover:bg-[#A98443] text-[#202124] font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-gold"
            >
              <span>Search Roles</span>
              <ArrowRight className="w-4 h-4 text-[#202124]" />
            </motion.button>
          </form>

          {/* Trending Searches Tags */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            <span className="text-xs text-[#666666] mr-1 flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3 text-[#C6A15B]" />
              Popular:
            </span>
            {trendingSearches.map((term) => (
              <motion.button
                key={term}
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(`/jobs?search=${encodeURIComponent(term)}`)}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FFFFFF] hover:bg-[#C6A15B] text-[#202124] hover:text-[#202124] border border-[#E9E6DF] hover:border-[#C6A15B] transition-colors cursor-pointer shadow-subtle"
              >
                {term}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

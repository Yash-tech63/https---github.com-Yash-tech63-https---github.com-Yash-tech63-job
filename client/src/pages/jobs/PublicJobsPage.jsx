import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { candidateService } from '../../services/candidateService';
import { useAuth } from '../../context/AuthContext';
import { JobCard } from '../../components/jobs/JobCard';
import { JobDetailModal } from '../../components/jobs/JobDetailModal';
import { Toast } from '../../components/common/Toast';
import { Button } from '../../components/common/Button';
import {
  Search,
  MapPin,
  ShieldCheck,
  Briefcase,
  X
} from 'lucide-react';

export const PublicJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [isApplying, setIsApplying] = useState(false);

  // Filter States
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('all');
  const [workMode, setWorkMode] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('');

  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobService.getPublicJobs({
        search,
        location,
        type,
        workMode,
        skills: selectedSkill
      });
      if (res && res.data) {
        setJobs(res.data.jobs || []);
        setTotal(res.data.total || 0);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setToast({ message: 'Failed to load verified jobs', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && role === 'candidate') {
      candidateService
        .getApplications()
        .then((res) => {
          if (res?.data) {
            const ids = res.data.map((app) => app.jobId?._id || app.jobId);
            setAppliedJobIds(ids);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, role]);

  useEffect(() => {
    fetchJobs();
  }, [type, workMode, selectedSkill]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleApplyClick = async (job, note = '') => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (role !== 'candidate') {
      setToast({
        message: 'Only candidates can apply to positions. Please log in as a candidate.',
        type: 'warning'
      });
      return;
    }

    setIsApplying(true);
    try {
      await candidateService.applyJob(job._id, note);
      setAppliedJobIds((prev) => [...prev, job._id]);
      setToast({ message: 'Application submitted successfully!', type: 'success' });
      setIsModalOpen(false);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || err.message || 'Application failed',
        type: 'error'
      });
    } finally {
      setIsApplying(false);
    }
  };

  const clearAllFilters = () => {
    setSearch('');
    setLocation('');
    setType('all');
    setWorkMode('all');
    setSelectedSkill('');
    setTimeout(fetchJobs, 50);
  };

  const POPULAR_SKILLS = ['React', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS', 'Figma', 'Next.js'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-[#FAF9F6] text-[#202124]">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Page Header */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFFFFF] text-[#202124] border border-[#E9E6DF] flex items-center gap-1.5 shadow-subtle">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C6A15B]" />
            100% Verified Employers
          </span>
          <span className="text-xs text-[#666666]">
            Only approved companies and listings are shown.
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202124]">
          Job &amp; Internship Openings
        </h1>
        <p className="text-xs text-[#666666]">
          Showing <span className="font-bold text-[#202124]">{total}</span> authenticated listings.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#FFFFFF] rounded-2xl p-4 sm:p-5 mb-8 border border-[#E9E6DF] shadow-card space-y-3.5">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by role, keyword, or company..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder-[#666666] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#C6A15B] transition-colors"
            />
          </div>

          <div className="relative sm:w-60">
            <MapPin className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-3" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location or Remote..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder-[#666666] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#C6A15B] transition-colors"
            />
          </div>

          <Button type="submit" variant="primary" size="sm">
            Search
          </Button>

          {(search || location || type !== 'all' || workMode !== 'all' || selectedSkill) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              icon={X}
            >
              Reset
            </Button>
          )}
        </form>

        {/* Filter Pills row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E9E6DF] text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[#666666] mr-1">Role:</span>
            {['all', 'internship', 'job'].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  type === t
                    ? 'bg-[#C6A15B] text-[#202124] shadow-sm'
                    : 'bg-[#FAF9F6] text-[#343538] border border-[#E9E6DF] hover:bg-[#FFFFFF]'
                }`}
              >
                {t === 'all' ? 'All Roles' : t === 'internship' ? 'Internships' : 'Full Time'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[#666666] mr-1">Mode:</span>
            {['all', 'remote', 'hybrid', 'onsite'].map((m) => (
              <button
                key={m}
                onClick={() => setWorkMode(m)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  workMode === m
                    ? 'bg-[#C6A15B] text-[#202124] shadow-sm'
                    : 'bg-[#FAF9F6] text-[#343538] border border-[#E9E6DF] hover:bg-[#FFFFFF]'
                }`}
              >
                {m === 'all' ? 'Any Mode' : m === 'remote' ? 'Remote' : m === 'hybrid' ? 'Hybrid' : 'Onsite'}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Skills row */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px]">
          <span className="text-[#666666]">Popular:</span>
          {POPULAR_SKILLS.map((skill) => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(selectedSkill === skill ? '' : skill)}
              className={`px-2.5 py-0.5 rounded-full border transition-colors cursor-pointer ${
                selectedSkill === skill
                  ? 'bg-[#202124] text-[#FAF9F6] border-[#202124]'
                  : 'bg-[#FAF9F6] text-[#666666] border-[#E9E6DF] hover:border-[#C6A15B] hover:text-[#202124]'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Job Grid or Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-56 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] p-5 space-y-3"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF]" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 bg-[#FAF9F6] rounded w-1/2" />
                  <div className="h-3 bg-[#FAF9F6] rounded w-1/3" />
                </div>
              </div>
              <div className="h-4 bg-[#FAF9F6] rounded w-3/4" />
              <div className="h-8 bg-[#FAF9F6] rounded w-full" />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-[#FFFFFF] rounded-2xl border border-[#E9E6DF] p-6 space-y-3 shadow-card">
          <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] flex items-center justify-center mx-auto text-[#666666]">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#202124]">No positions match criteria</h3>
          <p className="text-xs text-[#666666] max-w-sm mx-auto">
            Try adjusting your search keywords, location or role filters.
          </p>
          <Button variant="secondary" size="sm" onClick={clearAllFilters}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              hasApplied={appliedJobIds.includes(job._id)}
              onSelect={(selected) => {
                setSelectedJob(selected);
                setIsModalOpen(true);
              }}
              onApply={(selected) => {
                setSelectedJob(selected);
                handleApplyClick(selected);
              }}
            />
          ))}
        </div>
      )}

      {/* Modal Detail View */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedJob(null);
          }}
          hasApplied={appliedJobIds.includes(selectedJob._id)}
          isApplying={isApplying}
          onApply={handleApplyClick}
        />
      )}
    </div>
  );
};

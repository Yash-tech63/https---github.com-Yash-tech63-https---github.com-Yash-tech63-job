import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { candidateService } from '../../services/candidateService';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { ProfileCompletionRing } from '../../components/candidate/ProfileCompletionRing';
import { VerificationBadge, WorkModeBadge, JobTypeBadge } from '../../components/common/Badge';
import { JobDetailModal } from '../../components/jobs/JobDetailModal';
import { Toast } from '../../components/common/Toast';
import {
  FileText,
  Clock,
  CheckCircle2,
  Briefcase,
  Compass,
  ArrowRight,
  ExternalLink,
  Calendar,
  Bookmark,
  BookmarkCheck,
  Check,
  ShieldCheck
} from 'lucide-react';

export const CandidateDashboard = () => {
  const { user, refreshUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applications');
  const [selectedJob, setSelectedJob] = useState(null);
  const [toast, setToast] = useState(null);
  const [savingJobId, setSavingJobId] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await candidateService.getDashboard();
      if (res && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load candidate dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSaveJob = async (jobId, isCurrentlySaved) => {
    setSavingJobId(jobId);
    try {
      if (isCurrentlySaved) {
        await candidateService.unsaveJob(jobId);
        setToast({ message: 'Opportunity removed from saved list.', type: 'success' });
      } else {
        await candidateService.saveJob(jobId);
        setToast({ message: 'Opportunity saved to your profile!', type: 'success' });
      }
      fetchDashboard();
    } catch (err) {
      setToast({ message: err.response?.data?.message || err.message || 'Action failed', type: 'error' });
    } finally {
      setSavingJobId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
      case 'hired':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#C6A15B] text-[#202124] shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#202124]" />
            <span>Offer / Hired</span>
          </span>
        );
      case 'shortlisted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#202124] text-[#FAF9F6] border border-[#343538]">
            <Check className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>Shortlisted</span>
          </span>
        );
      case 'interview':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FAF9F6] text-[#A98443] border border-[#C6A15B]">
            <Calendar className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>Interview Scheduled</span>
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FAF9F6] text-[#666666] border border-[#E9E6DF]">
            <Clock className="w-3.5 h-3.5 text-[#666666]" />
            <span>Under Review</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FAF9F6] text-[#666666] border border-[#E9E6DF]">
            <span>Archived</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FAF9F6] text-[#343538] border border-[#E9E6DF]">
            <Clock className="w-3.5 h-3.5 text-[#666666]" />
            <span>Submitted</span>
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 bg-[#FAF9F6]">
        <div className="w-8 h-8 rounded-full border-2 border-[#C6A15B] border-t-transparent animate-spin" />
        <p className="text-xs text-[#666666]">Loading candidate workspace...</p>
      </div>
    );
  }

  const profile = data?.profile || {};
  const completeness = data?.completeness || 0;
  const applications = data?.applications || [];
  const recommendedJobs = data?.recommendedJobs || [];
  const recommendedInternships = data?.recommendedInternships || [];
  const savedJobs = data?.savedJobs || [];

  const savedJobIds = savedJobs.map((j) => (j._id ? j._id.toString() : j.toString()));

  const checklistItems = [
    { label: 'Add full name and headline', done: !!profile.name && !!profile.headline },
    { label: 'Add education and degree', done: profile.education && profile.education.length > 0 && !!profile.education[0]?.college },
    { label: 'Add technical skills (at least 3)', done: profile.skills && profile.skills.length >= 3 },
    { label: 'Add project or internship experience', done: profile.experience && profile.experience.length > 0 },
    { label: 'Attach verified resume (PDF/DOCX)', done: !!profile.resumeUrl },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#FAF9F6] text-[#202124]">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-[#202124] tracking-tight">
              Welcome back, {profile.name || user?.email?.split('@')[0]}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#202124] text-[#C6A15B] border border-[#C6A15B]/30">
              Candidate
            </span>
          </div>
          <p className="text-xs text-[#666666] mt-1">
            {profile.headline || 'Complete your verified profile to stand out to recruiters with zero ghosting.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/candidate/profile">
            <Button variant="secondary" size="sm">
              Edit Profile
            </Button>
          </Link>
          <Link to="/jobs">
            <Button variant="primary" size="sm" icon={Compass}>
              Browse Verified Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* Candidate 100% Free Guarantee Banner */}
      <div className="rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] p-5 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#202124] text-[#C6A15B] flex items-center justify-center shrink-0 border border-[#C6A15B]/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#202124]">TrueHire Candidate Guarantee</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF9F6] text-[#A98443] border border-[#C6A15B] uppercase tracking-wider">
                100% Free Forever
              </span>
            </div>
            <p className="text-xs text-[#666666] mt-0.5">
              Registration, job search, and applications are always completely free. We never charge candidates.
            </p>
          </div>
        </div>
        <Link to="/jobs">
          <Button variant="outline" size="sm" className="shrink-0">
            Search Opportunities →
          </Button>
        </Link>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Completion Card */}
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs text-[#666666] font-semibold uppercase tracking-wider">Profile Score</p>
            <p className="text-3xl font-black text-[#202124] mt-1">{completeness}%</p>
            <Link
              to="/candidate/profile"
              className="text-xs text-[#C6A15B] hover:text-[#A98443] font-bold mt-2 inline-flex items-center gap-1 hover:underline"
            >
              Update Details <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <ProfileCompletionRing score={completeness} size={84} strokeWidth={8} />
        </div>

        {/* Resume Status Card */}
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-[#666666] font-semibold uppercase tracking-wider">Resume Status</p>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-[#202124]">
                {profile.resumeUrl ? 'Verified & Stored' : 'Resume Missing'}
              </span>
            </div>
            {profile.resumeUrl ? (
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#C6A15B] hover:text-[#A98443] hover:underline inline-flex items-center gap-1 font-bold"
                >
                  Inspect Resume <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ) : (
              <Link to="/candidate/profile" className="text-xs text-[#666666] hover:text-[#202124] hover:underline pt-1 block font-medium">
                Upload PDF / DOCX (5MB) →
              </Link>
            )}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FAF9F6] border border-[#E9E6DF] text-[#C6A15B] flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Active Applications Count */}
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-[#666666] font-semibold uppercase tracking-wider">Applications Submitted</p>
            <p className="text-3xl font-black text-[#202124] mt-1">{applications.length}</p>
            <p className="text-xs text-[#666666]">Directly tracked by employers</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FAF9F6] border border-[#E9E6DF] text-[#C6A15B] flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Profile Checklist Action Items if not 100% */}
      {completeness < 100 && (
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-bold text-[#202124] tracking-wider">
              Recommended Profile Steps ({completeness}%)
            </h3>
            <Link to="/candidate/profile" className="text-xs text-[#C6A15B] hover:text-[#A98443] font-bold hover:underline">
              Complete Profile →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {checklistItems.map((item, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-xs transition-colors ${
                  item.done
                    ? 'bg-[#FAF9F6] border-[#E9E6DF] text-[#666666]'
                    : 'bg-[#FFFFFF] border-[#E9E6DF] text-[#202124]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                    item.done ? 'bg-[#C6A15B] text-[#202124]' : 'border border-[#666666]'
                  }`}
                >
                  {item.done && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className={item.done ? 'line-through text-[#666666]' : 'text-[#202124] font-medium'}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Tabbed Candidate Hub */}
      <div className="space-y-4">
        {/* Hub Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E9E6DF] pb-1 overflow-x-auto scrollbar-none">
          {[
            { id: 'applications', label: 'Application Pipeline', count: applications.length },
            { id: 'saved', label: 'Saved Opportunities', count: savedJobs.length },
            { id: 'internships', label: 'Internships For You', count: recommendedInternships.length },
            { id: 'jobs', label: 'Recommended Jobs', count: recommendedJobs.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-colors flex items-center gap-2 border-b-2 cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#C6A15B] text-[#202124] bg-[#FFFFFF]'
                  : 'border-transparent text-[#666666] hover:text-[#202124] hover:bg-[#FFFFFF]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === tab.id ? 'bg-[#C6A15B] text-[#202124]' : 'bg-[#E9E6DF] text-[#343538]'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab 1: Application Pipeline */}
        {activeTab === 'applications' && (
          <div className="space-y-3">
            {applications.length === 0 ? (
              <div className="p-12 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card text-center space-y-3">
                <Briefcase className="w-10 h-10 text-[#666666] mx-auto" />
                <h3 className="text-sm font-bold text-[#202124]">No applications submitted yet</h3>
                <p className="text-xs text-[#666666] max-w-sm mx-auto">
                  Explore verified opportunities from approved companies and submit with 1-click.
                </p>
                <Link to="/jobs">
                  <Button variant="primary" size="sm">
                    Explore Opportunities
                  </Button>
                </Link>
              </div>
            ) : (
              applications.map((app) => {
                const job = app.jobId || {};
                const company = app.companyId || {};
                return (
                  <div
                    key={app._id}
                    className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#C6A15B] transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-[#202124]">{job.title || 'Opportunity'}</h4>
                        <VerificationBadge status="valid" />
                      </div>
                      <p className="text-xs text-[#666666] font-medium">
                        {company.name || 'Verified Company'} • {job.location || 'Remote'}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-[#666666] pt-1">
                        <span>Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="text-[#202124] font-semibold">{job.salary || 'Competitive'}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                      {getStatusBadge(app.status)}
                      <span className="text-[10px] text-[#666666] font-medium">Zero Ghosting Protocol</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Saved Opportunities */}
        {activeTab === 'saved' && (
          <div className="space-y-3">
            {savedJobs.length === 0 ? (
              <div className="p-12 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card text-center space-y-3">
                <Bookmark className="w-10 h-10 text-[#666666] mx-auto" />
                <h3 className="text-sm font-bold text-[#202124]">No saved positions yet</h3>
                <p className="text-xs text-[#666666] max-w-sm mx-auto">
                  Bookmark jobs and internships while exploring to review and apply to them later.
                </p>
                <Link to="/jobs">
                  <Button variant="primary" size="sm">
                    Discover Jobs
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedJobs.map((job) => (
                  <div
                    key={job._id}
                    className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card hover:border-[#C6A15B] space-y-3 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#202124] truncate">
                          {job.companyId?.name || 'Verified Partner'}
                        </span>
                        <button
                          onClick={() => handleToggleSaveJob(job._id, true)}
                          disabled={savingJobId === job._id}
                          className="p-1.5 rounded-lg hover:bg-[#FAF9F6] text-[#C6A15B] transition-colors cursor-pointer"
                          title="Remove bookmark"
                        >
                          <BookmarkCheck className="w-4 h-4 text-[#C6A15B]" />
                        </button>
                      </div>

                      <h4 className="text-sm font-extrabold text-[#202124] mt-1">{job.title}</h4>
                      <p className="text-xs text-[#666666]">{job.location || 'Remote'}</p>

                      <div className="flex items-center gap-2 mt-2">
                        <JobTypeBadge type={job.type} />
                        <WorkModeBadge mode={job.workMode} />
                        <span className="text-xs text-[#202124] font-bold">{job.salary || 'Competitive'}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E9E6DF] flex items-center justify-between gap-2">
                      <Link to={`/jobs/${job._id}`} className="text-xs text-[#666666] hover:text-[#C6A15B] font-medium">
                        View Details
                      </Link>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setSelectedJob(job)}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Recommended Internships */}
        {activeTab === 'internships' && (
          <div className="space-y-3">
            {recommendedInternships.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card text-center text-xs text-[#666666]">
                No active internships at this moment. Explore full-time roles or check back soon!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedInternships.map((job) => {
                  const isSaved = savedJobIds.includes(job._id.toString());
                  return (
                    <div
                      key={job._id}
                      className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card hover:border-[#C6A15B] space-y-3 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-[#202124]">
                            {job.companyId?.name}
                          </span>
                          <button
                            onClick={() => handleToggleSaveJob(job._id, isSaved)}
                            disabled={savingJobId === job._id}
                            className="p-1.5 rounded-lg hover:bg-[#FAF9F6] text-[#666666] hover:text-[#C6A15B] transition-colors cursor-pointer"
                            title={isSaved ? 'Remove bookmark' : 'Save opportunity'}
                          >
                            {isSaved ? (
                              <BookmarkCheck className="w-4 h-4 text-[#C6A15B]" />
                            ) : (
                              <Bookmark className="w-4 h-4 text-[#666666]" />
                            )}
                          </button>
                        </div>

                        <h4 className="text-sm font-bold text-[#202124] mt-1">{job.title}</h4>
                        <div className="flex items-center gap-1.5 mt-2">
                          <JobTypeBadge type={job.type} />
                          <WorkModeBadge mode={job.workMode} />
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#E9E6DF] flex items-center justify-between text-xs">
                        <span className="font-bold text-[#202124]">{job.salary || 'Stipend'}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedJob(job)}
                        >
                          Apply →
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Recommended Jobs */}
        {activeTab === 'jobs' && (
          <div className="space-y-3">
            {recommendedJobs.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card text-center text-xs text-[#666666]">
                No recommended positions found for your skill set yet. Add skills to your profile to get matches.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedJobs.map((job) => {
                  const isSaved = savedJobIds.includes(job._id.toString());
                  return (
                    <div
                      key={job._id}
                      className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card hover:border-[#C6A15B] space-y-3 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-[#202124]">
                            {job.companyId?.name}
                          </span>
                          <button
                            onClick={() => handleToggleSaveJob(job._id, isSaved)}
                            disabled={savingJobId === job._id}
                            className="p-1.5 rounded-lg hover:bg-[#FAF9F6] text-[#666666] hover:text-[#C6A15B] transition-colors cursor-pointer"
                            title={isSaved ? 'Remove bookmark' : 'Save opportunity'}
                          >
                            {isSaved ? (
                              <BookmarkCheck className="w-4 h-4 text-[#C6A15B]" />
                            ) : (
                              <Bookmark className="w-4 h-4 text-[#666666]" />
                            )}
                          </button>
                        </div>

                        <h4 className="text-sm font-bold text-[#202124] mt-1">{job.title}</h4>
                        <div className="flex items-center gap-1.5 mt-2">
                          <JobTypeBadge type={job.type} />
                          <WorkModeBadge mode={job.workMode} />
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#E9E6DF] flex items-center justify-between text-xs">
                        <span className="font-bold text-[#202124]">{job.salary || 'Competitive'}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedJob(job)}
                        >
                          Apply →
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Job Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={async (job) => {
            try {
              await candidateService.applyJob(job._id);
              setToast({ message: 'Application submitted successfully!', type: 'success' });
              setSelectedJob(null);
              fetchDashboard();
            } catch (err) {
              setToast({
                message: err.response?.data?.message || err.message || 'Application failed',
                type: 'error'
              });
            }
          }}
        />
      )}
    </div>
  );
};

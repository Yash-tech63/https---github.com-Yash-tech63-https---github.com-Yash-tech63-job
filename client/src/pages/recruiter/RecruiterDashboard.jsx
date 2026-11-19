import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recruiterService } from '../../services/recruiterService';
import { jobService } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { CompanyStatusBanner } from '../../components/recruiter/CompanyStatusBanner';
import { JobStatsCards } from '../../components/recruiter/JobStatsCards';
import { CreateJobModal } from '../../components/recruiter/CreateJobModal';
import { JobApplicantsModal } from '../../components/recruiter/JobApplicantsModal';
import { Toast } from '../../components/common/Toast';
import { VerificationBadge, WorkModeBadge, JobTypeBadge } from '../../components/common/Badge';
import {
  Building2,
  Plus,
  Briefcase,
  Users,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Zap,
  CreditCard,
  Search
} from 'lucide-react';

export const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingJobId, setDeletingJobId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await recruiterService.getDashboard();
      if (res && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load recruiter dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJobCreatedOrUpdated = async (jobData) => {
    try {
      if (editingJob) {
        await jobService.updateJob(editingJob._id, jobData);
        setToast({ message: 'Opportunity listing updated!', type: 'success' });
      } else {
        await jobService.createJob(jobData);
        setToast({ message: 'New opportunity created successfully!', type: 'success' });
      }
      setIsCreateModalOpen(false);
      setEditingJob(null);
      fetchDashboard();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this position? This will remove the listing and release an opening back to your active plan.')) {
      return;
    }
    setDeletingJobId(jobId);
    try {
      await jobService.deleteJob(jobId);
      setToast({ message: 'Position deleted and posting quota refreshed.', type: 'success' });
      fetchDashboard();
    } catch (err) {
      setToast({ message: err.response?.data?.message || err.message || 'Failed to delete position', type: 'error' });
    } finally {
      setDeletingJobId(null);
    }
  };

  const toggleJobStatus = async (job, newStatus) => {
    try {
      await jobService.updateJob(job._id, { status: newStatus });
      setToast({ message: `Job status changed to ${newStatus}`, type: 'success' });
      fetchDashboard();
    } catch (err) {
      setToast({ message: err.message || 'Failed to update status', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 bg-[#FAF9F6]">
        <div className="w-8 h-8 rounded-full border-2 border-[#C6A15B] border-t-transparent animate-spin" />
        <p className="text-xs text-[#666666]">Loading employer workspace...</p>
      </div>
    );
  }

  const company = data?.company || {};
  const stats = data?.stats || {};
  const jobs = data?.jobs || [];
  const recentApplications = data?.recentApplications || [];

  const tabCounts = {
    all: jobs.length,
    published: jobs.filter(j => j.status === 'published' && (!j.deadline || new Date(j.deadline) >= new Date()) && company.verificationStatus === 'valid').length,
    draft: jobs.filter(j => j.status === 'draft').length,
    pending: jobs.filter(j => company.verificationStatus !== 'valid' && j.status === 'published').length,
    expired: jobs.filter(j => j.status === 'closed' || (j.deadline && new Date(j.deadline) < new Date())).length,
  };

  const filteredJobs = jobs.filter((job) => {
    const isExpired = job.status === 'closed' || (job.deadline && new Date(job.deadline) < new Date());
    const isPending = company.verificationStatus !== 'valid' && job.status === 'published';

    if (activeTab === 'published' && (job.status !== 'published' || isExpired || isPending)) return false;
    if (activeTab === 'draft' && job.status !== 'draft') return false;
    if (activeTab === 'pending' && !isPending) return false;
    if (activeTab === 'expired' && !isExpired) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title?.toLowerCase().includes(q);
      const matchCategory = job.category?.toLowerCase().includes(q);
      const matchLoc = job.location?.toLowerCase().includes(q);
      if (!matchTitle && !matchCategory && !matchLoc) return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#FAF9F6] text-[#202124]">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Top Special Notice & Verification Banner */}
      <CompanyStatusBanner company={company} />

      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-[#202124] tracking-tight">
              {company.name || 'Recruiter Workspace'}
            </h1>
            <VerificationBadge status={company.verificationStatus} />
          </div>
          <p className="text-xs text-[#666666] mt-1">
            Manage your open roles, interview pipeline, and enterprise verification credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/recruiter/company">
            <Button variant="secondary" size="sm" icon={Building2}>
              Company Profile
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => {
              setEditingJob(null);
              setIsCreateModalOpen(true);
            }}
          >
            Post Job / Internship
          </Button>
        </div>
      </div>

      {/* Recruiter Subscription & Entitlement Status */}
      <div className="rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] p-5 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] flex items-center justify-center text-[#C6A15B]">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-[#666666] tracking-wider">Plan Status:</span>
              <span className="text-sm font-extrabold text-[#202124]">
                {data?.activeSubscription ? data.activeSubscription.planId?.name : 'No Active Plan'}
              </span>
              {data?.activeSubscription && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#202124] text-[#C6A15B] border border-[#C6A15B]/30">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-[#666666] mt-0.5">
              {data?.activeSubscription ? (
                <>
                  Posting Quota: <strong className="text-[#202124]">{data.activeSubscription.usedJobPostings} / {data.activeSubscription.jobPostingLimit}</strong> jobs used.
                  {' '}Valid until <strong className="text-[#202124]">{new Date(data.activeSubscription.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>.
                </>
              ) : (
                'You must subscribe to a recruiter plan to post job and internship listings to candidate talent.'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/recruiter/billing">
            <Button variant="outline" size="sm" icon={CreditCard}>
              Billing &amp; History
            </Button>
          </Link>
          <Link to="/recruiter/pricing">
            <Button variant={data?.activeSubscription ? 'secondary' : 'primary'} size="sm">
              {data?.activeSubscription ? 'Upgrade Plan' : 'Explore Recruiter Plans'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <JobStatsCards stats={stats} />

      {/* Main Section: Job Management with Status Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#202124] flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#C6A15B]" />
              Job &amp; Opportunity Management
            </h2>
            <p className="text-xs text-[#666666] mt-0.5">
              Track open listings, applications, view counts, and manage live status.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#E9E6DF] rounded-xl pl-9 pr-3 py-2 text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none transition-colors"
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#E9E6DF]">
          {[
            { id: 'all', label: 'All Jobs', count: tabCounts.all },
            { id: 'published', label: 'Published', count: tabCounts.published },
            { id: 'draft', label: 'Draft', count: tabCounts.draft },
            { id: 'pending', label: 'Pending Approval', count: tabCounts.pending },
            { id: 'expired', label: 'Expired', count: tabCounts.expired }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2.5 rounded-t-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 border-b-2 cursor-pointer ${
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

        <div className="rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card overflow-hidden">
          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Briefcase className="w-10 h-10 text-[#666666] mx-auto" />
              <h3 className="text-sm font-bold text-[#202124]">No positions match this filter</h3>
              <p className="text-xs text-[#666666]">
                {searchQuery ? 'Try clearing your search term.' : 'Create a new job opening to start receiving candidates.'}
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setEditingJob(null);
                  setIsCreateModalOpen(true);
                }}
              >
                Create Opportunity
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F6] border-b border-[#E9E6DF] text-[#202124] uppercase tracking-wider font-semibold text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Title &amp; Company</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date Posted</th>
                    <th className="py-3 px-4">Deadline</th>
                    <th className="py-3 px-4 text-center">Applications</th>
                    <th className="py-3 px-4 text-center">Views</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9E6DF] text-[#202124]">
                  {filteredJobs.map((job) => {
                    const isJobExpired = job.status === 'closed' || (job.deadline && new Date(job.deadline) < new Date());
                    const isPendingApproval = company.verificationStatus !== 'valid' && job.status === 'published';

                    return (
                      <tr key={job._id} className="hover:bg-[#FAF9F6] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#202124] text-sm">{job.title}</div>
                          <div className="text-[11px] text-[#666666] mt-0.5">{company.name || 'Your Company'} • {job.category || 'General'}</div>
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <JobTypeBadge type={job.type} />
                            <WorkModeBadge mode={job.workMode} />
                            <span className="text-[#666666]">•</span>
                            <span className="text-[11px] text-[#202124] font-semibold">{job.salary || 'Competitive'}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          {isPendingApproval ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#FAF9F6] text-[#343538] border border-[#E9E6DF] inline-flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#C6A15B]" /> Pending Org Approval
                            </span>
                          ) : isJobExpired ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#FAF9F6] text-[#666666] border border-[#E9E6DF] inline-flex items-center gap-1">
                              Expired
                            </span>
                          ) : job.status === 'published' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#C6A15B] text-[#202124] inline-flex items-center gap-1 shadow-sm">
                              <CheckCircle2 className="w-3 h-3 text-[#202124]" /> Published
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#FAF9F6] text-[#666666] border border-[#E9E6DF]">
                              Draft
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-[#666666]">
                          {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>

                        <td className="py-3.5 px-4">
                          {job.deadline ? (
                            <span className={`${isJobExpired ? 'text-[#666666] line-through' : 'text-[#202124]'}`}>
                              {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          ) : (
                            <span className="text-[#666666]">Rolling</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => setSelectedJobForApplicants(job)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF9F6] hover:bg-[#E9E6DF] text-[#202124] border border-[#E9E6DF] font-bold transition-colors cursor-pointer"
                            title="View applicants for this position"
                          >
                            <Users className="w-3.5 h-3.5 text-[#C6A15B]" />
                            <span>{job.applicationCount ?? 0}</span>
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 text-[#666666] font-medium">
                            <Eye className="w-3.5 h-3.5 text-[#666666]" />
                            {job.viewsCount ?? 0}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedJobForApplicants(job)}
                              className="p-1.5 rounded-lg bg-[#FAF9F6] hover:bg-[#E9E6DF] text-[#202124] border border-[#E9E6DF] transition-colors cursor-pointer"
                              title="View Applicants"
                            >
                              <Users className="w-3.5 h-3.5 text-[#C6A15B]" />
                            </button>

                            <button
                              onClick={() => {
                                setEditingJob(job);
                                setIsCreateModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-[#FAF9F6] hover:bg-[#E9E6DF] text-[#202124] border border-[#E9E6DF] transition-colors cursor-pointer"
                              title="Edit Position"
                            >
                              <Edit className="w-3.5 h-3.5 text-[#666666]" />
                            </button>

                            {job.status === 'published' ? (
                              <button
                                onClick={() => toggleJobStatus(job, 'draft')}
                                className="px-2 py-1 rounded-lg bg-[#FAF9F6] hover:bg-[#E9E6DF] text-[#202124] text-[10px] font-semibold border border-[#E9E6DF] cursor-pointer"
                                title="Unpublish to Draft"
                              >
                                Draft
                              </button>
                            ) : (
                              <button
                                onClick={() => toggleJobStatus(job, 'published')}
                                className="px-2 py-1 rounded-lg bg-[#C6A15B] text-[#202124] hover:bg-[#A98443] text-[10px] font-bold cursor-pointer"
                                title="Publish"
                              >
                                Publish
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteJob(job._id)}
                              disabled={deletingJobId === job._id}
                              className="p-1.5 rounded-lg bg-[#FAF9F6] hover:bg-[#202124] hover:text-[#FAF9F6] text-[#666666] border border-[#E9E6DF] transition-colors cursor-pointer"
                              title="Delete Position"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Candidate Pipeline Preview */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#202124] flex items-center gap-2">
          <Users className="w-5 h-5 text-[#C6A15B]" />
          Recent Candidate Submissions ({recentApplications.length})
        </h2>

        {recentApplications.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card text-center text-xs text-[#666666]">
            No candidate applications received yet. Once your jobs are verified and public, applications will flow directly into this inbox.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentApplications.map((app) => (
              <div key={app._id} className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#202124]">
                    {app.candidateId?.email}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF9F6] text-[#A98443] border border-[#C6A15B] font-bold">
                    {app.status}
                  </span>
                </div>
                <p className="text-xs text-[#666666] font-medium">
                  Applied for: <span className="text-[#202124] font-semibold">{app.jobId?.title}</span>
                </p>
                {app.notes && (
                  <p className="text-[11px] text-[#666666] italic bg-[#FAF9F6] p-2 rounded-lg border border-[#E9E6DF]">
                    "{app.notes}"
                  </p>
                )}
                <p className="text-[10px] text-[#666666]">
                  Submitted {new Date(app.appliedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isCreateModalOpen && (
        <CreateJobModal
          isOpen={isCreateModalOpen}
          initialData={editingJob}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingJob(null);
          }}
          onJobCreated={handleJobCreatedOrUpdated}
        />
      )}

      {/* View Applicants Modal */}
      {selectedJobForApplicants && (
        <JobApplicantsModal
          isOpen={!!selectedJobForApplicants}
          onClose={() => setSelectedJobForApplicants(null)}
          job={selectedJobForApplicants}
        />
      )}
    </div>
  );
};

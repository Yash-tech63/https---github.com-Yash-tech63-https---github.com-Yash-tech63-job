import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Button } from '../common/Button';
import { WorkModeBadge, VerificationBadge } from '../common/Badge';
import {
  Briefcase,
  Search
} from 'lucide-react';

export const AdminJobsTab = ({ onShowToast }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllJobs(statusFilter, search);
      if (res && res.data) {
        setJobs(res.data);
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleModerate = async (jobId, newStatus) => {
    setUpdatingId(jobId);
    try {
      await adminService.moderateJob(jobId, newStatus);
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, status: newStatus } : j))
      );
      if (onShowToast) {
        onShowToast(`Job opening marked as '${newStatus}'.`, 'success');
      }
    } catch (err) {
      if (onShowToast) {
        onShowToast(err.message || 'Moderation failed', 'error');
      }
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 text-[#202124]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#202124] flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#C6A15B]" />
            Job & Opportunity Moderation ({jobs.length})
          </h2>
          <p className="text-xs text-[#666666] mt-0.5">
            Audit public listings, quarantine fraudulent posts, and approve positions.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by job title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#E9E6DF] rounded-xl pl-9 pr-3 py-2 text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none transition-colors"
            />
          </div>
          <Button variant="secondary" size="sm" type="submit">
            Search
          </Button>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E9E6DF] pb-2">
        {[
          { id: '', label: 'All Jobs' },
          { id: 'published', label: 'Published / Live' },
          { id: 'draft', label: 'Drafts' },
          { id: 'closed', label: 'Closed / Expired' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              statusFilter === tab.id
                ? 'bg-[#202124] text-[#FAF9F6] border border-[#C6A15B]'
                : 'bg-[#FAF9F6] text-[#666666] hover:text-[#202124] border border-[#E9E6DF]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Jobs Table */}
      <div className="rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#666666]">Loading opportunity listings...</div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#666666]">No job openings found matching filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F6] border-b border-[#E9E6DF] text-[#202124] uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Title & Organization</th>
                  <th className="py-3 px-4">Org Verification</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Work Mode</th>
                  <th className="py-3 px-4">Date Created</th>
                  <th className="py-3 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E6DF] text-[#202124]">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#202124] text-sm">{job.title}</div>
                      <div className="text-[11px] text-[#666666] mt-0.5">
                        {job.companyId?.name || 'Unknown Company'} • {job.category || 'General'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <VerificationBadge status={job.companyId?.verificationStatus || 'unverified'} />
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        job.status === 'published'
                          ? 'bg-[#C6A15B]/15 text-[#A98443] border-[#C6A15B]/30'
                          : job.status === 'draft'
                          ? 'bg-[#FAF9F6] text-[#202124] border-[#E9E6DF]'
                          : 'bg-[#FAF9F6] text-[#666666] border-[#E9E6DF]'
                      }`}>
                        {job.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <WorkModeBadge mode={job.workMode} />
                    </td>

                    <td className="py-3.5 px-4 text-[#666666]">
                      {new Date(job.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {job.status !== 'published' && (
                          <button
                            onClick={() => handleModerate(job._id, 'published')}
                            disabled={updatingId === job._id}
                            className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#C6A15B] text-[#202124] hover:bg-[#A98443] transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                        )}

                        {job.status !== 'draft' && (
                          <button
                            onClick={() => handleModerate(job._id, 'draft')}
                            disabled={updatingId === job._id}
                            className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-[#FAF9F6] text-[#202124] border border-[#E9E6DF] hover:bg-[#E9E6DF] transition-colors cursor-pointer"
                          >
                            Quarantine to Draft
                          </button>
                        )}

                        {job.status !== 'closed' && (
                          <button
                            onClick={() => handleModerate(job._id, 'closed')}
                            disabled={updatingId === job._id}
                            className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-[#FAF9F6] hover:bg-[#E9E6DF] text-[#666666] hover:text-[#202124] border border-[#E9E6DF] transition-colors cursor-pointer"
                          >
                            Close
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminJobsTab;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { Button } from '../common/Button';

export const JobApplicantsModal = ({ isOpen, onClose, job }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    if (job && isOpen) {
      fetchApplicants();
    }
  }, [job, isOpen]);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/recruiter/dashboard`);
      const allApps = res.data?.data?.recentApplications || [];
      const jobApps = allApps.filter((a) => a.jobId?._id === job._id || a.jobId === job._id);
      setApplications(jobApps);
    } catch (err) {
      console.error('Failed to load applicants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    setActionLoadingId(appId);
    try {
      await api.patch(`/candidate/applications/${appId}/status`, { status: newStatus });
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  if (!isOpen || !job) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202124]/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E9E6DF] shadow-2xl flex flex-col max-h-[88vh] overflow-hidden text-[#202124]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E9E6DF]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] flex items-center justify-center text-[#C6A15B]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#202124]">
                  Applicants for: {job.title}
                </h3>
                <p className="text-xs text-[#666666]">
                  Review candidate credentials, resumes, and manage interview pipeline stages.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#666666] hover:text-[#202124] hover:bg-[#FAF9F6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto py-4">
            {loading ? (
              <div className="py-12 text-center text-xs text-[#666666] flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#C6A15B]" />
                <span>Loading applicant pool...</span>
              </div>
            ) : applications.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <Users className="w-8 h-8 mx-auto text-[#666666]" />
                <h4 className="text-sm font-semibold text-[#202124]">No applicants yet</h4>
                <p className="text-xs text-[#666666] max-w-sm mx-auto">
                  Applications will appear here as soon as candidates discover and apply to this opening.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app._id}
                    className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E9E6DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#202124] text-sm">
                          {app.candidateId?.email || 'Candidate'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#C6A15B]/15 text-[#A98443] border border-[#C6A15B]/30">
                          {app.status || 'Applied'}
                        </span>
                      </div>
                      <p className="text-xs text-[#666666] mt-1">
                        Applied on:{' '}
                        {new Date(app.appliedAt || app.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                      {app.notes && (
                        <p className="text-xs text-[#202124] mt-2 p-2 rounded-lg bg-[#FFFFFF] border border-[#E9E6DF] italic">
                          "{app.notes}"
                        </p>
                      )}
                    </div>

                    {/* Stage actions */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Button
                        variant={app.status === 'shortlisted' ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => handleUpdateStatus(app._id, 'shortlisted')}
                        disabled={actionLoadingId === app._id}
                        className="text-xs"
                      >
                        Shortlist
                      </Button>
                      <Button
                        variant={app.status === 'interview_scheduled' ? 'dark' : 'secondary'}
                        size="sm"
                        onClick={() => handleUpdateStatus(app._id, 'interview_scheduled')}
                        disabled={actionLoadingId === app._id}
                        className="text-xs"
                      >
                        Interview
                      </Button>
                      <Button
                        variant={app.status === 'rejected' ? 'outline' : 'ghost'}
                        size="sm"
                        onClick={() => handleUpdateStatus(app._id, 'rejected')}
                        disabled={actionLoadingId === app._id}
                        className="text-xs text-[#666666] hover:text-[#202124]"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-[#E9E6DF] flex justify-end">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default JobApplicantsModal;

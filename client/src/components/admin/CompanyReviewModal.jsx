import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShieldCheck,
  XCircle,
  AlertTriangle,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { VerificationBadge } from '../common/Badge';
import { Button } from '../common/Button';

export const CompanyReviewModal = ({ company, isOpen, onClose, onReviewComplete }) => {
  const [rejecting, setRejecting] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !company) return null;

  const handleApprove = async () => {
    setIsLoading(true);
    setError('');
    try {
      await onReviewComplete(company._id, {
        status: 'valid',
        adminNote: adminNote || 'Approved by Trust & Safety moderation team.'
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Action failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!adminNote.trim()) {
      setError('Admin note is mandatory when rejecting or marking a company invalid');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await onReviewComplete(company._id, {
        status: 'invalid',
        adminNote: adminNote.trim()
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Action failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-[#202124]/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-[#E9E6DF] shadow-2xl my-8 overflow-hidden bg-[#FFFFFF] text-[#202124]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E9E6DF]">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-[#C6A15B]" />
              <div>
                <h3 className="text-xl font-bold text-[#202124]">Company Trust Verification</h3>
                <p className="text-xs text-[#666666]">Enterprise Moderation & Background Audit</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#666666] hover:text-[#202124] hover:bg-[#FAF9F6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-[#FAF9F6] border border-[#202124] text-[#202124] text-xs flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0 text-[#C6A15B]" />
              <span>{error}</span>
            </div>
          )}

          {/* Company Details */}
          <div className="py-4 space-y-4 text-xs">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF9F6] border border-[#E9E6DF]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#FFFFFF] border border-[#E9E6DF] flex items-center justify-center font-bold text-lg text-[#202124]">
                  {company.name?.charAt(0) || 'C'}
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#202124]">{company.name}</h4>
                  <p className="text-[#666666]">Created by: {company.ownerUserId?.email || 'Recruiter'}</p>
                </div>
              </div>
              <VerificationBadge status={company.verificationStatus} />
            </div>

            {/* Metadata grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-[#202124]">
              <div>
                <span className="text-[#666666] block">Industry</span>
                <span className="font-semibold">{company.industry || 'Tech'}</span>
              </div>
              <div>
                <span className="text-[#666666] block">Company Size</span>
                <span className="font-semibold">{company.size || '1-10'}</span>
              </div>
              <div>
                <span className="text-[#666666] block">Headquarters</span>
                <span className="font-semibold">{company.location || 'Remote'}</span>
              </div>
              <div>
                <span className="text-[#666666] block">Website</span>
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#202124] font-semibold hover:text-[#C6A15B] hover:underline flex items-center gap-1"
                  >
                    Open Link <ExternalLink className="w-3 h-3 text-[#C6A15B]" />
                  </a>
                ) : (
                  <span className="text-[#666666]">Not provided</span>
                )}
              </div>
              <div>
                <span className="text-[#666666] block">Jobs Created</span>
                <span className="font-semibold text-[#202124]">{company.jobsCount || 0} Positions</span>
              </div>
              <div>
                <span className="text-[#666666] block">Registered On</span>
                <span className="text-[#202124]">
                  {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'Recent'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <span className="text-[#202124] font-semibold block mb-1">Company Overview</span>
              <p className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-[#202124] leading-relaxed">
                {company.description || 'No description provided.'}
              </p>
            </div>

            {/* Admin Note Input */}
            <div>
              <label className="block text-[#202124] font-semibold mb-1">
                Admin Audit Note {rejecting ? <span className="text-[#C6A15B] font-bold">* (Mandatory for rejection)</span> : '(Optional for approval)'}
              </label>
              <textarea
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder={
                  rejecting
                    ? 'State reasons for rejection (e.g., Domain unregistered, suspected scam, fake company entity)...'
                    : 'Notes on corporate check, filing, or verification source...'
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-[#202124] placeholder:text-[#666666] text-xs focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#E9E6DF] flex items-center justify-between flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>

            <div className="flex items-center gap-2">
              {!rejecting ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRejecting(true)}
                    icon={XCircle}
                    className="text-[#666666] hover:text-[#202124] border-[#E9E6DF]"
                  >
                    Reject Company
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    isLoading={isLoading}
                    onClick={handleApprove}
                    icon={CheckCircle2}
                  >
                    Verify Company (Make Public)
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setRejecting(false);
                      setError('');
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="dark"
                    size="sm"
                    isLoading={isLoading}
                    onClick={handleReject}
                    icon={XCircle}
                  >
                    Confirm Rejection
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CompanyReviewModal;

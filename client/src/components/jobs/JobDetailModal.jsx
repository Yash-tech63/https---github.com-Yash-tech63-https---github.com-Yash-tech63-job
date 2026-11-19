import React, { useState } from 'react';
import {
  X,
  Building2,
  MapPin,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Send
} from 'lucide-react';
import { VerificationBadge, WorkModeBadge, JobTypeBadge } from '../common/Badge';
import { Button } from '../common/Button';

export const JobDetailModal = ({ job, isOpen, onClose, onApply, hasApplied = false, isApplying = false }) => {
  const [note, setNote] = useState('');

  if (!isOpen || !job) return null;

  const company = job.companyId || {};

  const handleApply = () => {
    onApply(job, note);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-[#202124]/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-[#FFFFFF] rounded-2xl p-6 sm:p-7 border border-[#E9E6DF] shadow-2xl my-8 text-[#202124]">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-md text-[#666666] hover:text-[#202124] hover:bg-[#FAF9F6] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Company & Role Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 mb-5 pt-1">
          <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] overflow-hidden flex items-center justify-center shrink-0">
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-6 h-6 text-[#C6A15B]" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-lg sm:text-xl font-bold text-[#202124]">{job.title}</h2>
              <VerificationBadge status={company.verificationStatus} />
            </div>
            <div className="flex items-center gap-2 text-xs text-[#666666] flex-wrap">
              <span className="font-semibold text-[#202124]">{company.name}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#C6A15B]" />
                {job.location || 'Remote'}
              </span>
              {company.website && (
                <>
                  <span>•</span>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#666666] hover:text-[#202124] underline transition-colors"
                  >
                    Website <ExternalLink className="w-3 h-3 text-[#C6A15B]" />
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Highlights grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] mb-5 text-xs">
          <div>
            <p className="text-[#666666] mb-1">Role Type</p>
            <JobTypeBadge type={job.type} />
          </div>
          <div>
            <p className="text-[#666666] mb-1">Work Mode</p>
            <WorkModeBadge mode={job.workMode} />
          </div>
          <div>
            <p className="text-[#666666] mb-0.5">Compensation</p>
            <p className="font-semibold text-[#202124] text-xs">{job.salary || 'Competitive'}</p>
          </div>
          <div>
            <p className="text-[#666666] mb-0.5">Duration</p>
            <p className="font-semibold text-[#202124] text-xs">{job.duration || 'Flexible'}</p>
          </div>
        </div>

        {/* Verification Note */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] mb-5">
          <ShieldCheck className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-[#202124]">Verified Entity: </span>
            <span className="text-[#666666]">
              {company.adminNote || 'Company credentials and domain verified by TrueHire administration.'}
            </span>
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-2 mb-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#202124]">
            About the Role
          </h4>
          <div className="text-xs text-[#343538] whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto pr-2">
            {job.description}
          </div>
        </div>

        {/* Skills Required */}
        {job.skills && job.skills.length > 0 && (
          <div className="mb-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#202124] mb-2">
              Required Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#FAF9F6] text-[#202124] border border-[#E9E6DF]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Note Input */}
        {!hasApplied && (
          <div className="mb-5">
            <label className="block text-xs font-semibold text-[#202124] mb-1">
              Add a note to recruiter (optional)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Include links to portfolio, GitHub, or background summary..."
              className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder-[#666666] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#C6A15B]"
            />
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E9E6DF]">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant={hasApplied ? 'secondary' : 'primary'}
            size="sm"
            disabled={hasApplied}
            isLoading={isApplying}
            onClick={handleApply}
            icon={hasApplied ? CheckCircle : Send}
          >
            {hasApplied ? 'Application Submitted' : 'Submit Application'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;

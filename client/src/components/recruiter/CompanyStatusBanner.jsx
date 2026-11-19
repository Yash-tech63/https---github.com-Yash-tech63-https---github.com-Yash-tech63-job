import React from 'react';
import { ShieldCheck, Clock, XCircle } from 'lucide-react';
import { VerificationBadge } from '../common/Badge';

export const CompanyStatusBanner = ({ company }) => {
  if (!company) return null;

  const status = company.verificationStatus || 'pending';

  if (status === 'valid') {
    return (
      <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#202124] text-[#C6A15B] flex items-center justify-center shrink-0 border border-[#C6A15B]/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#202124] text-sm">{company.name}</span>
              <VerificationBadge status="valid" />
            </div>
            <p className="text-xs text-[#666666] mt-0.5">
              Your company is fully verified. All published job listings are live on the public job board.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#A98443] shadow-card flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#343538] text-[#C6A15B] flex items-center justify-center shrink-0 mt-0.5">
          <XCircle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#202124] text-sm">{company.name}</span>
            <VerificationBadge status="invalid" />
          </div>
          <p className="text-xs text-[#666666]">
            Company verification was not approved. All jobs from this company are currently hidden from public discovery.
          </p>
          {company.adminNote && (
            <div className="mt-2 p-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124]">
              <span className="font-bold text-[#202124]">Admin Feedback: </span>
              {company.adminNote}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Pending
  return (
    <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card flex items-start sm:items-center justify-between flex-wrap gap-3">
      <div className="flex items-start sm:items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-[#C6A15B] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[#202124] text-sm">{company.name}</span>
            <VerificationBadge status="pending" />
          </div>
          <p className="text-xs text-[#666666] mt-0.5">
            Your organization profile is under review by TrueHire administrators. Published jobs will remain pending until approved.
          </p>
        </div>
      </div>
    </div>
  );
};

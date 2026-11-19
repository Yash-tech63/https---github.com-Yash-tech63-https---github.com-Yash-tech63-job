import React from 'react';
import { CheckCircle2, Clock, XCircle, Globe, Briefcase, GraduationCap } from 'lucide-react';

export const VerificationBadge = ({ status, size = 'sm' }) => {
  const normalized = (status || 'pending').toLowerCase();

  if (normalized === 'valid' || normalized === 'verified') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FAF9F6] text-[#A98443] border border-[#C6A15B]">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#C6A15B]" />
        Verified
      </span>
    );
  }

  if (normalized === 'invalid' || normalized === 'rejected') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FAF9F6] text-[#666666] border border-[#E9E6DF]">
        <XCircle className="w-3.5 h-3.5 text-[#666666]" />
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FAF9F6] text-[#343538] border border-[#E9E6DF]">
      <Clock className="w-3.5 h-3.5 text-[#666666]" />
      Pending Review
    </span>
  );
};

export const WorkModeBadge = ({ mode }) => {
  const normalized = (mode || 'remote').toLowerCase();
  const label = normalized === 'remote' ? 'Remote' : normalized === 'hybrid' ? 'Hybrid' : 'Onsite';

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFFFFF] text-[#202124] border border-[#E9E6DF]">
      <Globe className="w-3 h-3 text-[#666666]" />
      {label}
    </span>
  );
};

export const JobTypeBadge = ({ type }) => {
  const isIntern = (type || '').toLowerCase() === 'internship';
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FAF9F6] text-[#343538] border border-[#E9E6DF]">
      {isIntern ? (
        <GraduationCap className="w-3 h-3 text-[#C6A15B]" />
      ) : (
        <Briefcase className="w-3 h-3 text-[#666666]" />
      )}
      {isIntern ? 'Internship' : 'Full Time'}
    </span>
  );
};

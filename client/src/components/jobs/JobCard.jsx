import React from 'react';
import { VerificationBadge, WorkModeBadge, JobTypeBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { Building2, MapPin, DollarSign, ArrowUpRight } from 'lucide-react';

export const JobCard = ({ job, onSelect, onApply, hasApplied = false }) => {
  const company = job.companyId || {};

  return (
    <div className="flex flex-col justify-between h-full bg-[#FFFFFF] rounded-2xl border border-[#E9E6DF] hover:border-[#C6A15B] p-5 shadow-card transition-all duration-200 group">
      <div>
        {/* Company Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] overflow-hidden flex items-center justify-center shrink-0">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-5 h-5 text-[#C6A15B]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-[#202124] text-xs">
                  {company.name || 'Verified Partner'}
                </span>
                <VerificationBadge status={company.verificationStatus || 'valid'} />
              </div>
              <p className="text-[11px] text-[#666666] truncate max-w-[180px]">
                {company.location || 'Remote'}
              </p>
            </div>
          </div>

          <JobTypeBadge type={job.type} />
        </div>

        {/* Job Title */}
        <h3
          onClick={() => onSelect(job)}
          className="text-sm font-bold text-[#202124] group-hover:text-[#C6A15B] transition-colors cursor-pointer mb-1.5 line-clamp-1"
        >
          {job.title}
        </h3>

        {/* Snippet / Description */}
        <p className="text-xs text-[#666666] line-clamp-2 mb-3 leading-relaxed">
          {job.description}
        </p>

        {/* Metadata info */}
        <div className="grid grid-cols-2 gap-2 text-xs text-[#343538] mb-3 bg-[#FAF9F6] p-2.5 rounded-xl border border-[#E9E6DF]">
          <div className="flex items-center gap-1.5 truncate">
            <DollarSign className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
            <span className="font-bold text-[#202124] truncate">{job.salary || 'Competitive'}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#666666] shrink-0" />
            <span className="truncate text-[#666666]">{job.location || 'Remote'}</span>
          </div>
        </div>

        {/* Skills Tag Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <WorkModeBadge mode={job.workMode} />
          {job.skills?.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2.5 py-0.5 rounded text-[10px] font-medium bg-[#FAF9F6] text-[#343538] border border-[#E9E6DF]"
            >
              {skill}
            </span>
          ))}
          {job.skills?.length > 3 && (
            <span className="px-1.5 py-0.5 rounded text-[10px] text-[#666666] bg-[#FAF9F6] border border-[#E9E6DF]">
              +{job.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-[#E9E6DF] flex items-center justify-between gap-3">
        <button
          onClick={() => onSelect(job)}
          className="text-xs text-[#666666] hover:text-[#C6A15B] flex items-center gap-1 font-semibold transition-colors cursor-pointer"
        >
          <span>Details</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

        <Button
          variant={hasApplied ? 'secondary' : 'primary'}
          size="sm"
          disabled={hasApplied}
          onClick={() => onApply(job)}
        >
          {hasApplied ? 'Applied' : 'Apply Now'}
        </Button>
      </div>
    </div>
  );
};

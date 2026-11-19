import React from 'react';
import {
  Briefcase,
  CheckCircle2,
  FileEdit,
  Clock,
  Users,
  UserCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const JobStatsCards = ({ stats = {} }) => {
  const cards = [
    {
      title: 'Total Jobs Posted',
      value: stats.totalJobs ?? 0,
      icon: Briefcase
    },
    {
      title: 'Active / Published',
      value: stats.activeJobs ?? 0,
      icon: CheckCircle2
    },
    {
      title: 'Draft Positions',
      value: stats.draftJobs ?? 0,
      icon: FileEdit
    },
    {
      title: 'Expired / Closed',
      value: stats.expiredJobs ?? stats.closedJobs ?? 0,
      icon: Clock
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications ?? 0,
      icon: Users
    },
    {
      title: 'Pending Review',
      value: stats.pendingApplications ?? 0,
      icon: AlertCircle
    },
    {
      title: 'Shortlisted Candidates',
      value: stats.shortlistedCount ?? 0,
      icon: UserCheck
    },
    {
      title: 'Scheduled Interviews',
      value: stats.scheduledInterviews ?? 0,
      icon: Calendar
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card flex items-center justify-between hover:border-[#C6A15B] transition-colors"
          >
            <div>
              <p className="text-[11px] text-[#666666] font-semibold uppercase tracking-wider mb-1 truncate">{card.title}</p>
              <p className="text-2xl font-black text-[#202124]">{card.value}</p>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#E9E6DF] bg-[#FAF9F6] text-[#C6A15B] shrink-0">
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JobStatsCards;

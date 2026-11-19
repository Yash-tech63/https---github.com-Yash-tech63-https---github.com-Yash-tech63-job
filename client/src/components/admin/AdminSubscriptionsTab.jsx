import React, { useState, useEffect } from 'react';
import { planService } from '../../services/planService';
import { CheckCircle2, XCircle, Clock, Search, Briefcase } from 'lucide-react';

export const AdminSubscriptionsTab = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSubscriptions();
  }, [filterStatus]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await planService.getAllSubscriptions({
        status: filterStatus === 'all' ? undefined : filterStatus
      });
      if (res && res.data) {
        setSubscriptions(res.data);
      }
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#C6A15B]/15 text-[#A98443] border border-[#C6A15B]/30">
            <CheckCircle2 className="w-3 h-3 text-[#C6A15B]" />
            <span>Active</span>
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FAF9F6] text-[#666666] border border-[#E9E6DF]">
            <Clock className="w-3 h-3" />
            <span>Expired</span>
          </span>
        );
      case 'cancelled':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FAF9F6] text-[#666666] border border-[#E9E6DF]">
            <XCircle className="w-3 h-3" />
            <span className="capitalize">{status}</span>
          </span>
        );
    }
  };

  const filtered = subscriptions.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.companyId?.name?.toLowerCase().includes(q) ||
      s.recruiterId?.email?.toLowerCase().includes(q) ||
      s.planId?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 text-[#202124]">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 border-b border-[#E9E6DF] pb-2 w-full sm:w-auto">
          {['all', 'active', 'expired', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer capitalize ${
                filterStatus === st
                  ? 'bg-[#202124] text-[#FAF9F6] border border-[#C6A15B]'
                  : 'bg-[#FAF9F6] text-[#666666] hover:text-[#202124] border border-[#E9E6DF]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#666666] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search company or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#666666]">Loading subscriptions...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#666666] space-y-2">
            <Briefcase className="w-8 h-8 mx-auto text-[#666666]" />
            <p>No subscriptions found matching criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#202124]">
              <thead>
                <tr className="border-b border-[#E9E6DF] text-[#666666] uppercase text-[10px] tracking-wider bg-[#FAF9F6] font-semibold">
                  <th className="py-3.5 px-4">Company / Recruiter</th>
                  <th className="py-3.5 px-4">Company Status</th>
                  <th className="py-3.5 px-4">Plan</th>
                  <th className="py-3.5 px-4">Quota Used</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Start Date</th>
                  <th className="py-3.5 px-4">End Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E6DF]">
                {filtered.map((s) => (
                  <tr key={s._id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#202124]">{s.companyId?.name || 'Recruiter'}</div>
                      <div className="text-[11px] text-[#666666] font-mono">{s.recruiterId?.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold border ${
                        s.companyId?.verificationStatus === 'valid'
                          ? 'bg-[#C6A15B]/15 text-[#A98443] border-[#C6A15B]/30'
                          : 'bg-[#FAF9F6] text-[#666666] border-[#E9E6DF]'
                      }`}>
                        {s.companyId?.verificationStatus || 'unknown'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#202124]">
                      {s.planId?.name || 'Custom Plan'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#202124]">{s.usedJobPostings}</span> / {s.jobPostingLimit} jobs
                      <span className="text-[10px] text-[#666666] block">({s.activeJobCount} currently active)</span>
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(s.status)}</td>
                    <td className="py-3.5 px-4 text-[#666666]">
                      {new Date(s.startDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-[#666666]">
                      {new Date(s.endDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
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

export default AdminSubscriptionsTab;

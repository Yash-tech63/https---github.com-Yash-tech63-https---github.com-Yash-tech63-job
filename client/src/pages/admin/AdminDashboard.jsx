import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Button } from '../../components/common/Button';
import { VerificationBadge } from '../../components/common/Badge';
import { CompanyReviewModal } from '../../components/admin/CompanyReviewModal';
import { AdminPaymentsTab } from '../../components/admin/AdminPaymentsTab';
import { AdminSubscriptionsTab } from '../../components/admin/AdminSubscriptionsTab';
import { AdminPlansTab } from '../../components/admin/AdminPlansTab';
import { AdminUsersTab } from '../../components/admin/AdminUsersTab';
import { AdminJobsTab } from '../../components/admin/AdminJobsTab';
import { Toast } from '../../components/common/Toast';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  ExternalLink,
  Search,
  Eye,
  Briefcase,
  CreditCard,
  Layers,
  Sliders,
  Users
} from 'lucide-react';

export const AdminDashboard = () => {
  const [mainSection, setMainSection] = useState('verification');
  const [activeTab, setActiveTab] = useState('pending');
  const [companies, setCompanies] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [companiesRes, metricsRes] = await Promise.all([
        adminService.getCompanies(activeTab),
        adminService.getDashboard()
      ]);

      if (companiesRes && companiesRes.data) {
        setCompanies(companiesRes.data);
      }
      if (metricsRes && metricsRes.data) {
        setDashboardMetrics(metricsRes.data);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setToast({ message: 'Error loading admin data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleReviewComplete = async (companyId, payload) => {
    try {
      await adminService.verifyCompany(companyId, payload);
      setToast({
        message: `Company successfully marked as '${payload.status}'!`,
        type: 'success'
      });
      setSelectedCompany(null);
      fetchData();
    } catch (err) {
      throw err;
    }
  };

  const stats = dashboardMetrics?.stats || {};
  const auditLogs = dashboardMetrics?.auditLogs || [];

  const filteredCompanies = companies.filter((c) =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.ownerUserId?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#FAF9F6] text-[#202124]">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-[#202124] tracking-tight">
              Trust &amp; Operations Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#202124] text-[#C6A15B] border border-[#C6A15B]/30">
              Admin Portal
            </span>
          </div>
          <p className="text-xs text-[#666666] mt-1">
            Review company registrations, audit payments and refunds, manage recruiter subscriptions, and configure pricing.
          </p>
        </div>
      </div>

      {/* Main Section Navigation Bar */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card overflow-x-auto scrollbar-none">
        <button
          onClick={() => setMainSection('verification')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            mainSection === 'verification'
              ? 'bg-[#C6A15B] text-[#202124] shadow-sm'
              : 'text-[#666666] hover:text-[#202124] hover:bg-[#FAF9F6]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Company Verification</span>
          {stats.pendingCount > 0 && (
            <span className={`ml-1 px-1.5 py-0.2 rounded-full font-bold text-[10px] ${
              mainSection === 'verification' ? 'bg-[#202124] text-[#FAF9F6]' : 'bg-[#C6A15B] text-[#202124]'
            }`}>
              {stats.pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setMainSection('users')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            mainSection === 'users'
              ? 'bg-[#C6A15B] text-[#202124] shadow-sm'
              : 'text-[#666666] hover:text-[#202124] hover:bg-[#FAF9F6]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Accounts</span>
        </button>

        <button
          onClick={() => setMainSection('jobs')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            mainSection === 'jobs'
              ? 'bg-[#C6A15B] text-[#202124] shadow-sm'
              : 'text-[#666666] hover:text-[#202124] hover:bg-[#FAF9F6]'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Job Moderation</span>
        </button>

        <button
          onClick={() => setMainSection('payments')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            mainSection === 'payments'
              ? 'bg-[#C6A15B] text-[#202124] shadow-sm'
              : 'text-[#666666] hover:text-[#202124] hover:bg-[#FAF9F6]'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payments &amp; Refunds</span>
        </button>

        <button
          onClick={() => setMainSection('subscriptions')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            mainSection === 'subscriptions'
              ? 'bg-[#C6A15B] text-[#202124] shadow-sm'
              : 'text-[#666666] hover:text-[#202124] hover:bg-[#FAF9F6]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Recruiter Subscriptions</span>
        </button>

        <button
          onClick={() => setMainSection('plans')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            mainSection === 'plans'
              ? 'bg-[#C6A15B] text-[#202124] shadow-sm'
              : 'text-[#666666] hover:text-[#202124] hover:bg-[#FAF9F6]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Pricing Plans</span>
        </button>
      </div>

      {/* Conditionally Render Sections */}
      {mainSection === 'users' && (
        <AdminUsersTab onShowToast={(message, type) => setToast({ message, type })} />
      )}

      {mainSection === 'jobs' && (
        <AdminJobsTab onShowToast={(message, type) => setToast({ message, type })} />
      )}

      {mainSection === 'payments' && (
        <AdminPaymentsTab onShowToast={(message, type) => setToast({ message, type })} />
      )}

      {mainSection === 'subscriptions' && (
        <AdminSubscriptionsTab />
      )}

      {mainSection === 'plans' && (
        <AdminPlansTab onShowToast={(message, type) => setToast({ message, type })} />
      )}

      {mainSection === 'verification' && (
        <>
          {/* Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Pending Queue */}
            <div
              onClick={() => setActiveTab('pending')}
              className={`p-5 rounded-2xl bg-[#FFFFFF] border shadow-card cursor-pointer transition-all ${
                activeTab === 'pending'
                  ? 'border-[#C6A15B] ring-2 ring-[#C6A15B]/30'
                  : 'border-[#E9E6DF] hover:border-[#C6A15B]'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                  Pending Queue
                </p>
                <Clock className="w-4 h-4 text-[#C6A15B]" />
              </div>
              <p className="text-3xl font-black text-[#202124] mt-2">
                {stats.pendingCount ?? 0}
              </p>
              <p className="text-[11px] text-[#666666] mt-1">Awaiting verification</p>
            </div>

            {/* Valid / Verified */}
            <div
              onClick={() => setActiveTab('valid')}
              className={`p-5 rounded-2xl bg-[#FFFFFF] border shadow-card cursor-pointer transition-all ${
                activeTab === 'valid'
                  ? 'border-[#C6A15B] ring-2 ring-[#C6A15B]/30'
                  : 'border-[#E9E6DF] hover:border-[#C6A15B]'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                  Valid Companies
                </p>
                <CheckCircle2 className="w-4 h-4 text-[#C6A15B]" />
              </div>
              <p className="text-3xl font-black text-[#202124] mt-2">
                {stats.validCount ?? 0}
              </p>
              <p className="text-[11px] text-[#666666] mt-1">Live on public job board</p>
            </div>

            {/* Invalid / Rejected */}
            <div
              onClick={() => setActiveTab('invalid')}
              className={`p-5 rounded-2xl bg-[#FFFFFF] border shadow-card cursor-pointer transition-all ${
                activeTab === 'invalid'
                  ? 'border-[#C6A15B] ring-2 ring-[#C6A15B]/30'
                  : 'border-[#E9E6DF] hover:border-[#C6A15B]'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                  Invalid / Blocked
                </p>
                <XCircle className="w-4 h-4 text-[#666666]" />
              </div>
              <p className="text-3xl font-black text-[#202124] mt-2">
                {stats.invalidCount ?? 0}
              </p>
              <p className="text-[11px] text-[#666666] mt-1">Quarantined from public</p>
            </div>

            {/* Total Jobs Moderated */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                  Total Openings
                </p>
                <Briefcase className="w-4 h-4 text-[#C6A15B]" />
              </div>
              <p className="text-3xl font-black text-[#202124] mt-2">{stats.totalJobs ?? 0}</p>
              <p className="text-[11px] text-[#666666] mt-1">Platform listings</p>
            </div>
          </div>

          {/* Tabs and Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 border-b border-[#E9E6DF] pb-2 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'pending'
                    ? 'bg-[#C6A15B] text-[#202124]'
                    : 'bg-[#FAF9F6] text-[#666666] hover:text-[#202124] border border-[#E9E6DF]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Pending Review ({stats.pendingCount ?? 0})
              </button>

              <button
                onClick={() => setActiveTab('valid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'valid'
                    ? 'bg-[#C6A15B] text-[#202124]'
                    : 'bg-[#FAF9F6] text-[#666666] hover:text-[#202124] border border-[#E9E6DF]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Valid ({stats.validCount ?? 0})
              </button>

              <button
                onClick={() => setActiveTab('invalid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'invalid'
                    ? 'bg-[#C6A15B] text-[#202124]'
                    : 'bg-[#FAF9F6] text-[#666666] hover:text-[#202124] border border-[#E9E6DF]'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                Invalid ({stats.invalidCount ?? 0})
              </button>
            </div>

            {/* Filter Search */}
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

          {/* Companies Moderation Table */}
          <div className="rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs text-[#666666]">Loading moderation queue...</div>
            ) : filteredCompanies.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <Building2 className="w-10 h-10 text-[#666666] mx-auto" />
                <p className="text-sm font-bold text-[#202124]">No companies found in this section</p>
                <p className="text-xs text-[#666666]">All caught up with queue reviews!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#202124]">
                  <thead className="bg-[#FAF9F6] border-b border-[#E9E6DF] text-[#202124] uppercase tracking-wider font-semibold text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Company Entity</th>
                      <th className="py-3 px-4">Recruiter Email</th>
                      <th className="py-3 px-4">Industry / HQ</th>
                      <th className="py-3 px-4">Jobs Waiting</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Moderation Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9E6DF]">
                    {filteredCompanies.map((c) => (
                      <tr key={c._id} className="hover:bg-[#FAF9F6] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#202124] text-sm">{c.name}</div>
                          {c.website ? (
                            <a
                              href={c.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-[#C6A15B] hover:text-[#A98443] font-bold hover:underline flex items-center gap-1 mt-0.5"
                            >
                              {c.website} <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-[11px] text-[#666666]">No website provided</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[11px] text-[#666666]">
                          {c.ownerUserId?.email || 'N/A'}
                        </td>

                        <td className="py-3.5 px-4">
                          <div>{c.industry || 'Tech'}</div>
                          <div className="text-[11px] text-[#666666]">{c.location || 'Remote'}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-[#202124]">{c.jobsCount || 0}</span> positions
                          {c.verificationStatus !== 'valid' && (
                            <span className="block text-[10px] text-[#666666] font-medium">
                              (Hidden from public)
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <VerificationBadge status={c.verificationStatus} />
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSelectedCompany(c)}
                            icon={Eye}
                          >
                            Audit &amp; Decide
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Audit Timeline Section */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#202124] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C6A15B]" />
              Recent Trust Verification Audit Logs
            </h3>

            <div className="space-y-2">
              {auditLogs.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E9E6DF] text-xs text-[#666666] text-center">
                  No review decisions recorded yet.
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log._id}
                    className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card flex items-center justify-between text-xs flex-wrap gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#C6A15B]" />
                      <div>
                        <span className="font-bold text-[#202124] mr-2">{log.name}</span>
                        <span className="text-[#666666]">
                          audited by <span className="text-[#202124] font-semibold">{log.reviewedBy?.email || 'Admin'}</span>
                        </span>
                        {log.adminNote && (
                          <span className="block text-[11px] text-[#666666] italic mt-0.5">
                            Note: "{log.adminNote}"
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <VerificationBadge status={log.verificationStatus} />
                      <span className="text-[10px] text-[#666666]">
                        {new Date(log.reviewedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Company Review Modal */}
      {selectedCompany && (
        <CompanyReviewModal
          company={selectedCompany}
          isOpen={!!selectedCompany}
          onClose={() => setSelectedCompany(null)}
          onReviewComplete={handleReviewComplete}
        />
      )}
    </div>
  );
};

export default AdminDashboard;

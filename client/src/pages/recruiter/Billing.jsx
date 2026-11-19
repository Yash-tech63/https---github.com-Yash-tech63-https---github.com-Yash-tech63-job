import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { planService } from '../../services/planService';
import { paymentService } from '../../services/paymentService';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Zap,
  Building2
} from 'lucide-react';

export const Billing = () => {
  const [subscription, setSubscription] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [company, setCompany] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    setLoading(true);
    try {
      const [subRes, paymentsRes] = await Promise.all([
        planService.getCurrentSubscription(),
        paymentService.getPaymentHistory()
      ]);

      if (subRes && subRes.data) {
        setSubscription(subRes.data.subscription);
        setEligibility(subRes.data.eligibility);
        setCompany(subRes.data.company);
      }

      if (paymentsRes && paymentsRes.data) {
        setPayments(paymentsRes.data);
      }
    } catch (err) {
      console.error('Failed to load billing details:', err);
      setToast({ message: 'Error loading billing data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;
    if (!window.confirm('Are you sure you want to cancel your active subscription? Active jobs will remain published until expiry, but remaining unused entitlements will be halted.')) {
      return;
    }

    setActionLoading(true);
    try {
      await planService.cancelSubscription(subscription._id);
      setToast({ message: 'Subscription successfully cancelled', type: 'success' });
      fetchBillingData();
    } catch (err) {
      setToast({
        message: err.response?.data?.message || err.message || 'Failed to cancel subscription',
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'captured':
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C6A15B]/15 text-[#A98443] border border-[#C6A15B]/30">
            <CheckCircle2 className="w-3 h-3 text-[#C6A15B]" />
            <span className="capitalize">{status}</span>
          </span>
        );
      case 'pending':
      case 'created':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF9F6] text-[#202124] border border-[#E9E6DF]">
            <Clock className="w-3 h-3 text-[#666666]" />
            <span className="capitalize">{status}</span>
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF9F6] text-[#666666] border border-[#E9E6DF]">
            <span className="capitalize">Refunded</span>
          </span>
        );
      case 'failed':
      case 'expired':
      case 'cancelled':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF9F6] text-[#666666] border border-[#E9E6DF]">
            <XCircle className="w-3 h-3 text-[#666666]" />
            <span className="capitalize">{status}</span>
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#666666]">
        Loading billing & subscription workspace...
      </div>
    );
  }

  const remainingPostings = subscription
    ? Math.max(0, subscription.jobPostingLimit - subscription.usedJobPostings)
    : 0;

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#202124] tracking-tight">Billing & Subscriptions</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF9F6] text-[#202124] border border-[#E9E6DF]">
                Razorpay Secured
              </span>
            </div>
            <p className="text-xs text-[#666666] mt-1">
              Manage your recruiter plan entitlements, posting limits, invoices, and payment history.
            </p>
          </div>

          <Link to="/recruiter/pricing">
            <Button variant="primary" size="sm" icon={Zap}>
              Upgrade / Renew Plan
            </Button>
          </Link>
        </div>

        {/* Company Verification Banner */}
        {company && (
          <div className="p-4 rounded-2xl border border-[#E9E6DF] bg-[#FFFFFF] shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#FAF9F6] border border-[#E9E6DF] text-[#C6A15B]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#202124]">{company.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold border ${
                    company.verificationStatus === 'valid'
                      ? 'bg-[#C6A15B]/15 text-[#A98443] border-[#C6A15B]/30'
                      : 'bg-[#FAF9F6] text-[#666666] border-[#E9E6DF]'
                  }`}>
                    {company.verificationStatus}
                  </span>
                </div>
                <p className="text-xs text-[#666666] mt-0.5">
                  {company.verificationStatus === 'valid'
                    ? 'Your organization is officially verified. Your job listings are visible to all candidates.'
                    : 'Company verification pending. Jobs created under your plan will go live once admin confirms your business details.'}
                </p>
              </div>
            </div>

            <Link to="/recruiter/company">
              <Button variant="secondary" size="sm">
                Review Verification
              </Button>
            </Link>
          </div>
        )}

        {/* Active Subscription Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-3xl bg-[#FFFFFF] border border-[#E9E6DF] p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E9E6DF]">
              <div>
                <span className="text-xs uppercase font-bold text-[#C6A15B] tracking-wider">Active Plan</span>
                <h2 className="text-2xl font-black text-[#202124] mt-1">
                  {subscription ? subscription.planId?.name : 'No Active Subscription'}
                </h2>
              </div>
              <div>{subscription && getStatusBadge(subscription.status)}</div>
            </div>

            {subscription ? (
              <div className="space-y-6">
                {/* Progress Bar for Job Postings */}
                <div>
                  <div className="flex justify-between text-xs text-[#202124] mb-2">
                    <span>Job Postings Usage</span>
                    <span className="font-bold text-[#202124]">
                      {subscription.usedJobPostings} of {subscription.jobPostingLimit} used ({remainingPostings} remaining)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#E9E6DF] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#C6A15B] transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (subscription.usedJobPostings / subscription.jobPostingLimit) * 100)}%`
                      }}
                    />
                  </div>
                </div>

                {/* Validity and Plan Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E9E6DF]">
                    <span className="text-xs text-[#666666] block font-medium">Active Jobs</span>
                    <span className="text-xl font-black text-[#202124] mt-1 block">
                      {subscription.activeJobCount || 0}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E9E6DF]">
                    <span className="text-xs text-[#666666] block font-medium">Valid From</span>
                    <span className="text-sm font-bold text-[#202124] mt-1 block">
                      {new Date(subscription.startDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E9E6DF]">
                    <span className="text-xs text-[#666666] block font-medium">Expires On</span>
                    <span className="text-sm font-bold text-[#202124] mt-1 block">
                      {new Date(subscription.endDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <Link to="/recruiter/pricing">
                    <Button variant="primary" size="sm">
                      Upgrade / Renew Plan
                    </Button>
                  </Link>
                  {subscription.status === 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={actionLoading}
                      onClick={handleCancelSubscription}
                      className="text-[#666666] hover:text-[#202124] border-[#E9E6DF]"
                    >
                      Cancel Plan
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <p className="text-sm text-[#666666]">
                  You currently do not have an active job posting plan. Choose a plan to unlock postings.
                </p>
                <Link to="/recruiter/pricing">
                  <Button variant="primary" size="md" icon={Zap}>
                    View Recruiter Plans
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Facts Card */}
          <div className="rounded-3xl bg-[#FFFFFF] border border-[#E9E6DF] p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#202124] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C6A15B]" />
                Recruiter Guarantees
              </h3>
              <ul className="mt-4 space-y-3 text-xs text-[#666666]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                  <span>Instant activation upon verified Razorpay payment.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                  <span>Zero commission on successful hires.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                  <span>Secure payments via UPI, Cards, and NetBanking.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                  <span>Tax invoices generated automatically for accounting.</span>
                </li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-[11px] text-[#666666]">
              Need custom Enterprise contracts? Contact our billing team at <code className="text-[#202124] font-bold">billing@truehire.io</code>
            </div>
          </div>
        </div>

        {/* Payment & Invoice History */}
        <div className="rounded-3xl bg-[#FFFFFF] border border-[#E9E6DF] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#202124]">Payment & Invoice History</h3>
              <p className="text-xs text-[#666666]">View all past transactions, Razorpay receipts, and refund statuses.</p>
            </div>
          </div>

          {payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#202124]">
                <thead>
                  <tr className="border-b border-[#E9E6DF] text-[#666666] uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Plan</th>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Payment ID</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9E6DF]">
                  {payments.map((p) => (
                    <tr key={p._id} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="py-3.5 px-4 text-[#666666]">
                        {new Date(p.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#202124]">
                        {p.planId?.name || 'Recruiter Plan'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#666666]">
                        {p.razorpayOrderId}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#202124]">
                        {p.razorpayPaymentId || '—'}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#202124]">
                        ₹{p.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(p.paymentStatus)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-[#666666] text-xs">
              No payment transactions recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;

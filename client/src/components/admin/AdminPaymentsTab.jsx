import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import { Button } from '../common/Button';
import {
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  RotateCcw,
  X,
  Loader2
} from 'lucide-react';

export const AdminPaymentsTab = ({ onShowToast }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRefundPayment, setSelectedRefundPayment] = useState(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [processingRefund, setProcessingRefund] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [filterStatus]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await paymentService.getAllPayments({
        status: filterStatus === 'all' ? undefined : filterStatus
      });
      if (res && res.data) {
        setPayments(res.data);
      }
    } catch (err) {
      console.error('Failed to load payments:', err);
      if (onShowToast) onShowToast('Failed to load payments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRefundModal = (payment) => {
    setSelectedRefundPayment(payment);
    const maxRefundable = payment.amount - (payment.refundAmount || 0);
    setRefundAmount(maxRefundable.toString());
    setRefundReason('Customer requested cancellation / operational adjustment');
  };

  const handleExecuteRefund = async (e) => {
    e.preventDefault();
    if (!selectedRefundPayment) return;

    const amt = Number(refundAmount);
    if (!amt || amt <= 0) {
      alert('Please enter a valid refund amount');
      return;
    }

    setProcessingRefund(true);
    try {
      await paymentService.processRefund(selectedRefundPayment._id, {
        amount: amt,
        reason: refundReason
      });

      if (onShowToast) {
        onShowToast(`Refund of ₹${amt.toLocaleString('en-IN')} processed successfully!`, 'success');
      }

      setSelectedRefundPayment(null);
      fetchPayments();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Refund processing failed';
      if (onShowToast) onShowToast(msg, 'error');
    } finally {
      setProcessingRefund(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'captured':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#C6A15B]/15 text-[#A98443] border border-[#C6A15B]/30">
            <CheckCircle2 className="w-3 h-3 text-[#C6A15B]" />
            <span>Captured</span>
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FAF9F6] text-[#202124] border border-[#E9E6DF]">
            <RotateCcw className="w-3 h-3 text-[#C6A15B]" />
            <span>Refunded</span>
          </span>
        );
      case 'pending':
      case 'created':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FAF9F6] text-[#666666] border border-[#E9E6DF]">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FAF9F6] text-[#666666] border border-[#E9E6DF]">
            <XCircle className="w-3 h-3" />
            <span className="capitalize">{status}</span>
          </span>
        );
    }
  };

  const filteredPayments = payments.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.razorpayOrderId?.toLowerCase().includes(q) ||
      p.razorpayPaymentId?.toLowerCase().includes(q) ||
      p.recruiterId?.email?.toLowerCase().includes(q) ||
      p.companyId?.name?.toLowerCase().includes(q) ||
      p.planId?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 text-[#202124]">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 border-b border-[#E9E6DF] pb-2 w-full sm:w-auto">
          {['all', 'captured', 'refunded', 'pending', 'failed'].map((st) => (
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

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#666666] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search order, payment or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none transition-colors"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#666666]">Loading payment transactions...</div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#666666] space-y-2">
            <CreditCard className="w-8 h-8 mx-auto text-[#666666]" />
            <p>No transactions found matching criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#202124]">
              <thead>
                <tr className="border-b border-[#E9E6DF] text-[#666666] uppercase text-[10px] tracking-wider bg-[#FAF9F6] font-semibold">
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Recruiter / Company</th>
                  <th className="py-3.5 px-4">Plan</th>
                  <th className="py-3.5 px-4">Order / Payment ID</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E6DF]">
                {filteredPayments.map((p) => {
                  const canRefund = p.paymentStatus === 'captured' || (p.amount > (p.refundAmount || 0) && p.paymentStatus !== 'failed');
                  return (
                    <tr key={p._id} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="py-3.5 px-4 text-[#666666]">
                        {new Date(p.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#202124]">{p.companyId?.name || 'Recruiter'}</div>
                        <div className="text-[11px] text-[#666666] font-mono">{p.recruiterId?.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-[#202124]">{p.planId?.name || 'Plan'}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div className="text-[#666666]">{p.razorpayOrderId}</div>
                        {p.razorpayPaymentId && (
                          <div className="text-[#202124] font-semibold">{p.razorpayPaymentId}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#202124]">
                        ₹{p.amount.toLocaleString('en-IN')}
                        {p.refundAmount > 0 && (
                          <span className="block text-[10px] text-[#666666] font-normal">
                            (Refunded: ₹{p.refundAmount.toLocaleString('en-IN')})
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(p.paymentStatus)}</td>
                      <td className="py-3.5 px-4 text-right">
                        {canRefund && p.razorpayPaymentId ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenRefundModal(p)}
                            className="text-xs text-[#666666] hover:text-[#202124] border-[#E9E6DF]"
                          >
                            Refund
                          </Button>
                        ) : (
                          <span className="text-[#666666] text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admin Refund Modal */}
      {selectedRefundPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202124]/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl p-6 bg-[#FFFFFF] border border-[#E9E6DF] shadow-2xl text-[#202124]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E6DF]">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-[#C6A15B]" />
                <h3 className="font-bold text-[#202124] text-base">Issue Payment Refund</h3>
              </div>
              <button
                onClick={() => setSelectedRefundPayment(null)}
                className="p-1.5 rounded-lg text-[#666666] hover:text-[#202124]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteRefund} className="mt-4 space-y-4">
              <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#666666]">Payment ID:</span>
                  <span className="font-mono text-[#202124] font-bold">{selectedRefundPayment.razorpayPaymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Original Amount:</span>
                  <span className="font-bold text-[#202124]">₹{selectedRefundPayment.amount}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202124] mb-1">
                  Refund Amount (INR) *
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedRefundPayment.amount - (selectedRefundPayment.refundAmount || 0)}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202124] mb-1">
                  Reason for Refund *
                </label>
                <textarea
                  rows="3"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="e.g. Recruiter request, accidental duplicate purchase, company moderation..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-[#666666] text-[11px] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-[#C6A15B]" />
                <span>This executes the Razorpay Refund API and reverses the transaction to the user's source payment method.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedRefundPayment(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={processingRefund}
                >
                  {processingRefund ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Refund'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentsTab;

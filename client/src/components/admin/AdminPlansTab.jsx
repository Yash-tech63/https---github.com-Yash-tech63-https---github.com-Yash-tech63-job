import React, { useState, useEffect } from 'react';
import { planService } from '../../services/planService';
import { Button } from '../common/Button';
import { Edit2, Sparkles, Loader2 } from 'lucide-react';

export const AdminPlansTab = ({ onShowToast }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await planService.getPlans();
      if (res && res.data) {
        setPlans(res.data);
      }
    } catch (err) {
      console.error('Failed to load plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (plan) => {
    setEditingPlanId(plan._id);
    setEditForm({
      name: plan.name,
      price: plan.price,
      jobPostingLimit: plan.jobPostingLimit,
      durationDays: plan.durationDays || 30,
      description: plan.description || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingPlanId(null);
    setEditForm({});
  };

  const handleSavePlan = async (planId) => {
    setSaving(true);
    try {
      await planService.updatePlan(planId, {
        name: editForm.name,
        price: Number(editForm.price),
        jobPostingLimit: Number(editForm.jobPostingLimit),
        durationDays: Number(editForm.durationDays),
        description: editForm.description
      });

      if (onShowToast) {
        onShowToast('Pricing plan updated successfully in MongoDB!', 'success');
      }

      setEditingPlanId(null);
      fetchPlans();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update plan';
      if (onShowToast) onShowToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-[#666666]">Loading configurable plans...</div>;
  }

  return (
    <div className="space-y-6 text-[#202124]">
      <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-sm text-xs text-[#202124] flex items-center gap-2">
        <Sparkles className="w-4 h-4 shrink-0 text-[#C6A15B]" />
        <span>
          Plan prices and limits are dynamically retrieved by Razorpay orders from MongoDB. Updates made here instantly reflect in customer checkout orders.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isEditing = editingPlanId === p._id;

          return (
            <div
              key={p._id}
              className="rounded-3xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-sm p-6 flex flex-col justify-between space-y-4"
            >
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#202124] mb-1">Plan Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#202124] mb-1">Price (₹ INR)</label>
                    <input
                      type="number"
                      min="1"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#202124] mb-1">Job Posting Limit</label>
                    <input
                      type="number"
                      min="1"
                      value={editForm.jobPostingLimit}
                      onChange={(e) => setEditForm({ ...editForm, jobPostingLimit: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#202124] mb-1">Duration (Days)</label>
                    <input
                      type="number"
                      min="1"
                      value={editForm.durationDays}
                      onChange={(e) => setEditForm({ ...editForm, durationDays: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#202124] mb-1">Description</label>
                    <textarea
                      rows="2"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSavePlan(p._id)}
                      disabled={saving}
                      className="w-full text-xs"
                    >
                      {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : 'Save Changes'}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-xl font-black text-[#202124]">{p.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full uppercase font-bold bg-[#FAF9F6] text-[#202124] border border-[#E9E6DF] font-mono">
                        {p.slug}
                      </span>
                    </div>

                    <div className="mt-3 mb-4 pb-4 border-b border-[#E9E6DF] flex items-baseline gap-1">
                      <span className="text-3xl font-black text-[#202124]">₹{p.price.toLocaleString('en-IN')}</span>
                      <span className="text-xs text-[#666666]">/ {p.durationDays || 30} days</span>
                    </div>

                    <div className="space-y-1.5 text-xs text-[#202124]">
                      <p><span className="text-[#666666]">Postings:</span> <strong className="text-[#202124]">{p.jobPostingLimit} Jobs</strong></p>
                      <p><span className="text-[#666666]">Validity:</span> <strong className="text-[#202124]">{p.durationDays || 30} Days</strong></p>
                      <p className="text-[11px] text-[#666666] pt-2">{p.description}</p>
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Edit2}
                    onClick={() => handleStartEdit(p)}
                    className="w-full text-xs font-semibold"
                  >
                    Edit Pricing & Limits
                  </Button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminPlansTab;

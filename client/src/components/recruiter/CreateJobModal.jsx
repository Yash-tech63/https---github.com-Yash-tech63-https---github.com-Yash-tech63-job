import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, DollarSign } from 'lucide-react';
import { Button } from '../common/Button';
import { SkillsInput } from '../candidate/SkillsInput';

export const CreateJobModal = ({ isOpen, onClose, onJobCreated, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'internship',
    description: '',
    skills: [],
    salary: '',
    salaryMin: '',
    salaryMax: '',
    currency: 'INR',
    salaryPeriod: 'yearly',
    hideSalary: false,
    isNegotiable: false,
    isPaid: true,
    stipendMin: '',
    stipendMax: '',
    duration: '3 Months',
    workMode: 'remote',
    location: 'Remote',
    deadline: '',
    status: 'published'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        type: initialData.type || 'internship',
        description: initialData.description || '',
        skills: initialData.skills || [],
        salary: initialData.salary || '',
        salaryMin: initialData.salaryMin ?? '',
        salaryMax: initialData.salaryMax ?? '',
        currency: initialData.currency || 'INR',
        salaryPeriod: initialData.salaryPeriod || 'yearly',
        hideSalary: !!initialData.hideSalary,
        isNegotiable: !!initialData.isNegotiable,
        isPaid: initialData.isPaid !== false,
        stipendMin: initialData.stipendMin ?? '',
        stipendMax: initialData.stipendMax ?? '',
        duration: initialData.duration || '3 Months',
        workMode: initialData.workMode || 'remote',
        location: initialData.location || 'Remote',
        deadline: initialData.deadline ? initialData.deadline.split('T')[0] : '',
        status: initialData.status || 'published'
      });
    } else {
      setFormData({
        title: '',
        type: 'internship',
        description: '',
        skills: ['React', 'TypeScript'],
        salary: '₹15,000 - ₹25,000 / month',
        salaryMin: '',
        salaryMax: '',
        currency: 'INR',
        salaryPeriod: 'yearly',
        hideSalary: false,
        isNegotiable: false,
        isPaid: true,
        stipendMin: 15000,
        stipendMax: 25000,
        duration: '3 Months',
        workMode: 'remote',
        location: 'Remote',
        deadline: '',
        status: 'published'
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    if (!formData.duration.trim()) {
      setError('Duration is required');
      return;
    }

    if (formData.type === 'job' && !formData.hideSalary) {
      if (formData.salaryMin && formData.salaryMax && Number(formData.salaryMin) > Number(formData.salaryMax)) {
        setError('Minimum salary cannot exceed maximum salary');
        return;
      }
    }

    if (formData.type === 'internship' && formData.isPaid) {
      if (formData.stipendMin && formData.stipendMax && Number(formData.stipendMin) > Number(formData.stipendMax)) {
        setError('Minimum stipend cannot exceed maximum stipend');
        return;
      }
    }

    let finalSalary = formData.salary;
    const currSymbol = formData.currency === 'INR' ? '₹' : formData.currency === 'USD' ? '$' : formData.currency === 'EUR' ? '€' : '£';

    if (formData.hideSalary) {
      finalSalary = 'Not Disclosed';
    } else if (formData.type === 'internship') {
      if (!formData.isPaid) {
        finalSalary = 'Unpaid';
      } else if (formData.stipendMin && formData.stipendMax) {
        finalSalary = `${currSymbol}${Number(formData.stipendMin).toLocaleString('en-IN')} - ${currSymbol}${Number(formData.stipendMax).toLocaleString('en-IN')}/mo`;
      } else if (formData.stipendMin) {
        finalSalary = `${currSymbol}${Number(formData.stipendMin).toLocaleString('en-IN')}/mo`;
      }
    } else {
      if (formData.salaryMin && formData.salaryMax) {
        finalSalary = `${currSymbol}${Number(formData.salaryMin).toLocaleString('en-IN')} - ${currSymbol}${Number(formData.salaryMax).toLocaleString('en-IN')}/${formData.salaryPeriod}`;
      } else if (formData.salaryMin) {
        finalSalary = `${currSymbol}${Number(formData.salaryMin).toLocaleString('en-IN')}/${formData.salaryPeriod}`;
      }
    }

    setIsLoading(true);
    try {
      await onJobCreated({
        ...formData,
        salary: finalSalary || 'Competitive'
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save job');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-[#202124]/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E9E6DF] shadow-2xl my-8 overflow-hidden max-h-[90vh] flex flex-col text-[#202124]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E9E6DF]">
            <div>
              <h3 className="text-xl font-bold text-[#202124]">
                {initialData ? 'Edit Opportunity Listing' : 'Post New Opportunity'}
              </h3>
              <p className="text-xs text-[#666666] mt-0.5">
                Jobs become discoverable to candidates once verified by our team.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#666666] hover:text-[#202124] hover:bg-[#FAF9F6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-[#FAF9F6] border border-[#202124] text-[#202124] text-xs flex flex-col gap-1.5">
              <div className="flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#C6A15B]" />
                <span>{error}</span>
              </div>
              {(error.toLowerCase().includes('plan') ||
                error.toLowerCase().includes('subscription') ||
                error.toLowerCase().includes('limit') ||
                error.toLowerCase().includes('credit')) && (
                <div className="pt-1">
                  <a
                    href="/recruiter/pricing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C6A15B] hover:text-[#A98443] underline"
                  >
                    <span>View Recruiter Plans & Pricing →</span>
                  </a>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto py-4 flex-1 pr-1">
            {/* Title & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#202124] mb-1.5">
                  Job / Internship Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Frontend Engineering Intern"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202124] mb-1.5">
                  Category *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none transition-colors"
                >
                  <option value="internship">Internship</option>
                  <option value="job">Full-time Job</option>
                </select>
              </div>
            </div>

            {/* Work Mode & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#202124] mb-1.5">
                  Work Mode *
                </label>
                <select
                  value={formData.workMode}
                  onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none transition-colors"
                >
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">Onsite</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202124] mb-1.5">
                  Location (City / State / Remote)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, KA or Remote"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Salary / Compensation Builder */}
            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E9E6DF] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#202124] flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[#C6A15B]" />
                  {formData.type === 'internship' ? 'Stipend Configuration' : 'Salary Configuration'}
                </span>

                <div className="flex items-center gap-2">
                  <label className="text-[11px] text-[#666666] flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hideSalary}
                      onChange={(e) => setFormData({ ...formData, hideSalary: e.target.checked })}
                      className="rounded border-[#E9E6DF] accent-[#C6A15B]"
                    />
                    <span>Hide from public card</span>
                  </label>
                </div>
              </div>

              {!formData.hideSalary && (
                <>
                  {formData.type === 'internship' ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-xs">
                        <label className="flex items-center gap-1.5 cursor-pointer text-[#202124]">
                          <input
                            type="radio"
                            name="isPaid"
                            checked={formData.isPaid}
                            onChange={() => setFormData({ ...formData, isPaid: true })}
                            className="accent-[#C6A15B]"
                          />
                          <span>Paid Internship</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer text-[#202124]">
                          <input
                            type="radio"
                            name="isPaid"
                            checked={!formData.isPaid}
                            onChange={() => setFormData({ ...formData, isPaid: false })}
                            className="accent-[#C6A15B]"
                          />
                          <span>Unpaid Internship</span>
                        </label>
                      </div>

                      {formData.isPaid && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[11px] text-[#666666] mb-1">Currency</label>
                            <select
                              value={formData.currency}
                              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E9E6DF] text-xs text-[#202124]"
                            >
                              <option value="INR">INR (₹)</option>
                              <option value="USD">USD ($)</option>
                              <option value="EUR">EUR (€)</option>
                              <option value="GBP">GBP (£)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] text-[#666666] mb-1">Min Stipend / mo</label>
                            <input
                              type="number"
                              min="0"
                              placeholder="e.g. 15000"
                              value={formData.stipendMin}
                              onChange={(e) => setFormData({ ...formData, stipendMin: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E9E6DF] text-xs text-[#202124]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-[#666666] mb-1">Max Stipend / mo</label>
                            <input
                              type="number"
                              min="0"
                              placeholder="e.g. 25000"
                              value={formData.stipendMax}
                              onChange={(e) => setFormData({ ...formData, stipendMax: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E9E6DF] text-xs text-[#202124]"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <div>
                          <label className="block text-[11px] text-[#666666] mb-1">Currency</label>
                          <select
                            value={formData.currency}
                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E9E6DF] text-xs text-[#202124]"
                          >
                            <option value="INR">INR (₹)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] text-[#666666] mb-1">Min Salary</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="e.g. 600000"
                            value={formData.salaryMin}
                            onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E9E6DF] text-xs text-[#202124]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-[#666666] mb-1">Max Salary</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="e.g. 1200000"
                            value={formData.salaryMax}
                            onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E9E6DF] text-xs text-[#202124]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-[#666666] mb-1">Period</label>
                          <select
                            value={formData.salaryPeriod}
                            onChange={(e) => setFormData({ ...formData, salaryPeriod: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E9E6DF] text-xs text-[#202124]"
                          >
                            <option value="yearly">Per Year</option>
                            <option value="monthly">Per Month</option>
                            <option value="hourly">Per Hour</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-[11px] text-[#666666] flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.isNegotiable}
                            onChange={(e) => setFormData({ ...formData, isNegotiable: e.target.checked })}
                            className="rounded border-[#E9E6DF] accent-[#C6A15B]"
                          />
                          <span>Salary is negotiable based on experience</span>
                        </label>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Duration & Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#202124] mb-1.5">
                  Duration *
                </label>
                {formData.type === 'internship' ? (
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none transition-colors"
                  >
                    <option value="1 Month">1 Month</option>
                    <option value="2 Months">2 Months</option>
                    <option value="3 Months">3 Months</option>
                    <option value="6 Months">6 Months</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full-time or 1 Year Contract"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none transition-colors"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202124] mb-1.5">
                  Application Deadline
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1.5">
                Required Skills
              </label>
              <SkillsInput
                skills={formData.skills}
                onChange={(skills) => setFormData({ ...formData, skills })}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1.5">
                Job Description & Qualifications *
              </label>
              <textarea
                rows={5}
                required
                placeholder="Describe role responsibilities, what the candidate will learn, and expectations..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none transition-colors leading-relaxed"
              />
            </div>

            {/* Status toggle */}
            <div className="flex items-center gap-4 pt-2">
              <label className="text-xs font-semibold text-[#202124]">Initial Status:</label>
              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer text-[#202124]">
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={formData.status === 'published'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="accent-[#C6A15B]"
                  />
                  <span>Published (Live)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-[#202124]">
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={formData.status === 'draft'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="accent-[#C6A15B]"
                  />
                  <span>Draft</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E9E6DF] flex justify-end gap-3">
              <Button type="button" variant="secondary" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
                {initialData ? 'Update Opportunity' : 'Publish Opportunity'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateJobModal;

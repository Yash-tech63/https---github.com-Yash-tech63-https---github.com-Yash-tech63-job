import React, { useState, useEffect } from 'react';
import { recruiterService } from '../../services/recruiterService';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';
import { CompanyStatusBanner } from '../../components/recruiter/CompanyStatusBanner';

export const CompanyProfile = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    setLoading(true);
    try {
      const res = await recruiterService.getCompany();
      if (res && res.data) {
        const c = res.data;
        setCompany(c);
        setName(c.name || '');
        setWebsite(c.website || '');
        setIndustry(c.industry || '');
        setSize(c.size || '');
        setLocation(c.location || '');
        setDescription(c.description || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await recruiterService.updateCompany({
        name,
        website,
        industry,
        size,
        location,
        description
      });
      if (res?.data) {
        setCompany(res.data);
        setToast({ message: 'Company profile updated successfully!', type: 'success' });
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || err.message || 'Update failed',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center text-[#666666]">
        Loading company profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <CompanyStatusBanner company={company} />

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#202124] tracking-tight">Company Information</h1>
          <p className="text-xs text-[#666666] mt-1">
            Provide accurate corporate details to expedite administrative trust approval.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-sm">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#202124] mb-1.5">Company Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] transition-colors outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202124] mb-1.5">Official Website *</label>
                <input
                  type="url"
                  required
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] transition-colors outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#202124] mb-1.5">Industry</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] transition-colors outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202124] mb-1.5">Team Size</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] focus:bg-[#FFFFFF] focus:border-[#C6A15B] transition-colors outline-none"
                >
                  <option value="1-10 employees">1-10 employees</option>
                  <option value="10-50 employees">10-50 employees</option>
                  <option value="50-200 employees">50-200 employees</option>
                  <option value="200+ employees">200+ employees</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202124] mb-1.5">HQ Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] transition-colors outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1.5">Company Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] transition-colors outline-none"
              />
            </div>

            <div className="pt-4 border-t border-[#E9E6DF] flex justify-end">
              <Button type="submit" variant="primary" isLoading={saving}>
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;

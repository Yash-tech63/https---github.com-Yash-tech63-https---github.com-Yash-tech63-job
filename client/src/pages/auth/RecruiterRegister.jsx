import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { recruiterService } from '../../services/recruiterService';
import { Button } from '../../components/common/Button';
import { Building2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const RecruiterRegister = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    website: '',
    industry: 'Technology & SaaS',
    size: '10-50 employees',
    location: 'San Francisco, CA',
    description: ''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        role: 'recruiter',
        companyName: formData.companyName
      });

      try {
        await recruiterService.updateCompany({
          name: formData.companyName,
          website: formData.website,
          industry: formData.industry,
          size: formData.size,
          location: formData.location,
          description: formData.description
        });
      } catch (cErr) {
        // non-blocking
      }

      navigate('/recruiter/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-12 relative bg-[#FAF9F6]">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#202124] text-[#C6A15B] flex items-center justify-center mx-auto shadow-subtle border border-[#C6A15B]/30">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-[#202124] tracking-tight">Register Employer Account</h2>
          <p className="text-xs text-[#666666]">Post verified opportunities to top engineering &amp; design talent</p>
        </div>

        <div className="rounded-2xl border border-[#E9E6DF] bg-[#FFFFFF] p-8 shadow-card">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-[#FAF9F6] border border-[#A98443] text-[#202124] text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#C6A15B]" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#202124] mb-1.5">Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Acme Corp"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202124] mb-1.5">Official Website *</label>
                <input
                  type="url"
                  required
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://company.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#202124] mb-1.5">Work Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="recruiter@company.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202124] mb-1.5">Password *</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#202124] mb-1.5">Industry</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202124] mb-1.5">Team Size</label>
                <select
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none transition-colors"
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
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="San Francisco, CA"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1.5">Company Description</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What does your company build?"
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none transition-colors"
              />
            </div>

            {/* Trust Notice */}
            <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
              <span>
                Initial verification status is <strong className="text-[#A98443]">Pending</strong>. Listings become public after administrator verification.
              </span>
            </div>

            <Button type="submit" variant="primary" className="w-full font-bold shadow-gold" isLoading={isLoading}>
              <span>Register Employer Profile</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-[#666666]">
          Already registered?{' '}
          <Link to="/login" className="text-[#C6A15B] hover:text-[#A98443] hover:underline font-bold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RecruiterRegister;

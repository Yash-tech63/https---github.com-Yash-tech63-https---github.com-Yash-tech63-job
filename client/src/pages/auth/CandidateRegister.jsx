import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { User, Mail, Lock, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

export const CandidateRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name,
        email,
        password,
        role: 'candidate'
      });
      navigate('/candidate/profile');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12 relative bg-[#FAF9F6]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#202124] text-[#C6A15B] flex items-center justify-center mx-auto shadow-subtle border border-[#C6A15B]/30">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-[#202124] tracking-tight">Join as Candidate</h2>
          <p className="text-xs text-[#666666]">Discover verified internships &amp; full-time career roles</p>
        </div>

        <div className="rounded-2xl border border-[#E9E6DF] bg-[#FFFFFF] p-8 shadow-card">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-[#FAF9F6] border border-[#A98443] text-[#202124] text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#C6A15B]" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#666666] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#666666] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.dev@stanford.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#666666] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none transition-colors"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full font-bold shadow-gold" isLoading={isLoading}>
              <span>Create Candidate Account</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          <div className="mt-4 pt-4 border-t border-[#E9E6DF] flex items-center justify-center gap-2 text-[11px] text-[#666666]">
            <ShieldCheck className="w-4 h-4 text-[#C6A15B]" />
            Protected by TrueHire Trust Protocol
          </div>
        </div>

        <p className="text-center text-xs text-[#666666]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#C6A15B] hover:text-[#A98443] hover:underline font-bold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CandidateRegister;

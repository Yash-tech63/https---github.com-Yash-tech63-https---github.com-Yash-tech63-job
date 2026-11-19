import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Button } from './Button';
import {
  Compass,
  Briefcase,
  ShieldCheck,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Building2,
  GraduationCap,
  CreditCard
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, role } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'recruiter') return '/recruiter/dashboard';
    return '/candidate/dashboard';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#202124] border-b border-[#343538] shadow-md'
          : 'bg-[#202124] border-b border-[#343538]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#343538] border border-[#C6A15B]/40 flex items-center justify-center group-hover:border-[#C6A15B] transition-colors">
              <Compass className="w-4 h-4 text-[#C6A15B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-[#FAF9F6]">
                  TRUEHIRE
                </span>
                <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded bg-[#343538] text-[#C6A15B] border border-[#C6A15B]/30">
                  Verified
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {role !== 'recruiter' && role !== 'admin' && (
              <Link
                to="/jobs"
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive('/jobs')
                    ? 'text-[#C6A15B] bg-[#343538]'
                    : 'text-[#FAF9F6] hover:text-[#C6A15B] hover:bg-[#343538]/60'
                }`}
              >
                Explore Jobs
                {isActive('/jobs') && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#C6A15B] rounded-full" />
                )}
              </Link>
            )}

            {role !== 'candidate' && role !== 'admin' && (
              <Link
                to="/recruiter/pricing"
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive('/recruiter/pricing')
                    ? 'text-[#C6A15B] bg-[#343538]'
                    : 'text-[#FAF9F6] hover:text-[#C6A15B] hover:bg-[#343538]/60'
                }`}
              >
                Pricing
                {isActive('/recruiter/pricing') && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#C6A15B] rounded-full" />
                )}
              </Link>
            )}

            {isAuthenticated && (
              <Link
                to={getDashboardPath()}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  location.pathname.includes('/dashboard')
                    ? 'text-[#C6A15B] bg-[#343538]'
                    : 'text-[#FAF9F6] hover:text-[#C6A15B] hover:bg-[#343538]/60'
                }`}
              >
                Dashboard
                {location.pathname.includes('/dashboard') && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#C6A15B] rounded-full" />
                )}
              </Link>
            )}

            {role === 'recruiter' && (
              <>
                <Link
                  to="/recruiter/company"
                  className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/recruiter/company')
                      ? 'text-[#C6A15B] bg-[#343538]'
                      : 'text-[#FAF9F6] hover:text-[#C6A15B] hover:bg-[#343538]/60'
                  }`}
                >
                  Company Profile
                </Link>
                <Link
                  to="/recruiter/billing"
                  className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/recruiter/billing')
                      ? 'text-[#C6A15B] bg-[#343538]'
                      : 'text-[#FAF9F6] hover:text-[#C6A15B] hover:bg-[#343538]/60'
                  }`}
                >
                  Billing
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#343538] border border-[#343538] hover:border-[#C6A15B] text-xs font-medium text-[#FAF9F6] transition-colors cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-md bg-[#202124] text-[#C6A15B] flex items-center justify-center font-bold text-[10px] uppercase border border-[#C6A15B]/30">
                    {user?.email?.charAt(0) || 'U'}
                  </div>
                  <span className="max-w-[120px] truncate font-mono text-[11px] text-[#FAF9F6]">
                    {user?.email}
                  </span>
                  <span className="capitalize text-[10px] px-1.5 py-0.5 rounded bg-[#202124] text-[#C6A15B] border border-[#343538]">
                    {role}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#E9E6DF]" />
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-xl bg-[#202124] border border-[#343538] shadow-modal p-1.5 z-50"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-[#343538] mb-1">
                      <p className="text-[10px] text-[#E9E6DF]/60">Signed in as</p>
                      <p className="text-xs font-semibold text-[#FAF9F6] truncate">{user?.email}</p>
                    </div>

                    <Link
                      to={getDashboardPath()}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-[#FAF9F6] hover:text-[#C6A15B] hover:bg-[#343538] transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-[#C6A15B]" />
                      My Dashboard
                    </Link>

                    {role === 'recruiter' && (
                      <Link
                        to="/recruiter/billing"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-[#FAF9F6] hover:text-[#C6A15B] hover:bg-[#343538] transition-colors"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-[#C6A15B]" />
                        Billing &amp; Subscriptions
                      </Link>
                    )}

                    {role === 'candidate' && (
                      <Link
                        to="/candidate/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-[#FAF9F6] hover:text-[#C6A15B] hover:bg-[#343538] transition-colors"
                      >
                        <Briefcase className="w-3.5 h-3.5 text-[#C6A15B]" />
                        Edit Profile &amp; Resume
                      </Link>
                    )}

                    <div className="border-t border-[#343538] my-1" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-[#E9E6DF]/80 hover:text-[#FFFFFF] hover:bg-[#343538] transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#FAF9F6] hover:text-[#C6A15B] hover:bg-[#343538] transition-colors"
                >
                  Sign In
                </Link>
                <Link to="/register/candidate">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="primary" size="sm" className="!bg-[#C6A15B] !text-[#202124] hover:!bg-[#A98443] !border-[#C6A15B] font-bold">
                      Get Started
                    </Button>
                  </motion.div>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md text-[#FAF9F6] hover:text-[#C6A15B] hover:bg-[#343538]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer with smooth animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden px-4 pt-2 pb-5 bg-[#202124] border-b border-[#343538] space-y-2"
          >
            {role !== 'recruiter' && role !== 'admin' && (
              <Link
                to="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-xs font-medium text-[#FAF9F6] hover:text-[#C6A15B] hover:bg-[#343538]"
              >
                Explore Jobs
              </Link>
            )}
            {role !== 'candidate' && role !== 'admin' && (
              <Link
                to="/recruiter/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-xs font-medium text-[#FAF9F6] hover:text-[#C6A15B] hover:bg-[#343538]"
              >
                Pricing
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-xs font-medium text-[#FAF9F6] hover:text-[#C6A15B] hover:bg-[#343538]"
                >
                  Dashboard ({role})
                </Link>
                {role === 'recruiter' && (
                  <Link
                    to="/recruiter/billing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-xs font-medium text-[#FAF9F6] hover:text-[#C6A15B] hover:bg-[#343538]"
                  >
                    Billing &amp; Subscriptions
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-xs font-medium text-[#E9E6DF]/80 hover:text-[#FFFFFF] hover:bg-[#343538]"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full !bg-[#343538] !text-[#FAF9F6] !border-[#343538]">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register/candidate" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full !bg-[#C6A15B] !text-[#202124] hover:!bg-[#A98443] !border-[#C6A15B]">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

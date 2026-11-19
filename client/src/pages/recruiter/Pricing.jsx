import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { planService } from '../../services/planService';
import { useAuth } from '../../context/AuthContext';
import { RazorpayCheckoutModal } from '../../components/payment/RazorpayCheckout';
import { Toast } from '../../components/common/Toast';
import { Button } from '../../components/common/Button';
import {
  Check,
  ShieldCheck,
  Building2,
  HelpCircle,
  ArrowRight,
  Briefcase,
  GraduationCap,
  CheckCircle2
} from 'lucide-react';

export const Pricing = () => {
  const { user, role, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [currentSub, setCurrentSub] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchPricingData();
  }, []);

  const fetchPricingData = async () => {
    setLoading(true);
    try {
      const plansRes = await planService.getPlans();
      if (plansRes && plansRes.data) {
        setPlans(plansRes.data);
      }

      if (isAuthenticated && role === 'recruiter') {
        const subRes = await planService.getCurrentSubscription();
        if (subRes && subRes.data) {
          setCurrentSub(subRes.data.subscription);
          setCompanyInfo(subRes.data.company);
        }
      }
    } catch (err) {
      console.error('Failed to load plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/recruiter/pricing');
      return;
    }
    if (role !== 'recruiter') {
      setToast({
        message: 'Only recruiter accounts can purchase job posting plans.',
        type: 'warning'
      });
      return;
    }

    const planToPurchase = billingCycle === 'yearly' && plan.billingType !== 'per_job'
      ? {
          ...plan,
          price: Math.round(plan.price * 12 * 0.8),
          durationDays: 365,
          name: `${plan.name} (Annual)`
        }
      : plan;

    setSelectedPlan(planToPurchase);
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = (data) => {
    setToast({
      message: `Payment successful! Your ${data?.subscription?.planId?.name || 'recruiter'} plan has been activated.`,
      type: 'success'
    });
    fetchPricingData();
  };

  const displayPlans = plans.length > 0 ? plans : [
    {
      _id: 'starter',
      name: 'Starter',
      slug: 'starter',
      price: 499,
      billingType: 'per_job',
      durationDays: 30,
      jobPostingLimit: 1,
      description: 'Ideal for early-stage teams hiring for a single priority opening.',
      features: [
        '1 active job posting for 30 days',
        'Direct application tracking dashboard',
        'Standard candidate email alerts',
        'Basic recruiter analytics'
      ]
    },
    {
      _id: 'professional',
      name: 'Professional',
      slug: 'professional',
      price: 1499,
      billingType: 'subscription',
      durationDays: 30,
      jobPostingLimit: 5,
      description: 'Best for growing companies actively building engineering & design teams.',
      features: [
        'Up to 5 active job postings',
        'Featured opportunity badge on listings',
        'Prioritized placement in candidate discovery',
        'Candidate resume downloads & pipeline stages',
        'Zero ghosting SLA guarantee badge'
      ]
    },
    {
      _id: 'enterprise',
      name: 'Enterprise',
      slug: 'enterprise',
      price: 3999,
      billingType: 'subscription',
      durationDays: 30,
      jobPostingLimit: 20,
      description: 'Maximum recruiting volume with priority support and unlimited talent matching.',
      features: [
        'Up to 20 active job and internship openings',
        'Top-tier search placement across all categories',
        'Full candidate pipeline and export tools',
        'Dedicated verification liaison & priority support',
        'Team multi-seat support'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#202124] py-16 px-4 sm:px-6 lg:px-8 relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E9E6DF] text-[#202124] text-xs font-semibold uppercase tracking-wider shadow-subtle">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B]" />
            <span>Transparent Recruiter Pricing</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-[#202124] tracking-tight">
            Scale Your Hiring with Verified Talent
          </h1>

          <p className="text-base sm:text-lg text-[#666666]">
            Choose the right posting plan for your team. Zero hidden fees. Pay via Razorpay with UPI, NetBanking or Cards.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-[#C6A15B] text-[#202124] shadow-sm'
                  : 'bg-[#FFFFFF] text-[#666666] hover:text-[#202124] border border-[#E9E6DF]'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-[#C6A15B] text-[#202124] shadow-sm'
                  : 'bg-[#FFFFFF] text-[#666666] hover:text-[#202124] border border-[#E9E6DF]'
              }`}
            >
              <span>Annual Billing</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                billingCycle === 'yearly' ? 'bg-[#202124] text-[#C6A15B]' : 'bg-[#FAF9F6] text-[#A98443] border border-[#C6A15B]'
              }`}>
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Candidate Free vs Recruiter Paid Comparison Banner */}
        <div className="rounded-3xl bg-[#FFFFFF] border border-[#E9E6DF] p-6 sm:p-8 shadow-card space-y-6">
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-[#202124] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#C6A15B]" />
              TrueHire Fair Access Model
            </h3>
            <p className="text-xs text-[#666666] mt-1">
              Candidates never pay to apply. Employers pay transparent fees to reach verified candidates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Candidate Tier */}
            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#E9E6DF] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#202124] flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#C6A15B]" />
                  Job Seekers &amp; Candidates
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF9F6] text-[#A98443] border border-[#C6A15B] uppercase tracking-wider">
                  100% Free Forever
                </span>
              </div>
              <ul className="space-y-2 text-xs text-[#666666]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                  <span>Free registration and verified profile builder</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                  <span>Unlimited job and internship search and filters</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                  <span>1-Click job applications with personalized notes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                  <span>Real-time status tracking with zero ghosting protocol</span>
                </li>
              </ul>
            </div>

            {/* Recruiter Tier */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#202124] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#C6A15B]" />
                  Employers &amp; Recruiters
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#202124] text-[#C6A15B] border border-[#C6A15B]/30 uppercase tracking-wider">
                  Paid Subscriptions
                </span>
              </div>
              <ul className="space-y-2 text-xs text-[#666666]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                  <span>Verified organization badge and fraud protection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                  <span>Publish open positions to high-intent candidate pool</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                  <span>Candidate screening, pipeline management and status updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                  <span>Automated Razorpay tax invoices and instant quota release</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Company Verification Gating Notice */}
        {isAuthenticated && role === 'recruiter' && companyInfo && (
          <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] flex items-center justify-center text-[#C6A15B]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#202124]">{companyInfo.name}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold border ${
                    companyInfo.verificationStatus === 'valid'
                      ? 'bg-[#202124] text-[#C6A15B] border-[#C6A15B]'
                      : 'bg-[#FAF9F6] text-[#343538] border-[#E9E6DF]'
                  }`}>
                    {companyInfo.verificationStatus}
                  </span>
                </div>
                <p className="text-xs text-[#666666] mt-0.5">
                  {companyInfo.verificationStatus === 'valid'
                    ? 'Your company is verified! Any purchased postings will be published immediately to candidates.'
                    : 'Your company verification is pending review. You can purchase a plan now; job postings activate upon admin approval.'}
                </p>
              </div>
            </div>

            <Link to="/recruiter/billing">
              <Button variant="secondary" size="sm" icon={Briefcase}>
                Manage Billing &amp; Invoices
              </Button>
            </Link>
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {displayPlans.map((plan) => {
            const isPopular = plan.slug === 'professional' || plan.name.toLowerCase().includes('prof');
            const isCurrent = currentSub?.planId?._id === plan._id || currentSub?.planId?.slug === plan.slug;

            const displayPrice = billingCycle === 'yearly' && plan.billingType !== 'per_job'
              ? Math.round(plan.price * 12 * 0.8)
              : plan.price;

            const displayPeriod = plan.billingType === 'per_job'
              ? '/ job posting'
              : billingCycle === 'yearly'
              ? '/ year (20% off)'
              : '/ 30 days';

            return (
              <div
                key={plan._id}
                className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 ${
                  isPopular
                    ? 'bg-[#202124] text-[#FAF9F6] border-2 border-[#C6A15B] shadow-2xl md:-translate-y-2'
                    : 'bg-[#FFFFFF] text-[#202124] border border-[#E9E6DF] shadow-card'
                }`}
              >
                {/* Popular Pill */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#C6A15B] text-[#202124] border border-[#A98443] text-[10px] font-extrabold uppercase tracking-widest shadow-gold">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`text-2xl font-black ${isPopular ? 'text-[#FAF9F6]' : 'text-[#202124]'}`}>
                        {plan.name}
                      </h3>
                      <p className={`text-xs mt-1 min-h-[32px] ${isPopular ? 'text-[#E9E6DF]/70' : 'text-[#666666]'}`}>
                        {plan.description}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className={`mt-6 mb-6 pb-6 flex items-baseline gap-1.5 flex-wrap border-b ${
                    isPopular ? 'border-[#343538]' : 'border-[#E9E6DF]'
                  }`}>
                    <span className={`text-4xl sm:text-5xl font-black ${isPopular ? 'text-[#C6A15B]' : 'text-[#202124]'}`}>
                      ₹{displayPrice.toLocaleString('en-IN')}
                    </span>
                    <span className={`text-xs ${isPopular ? 'text-[#E9E6DF]/70' : 'text-[#666666]'}`}>
                      {displayPeriod}
                    </span>
                  </div>

                  {/* Quota Highlights */}
                  <div className={`space-y-2 mb-6 p-3 rounded-xl text-xs border ${
                    isPopular
                      ? 'bg-[#343538] border-[#343538]'
                      : 'bg-[#FAF9F6] border-[#E9E6DF]'
                  }`}>
                    <div className="flex justify-between">
                      <span className={isPopular ? 'text-[#E9E6DF]/70' : 'text-[#666666]'}>Job Limit:</span>
                      <strong className={`font-bold ${isPopular ? 'text-[#FAF9F6]' : 'text-[#202124]'}`}>
                        {plan.jobPostingLimit} Job Postings
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className={isPopular ? 'text-[#E9E6DF]/70' : 'text-[#666666]'}>Duration:</span>
                      <strong className={`font-bold ${isPopular ? 'text-[#FAF9F6]' : 'text-[#202124]'}`}>
                        {billingCycle === 'yearly' && plan.billingType !== 'per_job' ? '365 Days' : `${plan.durationDays || 30} Days`}
                      </strong>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                    <p className={`text-xs uppercase font-bold tracking-wider ${
                      isPopular ? 'text-[#C6A15B]' : 'text-[#666666]'
                    }`}>
                      Features Included:
                    </p>
                    <ul className="space-y-2.5">
                      {plan.features?.map((feat, idx) => (
                        <li key={idx} className={`flex items-start gap-2.5 text-xs ${
                          isPopular ? 'text-[#E9E6DF]' : 'text-[#202124]'
                        }`}>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isPopular
                              ? 'bg-[#C6A15B] text-[#202124]'
                              : 'bg-[#FAF9F6] border border-[#E9E6DF] text-[#C6A15B]'
                          }`}>
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="mt-8 pt-4">
                  {isCurrent ? (
                    <div className={`w-full py-3 rounded-xl text-center font-bold text-xs flex items-center justify-center gap-1.5 border ${
                      isPopular
                        ? 'bg-[#343538] text-[#FAF9F6] border-[#343538]'
                        : 'bg-[#FAF9F6] text-[#202124] border-[#E9E6DF]'
                    }`}>
                      <Check className="w-4 h-4 text-[#C6A15B]" />
                      <span>Active Current Plan</span>
                    </div>
                  ) : isPopular ? (
                    <button
                      onClick={() => handleSelectPlan(plan)}
                      className="w-full py-3.5 text-xs font-bold bg-[#C6A15B] hover:bg-[#A98443] text-[#202124] rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-gold"
                    >
                      <span>Choose {plan.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => handleSelectPlan(plan)}
                      className="w-full py-3.5 text-xs font-bold flex items-center justify-center gap-2"
                    >
                      <span>Choose {plan.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="rounded-3xl bg-[#FFFFFF] border border-[#E9E6DF] p-6 sm:p-8 shadow-card space-y-6">
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-[#202124]">Feature Comparison</h3>
            <p className="text-xs text-[#666666]">Detailed breakdown of capabilities across all recruiter tiers.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#202124]">
              <thead>
                <tr className="border-b border-[#E9E6DF] text-[#666666] uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-4">Plan Feature</th>
                  <th className="py-3 px-4">Starter (₹499)</th>
                  <th className="py-3 px-4 font-bold text-[#C6A15B]">Professional (₹1,499)</th>
                  <th className="py-3 px-4 font-bold text-[#202124]">Enterprise (₹3,999)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E6DF]">
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#202124]">Active Job Limit</td>
                  <td className="py-3 px-4">1 Job</td>
                  <td className="py-3 px-4 font-bold text-[#202124]">5 Jobs</td>
                  <td className="py-3 px-4 font-bold text-[#202124]">20 Jobs</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#202124]">Listing Duration</td>
                  <td className="py-3 px-4">30 Days</td>
                  <td className="py-3 px-4">30 / 365 Days</td>
                  <td className="py-3 px-4">30 / 365 Days</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#202124]">Applicant Tracking &amp; Management</td>
                  <td className="py-3 px-4">Basic</td>
                  <td className="py-3 px-4">Standard Pipeline</td>
                  <td className="py-3 px-4 font-bold text-[#202124]">Advanced Pipeline</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#202124]">Featured Listing Badge</td>
                  <td className="py-3 px-4 text-[#666666]">—</td>
                  <td className="py-3 px-4 text-[#C6A15B] font-bold">✓ Included</td>
                  <td className="py-3 px-4 text-[#C6A15B] font-bold">✓ Priority Highlight</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#202124]">Recruiter Analytics</td>
                  <td className="py-3 px-4 text-[#666666]">—</td>
                  <td className="py-3 px-4 text-[#202124] font-semibold">✓ Included</td>
                  <td className="py-3 px-4 text-[#202124] font-bold">✓ Advanced Analytics</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#202124]">Multiple Recruiter Seats</td>
                  <td className="py-3 px-4 text-[#666666]">—</td>
                  <td className="py-3 px-4 text-[#666666]">—</td>
                  <td className="py-3 px-4 text-[#202124] font-bold">✓ Included</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto space-y-6">
          <h3 className="text-2xl font-bold text-center text-[#202124]">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card">
              <h4 className="text-sm font-bold text-[#202124] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#C6A15B]" />
                How does company verification affect my plan?
              </h4>
              <p className="text-xs text-[#666666] mt-2 leading-relaxed">
                Payment and company verification remain separate. You can purchase a plan immediately. However, to maintain high platform trust, jobs are publicly visible only after our admin team approves your company profile.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card">
              <h4 className="text-sm font-bold text-[#202124] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#C6A15B]" />
                What payment methods are supported?
              </h4>
              <p className="text-xs text-[#666666] mt-2 leading-relaxed">
                We use Razorpay to accept all major Indian payment methods, including UPI (Google Pay, PhonePe, Paytm), Debit and Credit Cards, NetBanking across 50+ banks, and Wallets.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card">
              <h4 className="text-sm font-bold text-[#202124] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#C6A15B]" />
                Can I upgrade my plan later?
              </h4>
              <p className="text-xs text-[#666666] mt-2 leading-relaxed">
                Yes! When your company hires more candidates, you can upgrade to Professional or Enterprise anytime. The new entitlements activate immediately.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-card">
              <h4 className="text-sm font-bold text-[#202124] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#C6A15B]" />
                Are candidate applications really free?
              </h4>
              <p className="text-xs text-[#666666] mt-2 leading-relaxed">
                Yes, 100% free forever. We never charge candidates for registering, searching for jobs, submitting applications, or taking part in interviews.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Checkout Modal */}
      <RazorpayCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        plan={selectedPlan}
        onSuccess={handlePaymentSuccess}
        onError={(err) => setToast({ message: err, type: 'error' })}
      />
    </div>
  );
};

export default Pricing;

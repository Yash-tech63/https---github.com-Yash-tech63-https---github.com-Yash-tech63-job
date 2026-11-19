import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroSection } from '../components/landing/HeroSection';
import { JobSearchSection } from '../components/landing/JobSearchSection';
import { FeaturedJobs } from '../components/landing/FeaturedJobs';
import { HowItWorks } from '../components/landing/HowItWorks';
import { FeatureCards } from '../components/landing/FeatureCards';
import { TrustMetrics } from '../components/landing/TrustMetrics';
import { RecruiterCTA } from '../components/landing/RecruiterCTA';

gsap.registerPlugin(ScrollTrigger);

export const LandingPage = () => {
  useEffect(() => {
    // Window scroll to top upon mounting
    window.scrollTo(0, 0);

    // Global ScrollTrigger refresh after initial component mounts
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="bg-[#FAF9F6] text-[#202124] overflow-x-hidden min-h-screen">
      {/* 1. Full-Screen 3D Hero Section */}
      <HeroSection />

      {/* 2. Interactive Job Search Bar */}
      <JobSearchSection />

      {/* 3. Opportunities Worth Exploring (Real Live Positions) */}
      <FeaturedJobs />

      {/* 4. How TrueHire Works (Dual Candidate & Recruiter Stepper) */}
      <HowItWorks />

      {/* 5. 8 Comprehensive Platform Capabilities */}
      <FeatureCards />

      {/* 6. Verifiable Trust & Accountability Metrics */}
      <TrustMetrics />

      {/* 7. High-Contrast Recruiter Call to Action */}
      <RecruiterCTA />
    </div>
  );
};

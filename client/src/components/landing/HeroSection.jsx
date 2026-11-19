import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Building2 } from 'lucide-react';
import { Hero3DScene } from './Hero3DScene';

export const HeroSection = () => {
  const heroRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const badgesRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Word-by-word reveal for the headline
      const words = headingRef.current?.querySelectorAll('.hero-word');
      if (words && words.length > 0) {
        gsap.fromTo(
          words,
          {
            y: 45,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
            delay: 0.2,
          }
        );
      }

      // Smooth fade-in for subtitle, CTA, and trust indicators
      gsap.fromTo(
        subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.6 }
      );

      gsap.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.8 }
      );

      gsap.fromTo(
        badgesRef.current,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 1.0 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const headlineWords = ['Your', 'Career.', 'Your', 'Next', 'Move.'];

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[90vh] flex items-center bg-[#FAF9F6] border-b border-[#E9E6DF] overflow-hidden"
    >
      {/* Background subtle texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            'radial-gradient(#202124 1px, transparent 1px), radial-gradient(#202124 1px, #FAF9F6 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Typography & Actions */}
          <div className="lg:col-span-7 space-y-8">
            {/* Category / Scope Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E9E6DF] text-xs font-semibold tracking-wider uppercase text-[#202124] shadow-subtle">
              <span className="w-2 h-2 rounded-full bg-[#C6A15B] animate-pulse" />
              <span>THE FUTURE OF OPPORTUNITY</span>
            </div>

            {/* Main Headline with word-by-word reveal */}
            <h1
              ref={headingRef}
              className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-[#202124] leading-[1.08]"
            >
              {headlineWords.map((word, i) => (
                <span
                  key={i}
                  className="inline-block overflow-hidden mr-3 sm:mr-4 last:mr-0"
                >
                  <span className="hero-word inline-block">{word}</span>
                </span>
              ))}
            </h1>

            {/* Subtitle / Tagline */}
            <div ref={subtitleRef} className="space-y-2">
              <p className="text-lg sm:text-xl font-semibold text-[#343538]">
                Discover Jobs. Build Skills. Get Hired.
              </p>
              <p className="text-sm sm:text-base text-[#666666] max-w-xl leading-relaxed">
                A trustworthy recruitment marketplace connecting early-career talent and exceptional professionals with verified employers. Pure signal, zero ghosting, transparent hiring.
              </p>
            </div>

            {/* Action Buttons (Framer Motion Micro-interactions) */}
            <div
              ref={ctaRef}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <Link to="/jobs">
                <motion.button
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#C6A15B] hover:bg-[#A98443] text-[#202124] font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-gold"
                >
                  <span>Explore Jobs</span>
                  <ArrowRight className="w-4 h-4 text-[#202124]" />
                </motion.button>
              </Link>

              <Link to="/register/recruiter">
                <motion.button
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#FFFFFF] text-[#202124] font-semibold text-sm border border-[#E9E6DF] hover:border-[#C6A15B] hover:bg-[#FAF9F6] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-subtle"
                >
                  <Building2 className="w-4 h-4 text-[#C6A15B]" />
                  <span>Hire Talent</span>
                </motion.button>
              </Link>
            </div>

            {/* Trust Badges Bar */}
            <div
              ref={badgesRef}
              className="pt-6 border-t border-[#E9E6DF] flex flex-wrap items-center gap-6 text-xs text-[#202124]"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C6A15B]" />
                <span className="font-bold text-[#202124]">100%</span>
                <span className="text-[#666666]">Verified Employers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C6A15B]" />
                <span className="font-bold text-[#202124]">₹0</span>
                <span className="text-[#666666]">Candidate Cost</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C6A15B]" />
                <span className="font-bold text-[#202124]">Direct</span>
                <span className="text-[#666666]">Application Review</span>
              </div>
            </div>
          </div>

          {/* Right Column: Three.js 3D Visual Experience */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="w-full aspect-square max-w-[500px] lg:max-w-none relative flex items-center justify-center">
              {/* Subtle ambient circle boundary */}
              <div className="absolute inset-4 sm:inset-8 rounded-full border border-dashed border-[#E9E6DF] pointer-events-none" />
              <Hero3DScene />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

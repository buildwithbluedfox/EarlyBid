"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import AuroraBackground from '@/components/AuroraBackground';

let audioCtx: AudioContext | null = null;
let audioUnlocked = false;

const initAudio = () => {
  if (typeof window === 'undefined' || audioUnlocked) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    if (!audioCtx) audioCtx = new AudioContextClass();
    
    // Play a completely silent oscillator to "unlock" the context in Safari
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.01);
    
    audioUnlocked = true;
    window.removeEventListener('pointerdown', initAudio);
    window.removeEventListener('keydown', initAudio);
  } catch (e) {}
};

if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', initAudio);
  window.addEventListener('keydown', initAudio);
}

const playKnock = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    if (!audioCtx) audioCtx = new AudioContextClass();
    
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, t + 0.01);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.06);
    
    gain.gain.setValueAtTime(0.3, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    
    osc.start(t + 0.01);
    osc.stop(t + 0.06);
  } catch (e) {
    // Ignore autoplay restrictions
  }
};

const DesktopNavLinks = () => {
  const [hoverStyle, setHoverStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>, tab: string) => {
    if (hoveredTab === tab) return;
    
    const el = e.currentTarget;
    setHoverStyle({
      left: el.offsetLeft,
      width: el.offsetWidth,
      opacity: 1
    });
    setHoveredTab(tab);
    playKnock();
  };

  const handleMouseLeave = () => {
    setHoverStyle((prev) => ({ ...prev, opacity: 0 }));
    setHoveredTab(null);
  };

  return (
    <div 
      className="relative flex items-center gap-2 px-2 py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/40 shadow-sm text-sm font-semibold text-slate-700"
      onMouseLeave={handleMouseLeave}
    >
      {/* Sliding Pill Background */}
      <div 
        className="absolute top-2 bottom-2 rounded-full bg-[#1B67B3] transition-all duration-300 ease-out z-0"
        style={{
          left: hoverStyle.left,
          width: hoverStyle.width,
          opacity: hoverStyle.opacity,
        }}
      />
      <a 
        href="#features" 
        onMouseEnter={(e) => handleMouseEnter(e, 'features')} 
        className={`px-4 py-2 rounded-full transition-colors duration-300 relative z-10 ${hoveredTab === 'features' ? 'text-white' : ''}`}
      >
        Features
      </a>
      <a 
        href="#templates" 
        onMouseEnter={(e) => handleMouseEnter(e, 'templates')} 
        className={`px-4 py-2 rounded-full transition-colors duration-300 relative z-10 ${hoveredTab === 'templates' ? 'text-white' : ''}`}
      >
        Templates
      </a>
      <a
        href="#docs"
        onMouseEnter={(e) => handleMouseEnter(e, 'docs')}
        className={`px-4 py-2 rounded-full transition-colors duration-300 relative z-10 ${hoveredTab === 'docs' ? 'text-white' : ''}`}
      >
        Docs
      </a>
    </div>
  );
};

export default function LandingPage() {
  const router = useRouter();
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isEntering, setIsEntering] = useState(true);

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => {
      router.push(path);
    }, 500);
  };

  useEffect(() => {
    // Small delay ensures the component renders the overlay first, then fades it out
    const timer = setTimeout(() => setIsEntering(false), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!headlineRef.current) return;
    
    const tl = gsap.timeline({ repeat: -1 });
    
    // Step 1: EarlyBid
    tl.fromTo('.step-1', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
      .to('.step-1', { opacity: 0, y: -20, duration: 0.6, ease: 'power2.in', delay: 1.0 });
      
    // Step 2: A billing for fast movers.
    tl.fromTo('.step-2', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
      .to('.step-2', { opacity: 0, y: -20, duration: 0.6, ease: 'power2.in', delay: 1.2 });
      
    // Step 3: Simple. Fast & Reliable.
    const words = headlineRef.current.querySelectorAll('.word');
    tl.set('.step-3', { opacity: 1, y: 0 }); // Reveal container
    tl.fromTo(words, { opacity: 0, y: 20 }, {
      opacity: 1,
      y: 0,
      duration: 1.0,
      stagger: 0.25,
      ease: 'power3.out'
    })
    .to('.step-3', { opacity: 0, y: -20, duration: 0.6, ease: 'power2.in', delay: 2.0 });

  }, []);

  return (
    <div className="min-h-screen bg-[#F4F0EA] text-slate-900 selection:bg-[#1B67B3]/10 selection:text-[#003973] font-sans overflow-hidden flex flex-col relative">
      {/* Liquid Aurora Background Component (Light Theme) */}
      <AuroraBackground />

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 pt-10 pb-4 lg:px-12 w-full max-w-7xl mx-auto">
        <div className="flex items-center">
          <Image
            src="/earlybid.svg"
            alt="EarlyBid Logo"
            width={60}
            height={44}
            className="object-contain hover:opacity-90 transition-opacity cursor-pointer" 
            priority
          />
        </div>

        {/* Navigation Links - Centered Pill */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex mt-3">
          <DesktopNavLinks />
        </div>

        <div className="flex items-center gap-5 z-10">
          <Link href="/login" onClick={(e) => handleNavigation(e, '/login')} className="hidden md:flex items-center justify-center px-5 py-2.5 bg-[#003973] text-white rounded-full text-sm font-semibold hover:bg-[#002b5c] transition-all shadow-sm hover:shadow-md">
            Get Started
          </Link>
          
          {/* Mobile Stairs Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col items-end justify-center gap-1.5 w-8 h-8 z-50 focus:outline-none"
          >
            <span className={`w-5 h-[3px] bg-[#003973] rounded-full transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-[9px]' : ''}`}></span>
            <span className={`w-5 h-[3px] bg-[#003973] rounded-full transition-opacity ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`w-5 h-[3px] bg-[#003973] rounded-full transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-[9px]' : '-translate-x-1.5'}`}></span>
          </button>
        </div>

        {/* Mobile Dropdown Menu is now moved outside nav to be a fixed full-screen overlay */}
      </nav>

      {/* Full Screen Mobile Menu Overlay */}
      <div className={`fixed inset-0 h-[100dvh] bg-[#F4F0EA] flex flex-col md:hidden z-[100] transition-transform duration-500 ease-out px-6 pt-10 pb-8 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header inside menu */}
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <Image
            src="/earlybid.svg"
            alt="EarlyBid Logo"
            width={60}
            height={44}
            className="object-contain" 
            priority
          />
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex flex-col gap-1.5 p-2 items-center justify-center w-10 h-10"
          >
            <span className="w-6 h-[3px] bg-[#003973] rounded-full rotate-45 translate-y-[4.5px]"></span>
            <span className="w-6 h-[3px] bg-[#003973] rounded-full -rotate-45 -translate-y-[4.5px]"></span>
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-col items-center gap-8 mt-24">
          <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className={`text-2xl font-semibold text-[#003973] hover:text-[#1B67B3] transition-all duration-500 ease-out delay-[150ms] ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>Features</a>
          <a href="#templates" onClick={() => setIsMobileMenuOpen(false)} className={`text-2xl font-semibold text-[#003973] hover:text-[#1B67B3] transition-all duration-500 ease-out delay-[250ms] ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>Templates</a>
          <a href="#docs" onClick={() => setIsMobileMenuOpen(false)} className={`text-2xl font-semibold text-[#003973] hover:text-[#1B67B3] transition-all duration-500 ease-out delay-[350ms] ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>Docs</a>
        </div>

        {/* Bottom Button */}
        <div className={`mt-auto w-full flex justify-center transition-all duration-500 ease-out delay-[450ms] ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link href="/login" onClick={(e) => { setIsMobileMenuOpen(false); handleNavigation(e, '/login'); }} className="w-[90%] max-w-[300px] flex items-center justify-center px-8 py-4 bg-[#003973] text-white rounded-full text-lg font-semibold hover:bg-[#002b5c] shadow-md">
            Get Started
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 w-full">
        
        {/* Animated Headline Sequence */}
        <div ref={headlineRef} className="relative h-32 sm:h-48 w-full flex items-center justify-center mb-8 max-w-5xl mx-auto">
          
          {/* Step 1 */}
          <h1 className="step-1 absolute text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#003973] opacity-0 w-full text-center">
            Early<span className="text-[#1B67B3]">Bid</span>
          </h1>
          
          {/* Step 2 */}
          <h1 className="step-2 absolute text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#003973] opacity-0 w-full text-center">
            A billing for <span className="text-[#1B67B3]">fast movers</span>
          </h1>

          {/* Step 3 */}
          <h1 className="step-3 absolute opacity-0 text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#003973] w-full text-center">
            <div className="flex flex-wrap justify-center gap-x-3 sm:gap-x-5 w-full">
              <span className="word opacity-0 inline-block">Simple,</span>
              <span className="word opacity-0 inline-block">Fast</span>
              <span className="word opacity-0 inline-block text-[#1B67B3]">& Reliable.</span>
            </div>
          </h1>

        </div>

        

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-6 w-full sm:w-auto mt-4">
          <div className="text-xs uppercase tracking-[0.3em] text-[#003973] font-bold opacity-80 animate-pulse">
            Free Forever
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 w-full px-4 sm:px-0">
            <Link href="/login" onClick={(e) => handleNavigation(e, '/login')} className="w-full sm:w-auto px-8 py-4 bg-[#003973] text-white rounded-full font-semibold text-base hover:bg-[#002b5c] transition-all shadow-[0_8px_30px_rgb(0,57,115,0.2)] hover:shadow-[0_8px_30px_rgb(0,57,115,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center justify-center gap-2">
              Start Drafting
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-10 px-6 lg:px-12 w-full max-w-7xl mx-auto border-t border-slate-200/50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          {/* Left Side */}
          <div className="flex items-center gap-1">
            <span>© 2026 EarlyBid. Built with </span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-500 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span> under MIT License.</span>
          </div>

          {/* Right Side Group */}
          <div className="flex items-center gap-8">
            {/* Links */}
            <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-wider">
              <a href="#privacy" className="hover:text-[#003973] transition-colors">Privacy</a>
              <span className="text-slate-300">|</span>
              <a href="#docs" className="hover:text-[#003973] transition-colors">License</a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-5">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#003973] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.18-.38 6.52-1.6 6.52-7.01a5.1 5.1 0 0 0-1.4-3.5 4.8 4.8 0 0 0 .1-3.4s-1.1-.4-3.5 1.2a12.1 12.1 0 0 0-6.4 0c-2.4-1.6-3.5-1.2-3.5-1.2a4.8 4.8 0 0 0 .1 3.4 5.1 5.1 0 0 0-1.4 3.5c0 5.41 3.34 6.63 6.52 7.01a4.8 4.8 0 0 0-1 3.03V22"/><path d="M9 20c-5 1.5-5-2.5-7-3"/></svg>
              </a>
              <a href="https://patreon.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#003973] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M15.484 2A6.516 6.516 0 1 1 8.968 8.516a6.516 6.516 0 0 1 6.516-6.516zm-13.484 0v20h4.194v-20z"/></svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#003973] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Page Transition Overlay */}
      <div 
        className={`fixed inset-0 bg-white z-[9999] transition-opacity duration-500 ease-in-out pointer-events-none ${
          isEntering || isNavigating ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

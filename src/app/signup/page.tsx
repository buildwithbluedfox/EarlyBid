"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [step, setStep] = useState<'name' | 'email' | 'otp'>('name');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isEntering, setIsEntering] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const nameInputRef = useRef<HTMLTextAreaElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Small delay ensures the component renders the overlay first, then fades it out
    const timer = setTimeout(() => {
      setIsEntering(false);
      nameInputRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (step === 'email') {
      setTimeout(() => emailInputRef.current?.focus(), 100);
    } else if (step === 'otp') {
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    setIsExiting(true);
    setTimeout(() => {
      router.push(path);
    }, 500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'name') {
      if (name.trim() !== '') setStep('email');
    } else if (step === 'email') {
      if (email.trim() !== '') setStep('otp');
    } else if (step === 'otp') {
      if (otp.trim() !== '') {
        // In a real app, verify OTP and signup
        alert(`Signing up with Name: ${name}, Email: ${email} and OTP: ${otp}`);
      }
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    let newOtpArray = otp.padEnd(6, ' ').split('');
    newOtpArray[index] = value.slice(-1) || ' ';
    const newOtp = newOtpArray.join('').trimEnd();
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      setOtp(pastedData);
      const focusIndex = Math.min(pastedData.length, 5);
      otpRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <>
      <div className="h-screen w-full flex flex-col md:flex-row font-sans overflow-hidden relative bg-white">
      
      {/* Left Side - Signup Form (White Background) */}
      <div className="w-full md:w-1/2 flex-1 h-full p-8 sm:p-16 flex flex-col justify-center bg-white relative overflow-y-auto z-10 shadow-[20px_0_60px_-15px_rgba(0,0,0,0.5)]">
        
        {/* Close Button */}
        <Link href="/" onClick={(e) => handleNavigation(e, '/')} className="absolute top-6 md:top-10 lg:top-[72px] left-6 md:left-12 lg:left-20 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 z-50 opacity-0 animate-fade-in-up animation-delay-300" aria-label="Go back to home">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>

        <div className="relative z-10 max-w-md mx-auto w-full">
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              
              {/* Step 1: Name */}
              {step === 'name' && (
                <div className="flex flex-col items-start w-full opacity-0 animate-fade-in-up animation-delay-300">
                  <h2 className="text-4xl md:text-5xl font-medium text-[#1B67B3] mb-2">Hello,</h2>
                  <textarea
                    ref={nameInputRef}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    maxLength={32}
                    rows={1}
                    className="w-full text-5xl md:text-6xl lg:text-7xl font-bold focus:outline-none placeholder:text-slate-200 bg-transparent py-2 text-[#003973] resize-none overflow-hidden break-words"
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = target.scrollHeight + 'px';
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!name.trim()}
                    className={`mt-12 py-4 px-8 rounded-full font-semibold transition-all ${name.trim() ? 'bg-[#003973] text-white hover:bg-[#002b5c] hover:-translate-y-0.5 shadow-lg' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                  >
                    Continue
                  </button>
                </div>
              )}

              {/* Step 2 & 3: Email & OTP */}
              {step !== 'name' && (
                <div className="opacity-0 animate-fade-in-up">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create an account</h2>
                    <button 
                      type="button" 
                      onClick={() => setStep('name')}
                      className="text-sm text-[#003973] hover:text-[#1B67B3] font-medium transition-colors"
                    >
                      Not {name}?
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    {/* Email Field */}
                    <div className="relative">
                      <input
                        ref={emailInputRef}
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={step === 'otp'}
                        placeholder=" "
                        className="peer w-full px-4 pt-6 pb-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003973]/20 focus:border-[#003973] transition-all bg-white text-slate-900 disabled:bg-slate-50 disabled:text-slate-500"
                        required
                      />
                      <label 
                        htmlFor="email" 
                        className="absolute left-4 top-2 translate-y-0 text-xs font-semibold text-slate-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-[#003973] peer-focus:font-semibold pointer-events-none"
                      >
                        Your email
                      </label>
                    </div>

                    {/* OTP Field */}
                    <div 
                      className={`grid transition-all duration-500 ease-in-out ${
                        step === 'otp' 
                          ? 'grid-rows-[1fr] opacity-100 mt-1 pointer-events-auto' 
                          : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
                      }`}
                    >
                      <div className="overflow-hidden flex flex-col justify-end">
                        <div className="pt-2">
                          <div className="flex items-center justify-between mb-4">
                            <label htmlFor="otp-0" className="block text-sm font-semibold text-slate-700">
                              One-Time Password (OTP)
                            </label>
                            <button 
                              type="button" 
                              onClick={() => {
                                setStep('email');
                                setOtp('');
                              }}
                              className="text-xs text-[#003973] hover:text-[#1B67B3] font-medium transition-colors"
                            >
                              Edit email
                            </button>
                          </div>
                          <div className="flex justify-between gap-2 sm:gap-3">
                            {[0, 1, 2, 3, 4, 5].map((index) => (
                              <input
                                key={index}
                                id={`otp-${index}`}
                                ref={(el) => { otpRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={otp[index] && otp[index] !== ' ' ? otp[index] : ''}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                onPaste={handleOtpPaste}
                                className="w-[14%] aspect-[4/5] sm:aspect-square max-w-[3.5rem] text-center text-xl sm:text-2xl font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003973]/20 focus:border-[#003973] transition-all bg-white text-slate-900 shadow-sm"
                                required={step === 'otp'}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-slate-500 mt-4 text-center">
                            Didn't receive a code? <button type="button" className="text-[#003973] font-semibold hover:underline">Click to resend</button>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      type="submit"
                      className="w-full mt-2 py-3.5 px-4 bg-[#003973] hover:bg-[#002b5c] text-white rounded-xl font-semibold shadow-[0_8px_30px_rgb(0,57,115,0.2)] hover:shadow-[0_8px_30px_rgb(0,57,115,0.3)] hover:-translate-y-0.5 transition-all active:translate-y-0"
                    >
                      {step === 'email' ? 'Get OTP' : 'Verify & Sign up'}
                    </button>
                  </div>
                </div>
              )}
            </form>

            <p className="mt-12 text-center text-sm text-slate-500 opacity-0 animate-fade-in-up animation-delay-700">
              Already have an account? <Link href="/login" onClick={(e) => handleNavigation(e, '/login')} className="text-[#003973] font-semibold hover:underline">Login</Link>
            </p>
          </div>
        </div>

      {/* Custom Styles for Portal Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fly-out {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate(50vw, var(--y-drift)) scale(1.5); opacity: 0; }
        }
      `}} />

      {/* Right Side - The Portal */}
      <div className="hidden md:block w-1/2 h-full bg-[#030303] relative overflow-hidden z-0 flex items-center">
        
        {/* Film Grain / Noise Texture Overlay for that matte cinematic finish */}
        <div 
          className="absolute inset-0 pointer-events-none z-20 opacity-[0.04]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        ></div>

        {/* Light Beam Effect simulating a volumetric portal projection */}
        <div className="absolute left-0 w-[150%] h-full pointer-events-none z-0 flex items-center">
          
          {/* Base ambient glow */}
          <div className="absolute left-0 w-full h-[80%] bg-gradient-to-r from-[#003973] to-transparent opacity-40 blur-[100px]"></div>

          {/* The Main Projection Cone (Wider & Sharper) */}
          <div className="absolute left-[-20px] w-full h-[140%] flex items-center filter blur-[40px] opacity-80">
            <div 
              className="w-full h-full bg-gradient-to-r from-[#1B67B3] via-[#003973] to-transparent"
              style={{ clipPath: 'polygon(0 35%, 100% -10%, 100% 110%, 0 65%)' }}
            ></div>
          </div>
          
          {/* The Intense Inner Core Cone (Wider & Sharper) */}
          <div className="absolute left-[-10px] w-[90%] h-[120%] flex items-center filter blur-[20px] opacity-90">
            <div 
              className="w-full h-full bg-gradient-to-r from-[#4ba1fa] via-[#1B67B3] to-transparent"
              style={{ clipPath: 'polygon(0 42%, 100% 10%, 100% 90%, 0 58%)' }}
            ></div>
          </div>

          {/* The Blinding Light Source (Sharp vertical line) */}
          <div className="absolute left-0 h-[30%] w-[3px] bg-white shadow-[0_0_30px_10px_#4ba1fa] mix-blend-screen"></div>

        </div>

        {/* Flying Stars */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(15)].map((_, i) => {
            const top = 35 + Math.random() * 30; // Randomly distributed around the center slit (35% to 65%)
            const size = 3 + Math.random() * 5; // 3px to 8px for smaller, subtle stars
            const delay = Math.random() * 30; // 0s to 30s delay to spread them out thinly
            const duration = 20 + Math.random() * 20; // 20s to 40s travel time
            const yDrift = (Math.random() - 0.5) * 60; // fly upwards or downwards up to 30vh
            
            return (
              <div
                key={i}
                className="absolute left-0 text-white mix-blend-screen flex items-center justify-center opacity-40"
                style={{
                  top: `${top}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animation: `fly-out ${duration}s linear ${delay}s infinite`,
                  '--y-drift': `${yDrift}vh`
                } as React.CSSProperties}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
                </svg>
              </div>
            );
          })}
        </div>
      </div>
      
      </div>

      {/* Page Transition Overlay */}
      <div 
        className={`fixed inset-0 bg-white z-[9999] transition-opacity duration-500 ease-in-out pointer-events-none ${
          isEntering || isExiting ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </>
  );
}

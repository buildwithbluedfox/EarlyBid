"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isEntering, setIsEntering] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Small delay ensures the component renders the overlay first, then fades it out
    const timer = setTimeout(() => setIsEntering(false), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    setIsExiting(true);
    setTimeout(() => {
      router.push(path);
    }, 500);
  };

  const handleGetOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() !== '') {
      // In a real app, you would trigger the OTP API here
      setStep('otp');
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim() !== '') {
      // In a real app, verify OTP and login
      alert(`Logging in with ${email} and OTP: ${otp}`);
    }
  };

  return (
    <>
      <div className="h-screen w-full flex flex-col md:flex-row font-sans overflow-hidden relative bg-[#003973]">
      
      {/* Full Screen Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#1B67B3] to-[#003973] z-0">
        <div className="absolute top-0 left-0 w-full md:w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4">
          <div className="w-full h-full bg-white mix-blend-overlay filter blur-[120px] opacity-30 rounded-full animate-gas"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-full md:w-[150%] h-full translate-x-1/4 translate-y-1/4">
          <div className="w-full h-full bg-[#1B67B3] mix-blend-multiply filter blur-[100px] opacity-70 rounded-full animate-gas-slow"></div>
        </div>
      </div>

      {/* Left Side Content */}
      <div className="relative z-10 w-full md:w-1/2 h-[40vh] md:h-full p-8 md:p-12 lg:p-20 flex flex-col justify-between">

        <div className="relative z-10">
          <Link href="/" className="inline-block">
            <Image
              src="/earlybid.svg"
              alt="EarlyBid Logo"
              width={80}
              height={58}
              className="w-14 md:w-20 h-auto object-contain hover:opacity-90 transition-opacity" 
              priority
            />
          </Link>
        </div>

        <div className="relative z-10">
          <p className="text-white/90 font-medium mb-3 text-sm tracking-wider uppercase opacity-0 animate-fade-in-up">Welcome back</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight drop-shadow-sm flex flex-col gap-1 mt-1">
            <span className="hidden md:flex flex-col">
              <span className="block opacity-0 animate-fade-in-up animation-delay-300">Step back into</span>
              <span className="block opacity-0 animate-fade-in-up animation-delay-500">your workspace</span>
              <span className="block opacity-0 animate-fade-in-up animation-delay-700">and keep the momentum going.</span>
            </span>
            <span className="md:hidden flex flex-col">
              <span className="block opacity-0 animate-fade-in-up animation-delay-300">Your workspace</span>
              <span className="block opacity-0 animate-fade-in-up animation-delay-500">awaits.</span>
            </span>
          </h1>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex-1 md:h-full p-8 sm:p-16 flex flex-col justify-center bg-white relative overflow-y-auto z-10 rounded-t-[3rem] md:rounded-none md:rounded-l-[4rem] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.1)] md:shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.1)]">
        
        {/* Close Button */}
        <Link href="/" onClick={(e) => handleNavigation(e, '/')} className="absolute top-6 md:top-10 lg:top-[72px] right-6 md:right-12 lg:right-20 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 z-50 opacity-0 animate-fade-in-up animation-delay-300" aria-label="Go back to home">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>

        <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight opacity-0 animate-fade-in-up animation-delay-300">Login to your account</h2>

            <form onSubmit={step === 'email' ? handleGetOtp : handleLogin} className="flex flex-col opacity-0 animate-fade-in-up animation-delay-500">
              
              {/* Email Field (Floating Label) */}
              <div className="relative mt-2">
                <input
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

              {/* OTP Field (Smoothly Animated) */}
              <div 
                className={`grid transition-all duration-500 ease-in-out ${
                  step === 'otp' 
                    ? 'grid-rows-[1fr] opacity-100 mt-5 pointer-events-auto' 
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
                        Change email
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
                className="w-full mt-6 py-3.5 px-4 bg-[#003973] hover:bg-[#002b5c] text-white rounded-xl font-semibold shadow-[0_8px_30px_rgb(0,57,115,0.2)] hover:shadow-[0_8px_30px_rgb(0,57,115,0.3)] hover:-translate-y-0.5 transition-all active:translate-y-0"
              >
                {step === 'email' ? 'Get OTP' : 'Verify & Login'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500 opacity-0 animate-fade-in-up animation-delay-700">
              Don&apos;t have an account? <Link href="/signup" onClick={(e) => handleNavigation(e, '/signup')} className="text-[#003973] font-semibold hover:underline">Sign up</Link>
            </p>
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

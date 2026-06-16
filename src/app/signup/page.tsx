"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Loader from '../../components/Loader';

export default function SignupPage() {
  const [step, setStep] = useState<'name' | 'email' | 'otp'>('name');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isEntering, setIsEntering] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const proceedWithLoading = (nextAction: () => void) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      nextAction();
    }, 1000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'name') {
      if (name.trim() !== '') proceedWithLoading(() => setStep('email'));
    } else if (step === 'email') {
      if (email.trim() !== '') proceedWithLoading(() => setStep('otp'));
    } else if (step === 'otp') {
      if (otp.trim() !== '') {
        // In a real app, verify OTP and signup
        proceedWithLoading(() => alert(`Signing up with Name: ${name}, Email: ${email} and OTP: ${otp}`));
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
      <Loader isVisible={isLoading} />
      <div className="h-screen w-full flex flex-col-reverse md:flex-row font-sans overflow-hidden relative bg-[#030303]">
      
        {/* Left Side - Signup Form (White Background) */}
      <div className="w-full md:w-1/2 flex-1 h-full p-8 sm:p-16 flex flex-col justify-center bg-white relative overflow-y-auto z-10 shadow-[20px_0_60px_-15px_rgba(0,0,0,0.5)] rounded-t-[3rem] md:rounded-none md:rounded-r-[4rem]">
        
        {/* Top bar with Logo and Close Button */}
        <div className="absolute top-6 md:top-10 lg:top-[72px] left-6 md:left-12 lg:left-20 right-6 md:right-12 lg:right-20 flex justify-between items-center z-50">
          {/* Desktop Logo (Hidden on mobile to match login placement) */}
          <Link href="/" onClick={(e) => handleNavigation(e, '/')} className="hidden md:block opacity-0 animate-fade-in-up animation-delay-300">
            <Image
              src="/earlybid.svg"
              alt="EarlyBid Logo"
              width={80}
              height={58}
              className="w-14 md:w-20 h-auto object-contain hover:opacity-90 transition-opacity" 
              priority
            />
          </Link>

          {/* Spacer for mobile to push close button right */}
          <div className="md:hidden flex-1"></div>

          {/* Close Button */}
          <Link href="/" onClick={(e) => handleNavigation(e, '/')} className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 opacity-0 animate-fade-in-up animation-delay-300" aria-label="Go back to home">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
        </div>

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
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (name.trim()) proceedWithLoading(() => setStep('email'));
                      }
                    }}
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
        @keyframes fly-transform-desktop {
          0% { transform: translate(0, 0) scale(0.5); }
          100% { transform: translate(60vw, var(--drift)) scale(1.5); }
        }
        @keyframes fly-transform-mobile {
          0% { transform: translate(0, 0) scale(0.5); }
          100% { transform: translate(var(--drift), -60vh) scale(1.5); }
        }
        @keyframes fly-opacity {
          0% { opacity: 0; }
          10% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { opacity: 0; }
        }
      `}} />

      {/* Right Side - The Portal */}
      <div className="w-full md:w-1/2 h-[40vh] md:h-full bg-[#030303] relative overflow-hidden z-0 flex flex-col md:flex-row items-center justify-center">
        
        {/* Mobile Logo (Inline SVG to customize internal star color on dark background) */}
        <div className="absolute top-8 left-8 z-50 md:hidden">
          <Link href="/" onClick={(e) => handleNavigation(e, '/')} className="inline-block opacity-0 animate-fade-in-up animation-delay-300">
            <svg viewBox="0 0 359 253" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-auto object-contain hover:opacity-90 transition-opacity">
              <path d="M206 143C206 131.954 214.954 123 226 123H286C321.899 123 351 152.101 351 188V188C351 223.899 321.899 253 286 253H226C214.954 253 206 244.046 206 233V143Z" fill="white"/>
              <path d="M317.833 191.227L351 187.328C341.444 186.028 321.3 183.429 317.167 183.429C313.033 183.429 313.556 175.11 314.333 170.951L317.667 143.656L310.833 172.511C307.767 182.181 302.667 183.819 300.5 183.429L206 187.718C235.333 189.148 294.833 192.007 298.167 192.007C301.5 192.007 302.778 193.307 303 193.957C305.133 197.7 305 203.835 304.667 206.435L301.333 231L309 201.755C312.067 193.333 316.167 191.227 317.833 191.227Z" fill="#4ba1fa"/>
              <path d="M30.36 251C25.68 251 22.08 249.74 19.56 247.22C17.04 244.7 15.78 241.1 15.78 236.42V138.68C15.78 134 17.04 130.4 19.56 127.88C22.08 125.36 25.68 124.1 30.36 124.1H73.92C82.92 124.1 90.6 125.42 96.96 128.06C103.32 130.7 108.12 134.48 111.36 139.4C114.72 144.32 116.4 150.2 116.4 157.04C116.4 164.6 114.24 171.02 109.92 176.3C105.6 181.58 99.66 185.12 92.1 186.92V184.04C100.86 185.6 107.64 189.08 112.44 194.48C117.36 199.76 119.82 206.66 119.82 215.18C119.82 226.46 115.92 235.28 108.12 241.64C100.32 247.88 89.58 251 75.9 251H30.36ZM42.42 230.3H72.12C79.32 230.3 84.6 228.92 87.96 226.16C91.32 223.28 93 219.08 93 213.56C93 208.04 91.32 203.9 87.96 201.14C84.6 198.38 79.32 197 72.12 197H42.42V230.3ZM42.42 176.3H69.06C76.02 176.3 81.18 174.98 84.54 172.34C87.9 169.7 89.58 165.74 89.58 160.46C89.58 155.3 87.9 151.4 84.54 148.76C81.18 146.12 76.02 144.8 69.06 144.8H42.42V176.3ZM162.176 252.62C157.616 252.62 154.136 251.36 151.736 248.84C149.336 246.32 148.136 242.78 148.136 238.22V136.88C148.136 132.32 149.336 128.78 151.736 126.26C154.136 123.74 157.616 122.48 162.176 122.48C166.616 122.48 170.036 123.74 172.436 126.26C174.836 128.78 176.036 132.32 176.036 136.88V238.22C176.036 242.78 174.836 246.32 172.436 248.84C170.156 251.36 166.736 252.62 162.176 252.62Z" fill="white"/>
              <path d="M25.1431 95C22.1037 95 19.7757 94.224 18.1591 92.672C16.6071 91.0553 15.8311 88.7597 15.8311 85.785V35.83C15.8311 32.8553 16.6071 30.592 18.1591 29.04C19.7757 27.4233 22.1037 26.615 25.1431 26.615H58.0261C60.3541 26.615 62.1001 27.197 63.2641 28.361C64.4281 29.525 65.0101 31.2063 65.0101 33.405C65.0101 35.6683 64.4281 37.4143 63.2641 38.643C62.1001 39.807 60.3541 40.389 58.0261 40.389H32.9031V53.387H55.8921C58.1554 53.387 59.8691 53.969 61.0331 55.133C62.2617 56.297 62.8761 58.0107 62.8761 60.274C62.8761 62.5373 62.2617 64.251 61.0331 65.415C59.8691 66.579 58.1554 67.161 55.8921 67.161H32.9031V81.226H58.0261C60.3541 81.226 62.1001 81.8403 63.2641 83.069C64.4281 84.233 65.0101 85.9143 65.0101 88.113C65.0101 90.3763 64.4281 92.09 63.2641 93.254C62.1001 94.418 60.3541 95 58.0261 95H25.1431ZM85.3331 95.873C83.3284 95.873 81.6471 95.4203 80.2891 94.515C78.9311 93.545 78.0904 92.2517 77.7671 90.635C77.4437 88.9537 77.7347 87.0783 78.6401 85.009L102.793 33.017C103.957 30.495 105.38 28.652 107.061 27.488C108.807 26.324 110.779 25.742 112.978 25.742C115.177 25.742 117.084 26.324 118.701 27.488C120.382 28.652 121.837 30.495 123.066 33.017L147.219 85.009C148.254 87.0783 148.609 88.9537 148.286 90.635C148.027 92.3163 147.219 93.6097 145.861 94.515C144.568 95.4203 142.951 95.873 141.011 95.873C138.424 95.873 136.42 95.291 134.997 94.127C133.639 92.963 132.41 91.0877 131.311 88.501L126.073 76.182L132.863 81.129H92.8991L99.7861 76.182L94.5481 88.501C93.3841 91.0877 92.1877 92.963 90.9591 94.127C89.7304 95.291 87.8551 95.873 85.3331 95.873ZM112.784 45.239L101.532 72.108L98.8161 67.452H127.043L124.327 72.108L112.978 45.239H112.784ZM172.798 95.873C169.952 95.873 167.754 95.097 166.202 93.545C164.65 91.9283 163.874 89.6973 163.874 86.852V35.636C163.874 32.726 164.65 30.495 166.202 28.943C167.818 27.391 170.049 26.615 172.895 26.615H196.757C204.517 26.615 210.498 28.5227 214.702 32.338C218.97 36.0887 221.104 41.3267 221.104 48.052C221.104 52.3847 220.134 56.1677 218.194 59.401C216.318 62.5697 213.57 65.027 209.949 66.773C206.392 68.4543 201.995 69.295 196.757 69.295L197.533 67.549H202.189C204.969 67.549 207.427 68.228 209.561 69.586C211.695 70.8793 213.473 72.884 214.896 75.6L219.746 84.33C220.78 86.2053 221.265 88.0483 221.201 89.859C221.136 91.605 220.425 93.06 219.067 94.224C217.773 95.3233 215.866 95.873 213.344 95.873C210.822 95.873 208.752 95.3557 207.136 94.321C205.584 93.2863 204.193 91.6697 202.965 89.471L194.138 73.272C193.362 71.8493 192.359 70.8793 191.131 70.362C189.967 69.78 188.609 69.489 187.057 69.489H181.722V86.852C181.722 89.6973 180.978 91.9283 179.491 93.545C178.003 95.097 175.772 95.873 172.798 95.873ZM181.722 56.879H193.556C196.983 56.879 199.602 56.2 201.413 54.842C203.223 53.484 204.129 51.3823 204.129 48.537C204.129 45.821 203.223 43.784 201.413 42.426C199.602 41.0033 196.983 40.292 193.556 40.292H181.722V56.879ZM249.142 95C246.296 95 244.065 94.224 242.449 92.672C240.897 91.0553 240.121 88.8243 240.121 85.979V35.539C240.121 32.629 240.897 30.398 242.449 28.846C244.001 27.294 246.199 26.518 249.045 26.518C251.955 26.518 254.153 27.294 255.641 28.846C257.193 30.398 257.969 32.629 257.969 35.539V80.159H281.637C284.094 80.159 285.969 80.8057 287.263 82.099C288.621 83.3277 289.3 85.1383 289.3 87.531C289.3 89.9237 288.621 91.7667 287.263 93.06C285.969 94.3533 284.094 95 281.637 95H249.142ZM318.091 95.873C315.246 95.873 313.047 95.097 311.495 93.545C309.943 91.9283 309.167 89.6327 309.167 86.658V60.08L312.853 69.877L290.543 37.77C289.444 36.218 289.959 34.5043 289.088 32.629C289.282 30.689 290.058 29.0723 291.416 27.779C292.839 26.421 294.844 25.742 297.43 25.742C299.241 25.742 300.89 26.1947 302.377 27.1C303.865 27.9407 305.255 29.3957 306.548 31.465L320.128 51.447H316.636L330.216 31.368C331.574 29.2987 332.965 27.8437 334.387 27.003C335.81 26.1623 337.491 25.742 339.431 25.742C341.889 25.742 343.796 26.3563 345.154 27.585C346.512 28.8137 347.224 30.3657 347.288 32.241C347.418 34.1163 346.836 36.024 345.542 37.964L323.426 69.877L327.015 60.08V86.658C327.015 92.8013 324.041 95.873 318.091 95.873Z" fill="white"/>
            </svg>
          </Link>
        </div>

        {/* Film Grain / Noise Texture Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none z-20 opacity-[0.04]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        ></div>

        {/* --- DESKTOP BEAMS (Shooting Left to Right) --- */}
        <div className="hidden md:flex absolute left-0 w-[150%] h-full pointer-events-none z-0 items-center">
          {/* Base ambient glow */}
          <div className="absolute left-0 w-full h-[80%] bg-gradient-to-r from-[#003973] to-transparent opacity-40 blur-[100px]"></div>

          {/* The Main Projection Cone */}
          <div className="absolute left-[-20px] w-full h-[140%] flex items-center filter blur-[40px] opacity-80">
            <div 
              className="w-full h-full bg-gradient-to-r from-[#1B67B3] via-[#003973] to-transparent"
              style={{ clipPath: 'polygon(0 35%, 100% -10%, 100% 110%, 0 65%)' }}
            ></div>
          </div>
          
          {/* The Intense Inner Core Cone */}
          <div className="absolute left-[-10px] w-[90%] h-[120%] flex items-center filter blur-[20px] opacity-90">
            <div 
              className="w-full h-full bg-gradient-to-r from-[#4ba1fa] via-[#1B67B3] to-transparent"
              style={{ clipPath: 'polygon(0 42%, 100% 10%, 100% 90%, 0 58%)' }}
            ></div>
          </div>

          {/* The Blinding Light Source */}
          <div className="absolute left-0 h-[30%] w-[3px] bg-white shadow-[0_0_30px_10px_#4ba1fa] mix-blend-screen"></div>
        </div>

        {/* --- MOBILE BEAMS (Shooting Bottom to Top) --- */}
        <div className="md:hidden absolute bottom-0 left-0 w-full h-[150%] pointer-events-none z-0 flex justify-center">
          {/* Base ambient glow */}
          <div className="absolute bottom-0 w-[80%] h-full bg-gradient-to-t from-[#003973] to-transparent opacity-40 blur-[100px]"></div>

          {/* The Main Projection Cone */}
          <div className="absolute bottom-[-20px] w-[140%] h-full flex justify-center filter blur-[40px] opacity-80">
            <div 
              className="w-full h-full bg-gradient-to-t from-[#1B67B3] via-[#003973] to-transparent"
              style={{ clipPath: 'polygon(-10% 0, 110% 0, 65% 100%, 35% 100%)' }}
            ></div>
          </div>
          
          {/* The Intense Inner Core Cone */}
          <div className="absolute bottom-[-10px] w-[120%] h-[90%] flex justify-center filter blur-[20px] opacity-90">
            <div 
              className="w-full h-full bg-gradient-to-t from-[#4ba1fa] via-[#1B67B3] to-transparent"
              style={{ clipPath: 'polygon(10% 0, 90% 0, 58% 100%, 42% 100%)' }}
            ></div>
          </div>

          {/* The Blinding Light Source */}
          <div className="absolute bottom-0 w-[30%] h-[3px] bg-white shadow-[0_0_30px_10px_#4ba1fa] mix-blend-screen"></div>
        </div>

        {/* --- DESKTOP Flying Stars --- */}
        <div className="hidden md:block absolute inset-0 pointer-events-none z-10">
          {[...Array(35)].map((_, i) => {
            const top = 35 + Math.random() * 30; 
            const size = 2 + Math.random() * 4; 
            const delay = -(Math.random() * 40); // Negative delay so it starts populated
            const duration = 20 + Math.random() * 20; // 20s to 40s total life
            const drift = (Math.random() - 0.5) * 60; 
            
            return (
              <div
                key={`desktop-star-${i}`}
                className="absolute left-0 text-white mix-blend-screen flex items-center justify-center opacity-0"
                style={{
                  top: `${top}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animation: `
                    fly-transform-desktop ${duration}s cubic-bezier(0.5, 0, 1, 1) ${delay}s infinite,
                    fly-opacity ${duration}s linear ${delay}s infinite
                  `,
                  '--drift': `${drift}vh`
                } as React.CSSProperties}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
                </svg>
              </div>
            );
          })}
        </div>

        {/* --- MOBILE Flying Stars --- */}
        <div className="md:hidden absolute inset-0 pointer-events-none z-10">
          {[...Array(35)].map((_, i) => {
            const left = 35 + Math.random() * 30; 
            const size = 2 + Math.random() * 4; 
            const delay = -(Math.random() * 40); 
            const duration = 20 + Math.random() * 20; 
            const drift = (Math.random() - 0.5) * 60; 
            
            return (
              <div
                key={`mobile-star-${i}`}
                className="absolute bottom-0 text-white mix-blend-screen flex items-center justify-center opacity-0"
                style={{
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animation: `
                    fly-transform-mobile ${duration}s cubic-bezier(0.5, 0, 1, 1) ${delay}s infinite,
                    fly-opacity ${duration}s linear ${delay}s infinite
                  `,
                  '--drift': `${drift}vw`
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

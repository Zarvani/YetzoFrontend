'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, ShieldCheck, ArrowRight, Phone, Lock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuthModalStore } from '@/store/useAuthModalStore';

export function AuthModal() {
  const { isOpen, redirectUrl, onSuccess, closeAuthModal } = useAuthModalStore();
  const router = useRouter();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state on open/close
  useEffect(() => {
    if (isOpen) {
      setStep('phone');
      setPhone('');
      setOtp(['', '', '', '']);
      setError('');
      setLoading(false);
      setResendTimer(30);
    }
  }, [isOpen]);

  // Resend countdown timer
  useEffect(() => {
    let interval: any;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!isOpen) return null;

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/proxy/v1/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStep('otp');
        setResendTimer(30);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } else {
        // Even if proxy returns message or custom error, handle gracefully
        setError(data.error || data.detail || 'Could not send verification code. Please check your number.');
      }
    } catch (err: any) {
      setError('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 4) {
      setError('Please enter the 4-digit code sent to your phone');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/proxy/v1/auth/verify_otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.replace(/\D/g, ''), otp: otpValue }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const tokens = data.data?.tokens;
        if (tokens) {
          localStorage.setItem('access_token', tokens.access);
          localStorage.setItem('refresh_token', tokens.refresh);
        }

        // Notify app that user logged in
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: { loggedIn: true } }));

        closeAuthModal();

        if (onSuccess) {
          onSuccess();
        } else if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.refresh();
        }
      } else {
        setError(data.error || 'Incorrect OTP code. Please try again.');
      }
    } catch (err: any) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-lg border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200 font-body"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Strip */}
        <div className="bg-[#0B0F19] text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 shrink-0">
              <Image src="/logo.jpg" alt="Yetzo" fill className="object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-medium tracking-wider text-sm uppercase text-white">
                  YETZO
                </span>
                <span className="text-[10px] bg-blue-600/30 text-sky-400 border border-blue-500/40 px-1.5 py-0.2 rounded-sm font-bold">
                  15-MIN FLEET
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {step === 'phone' ? 'Login or Sign Up with Mobile OTP' : 'Verify Mobile Number'}
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-sm text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold font-heading uppercase tracking-wider text-slate-700 mb-2">
                  Enter Mobile Number
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                    <span className="font-heading text-[10px] font-bold text-slate-700 bg-slate-200/80 px-1 py-0.5 rounded-sm">IN</span>
                    <span>+91</span>
                    <span className="text-slate-300">|</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    autoFocus
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white rounded-sm pl-20 pr-4 py-3 text-sm font-semibold text-slate-900 tracking-wider outline-none transition placeholder:text-slate-400 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  We'll send a 4-digit verification code to confirm your number.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || phone.replace(/\D/g, '').length !== 10}
                className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium font-heading uppercase tracking-wider text-xs rounded-sm shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Continue with OTP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Protected by DPDP Act 2023 · No spam guarantee</span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <p className="text-xs text-slate-600">
                  Enter 4-digit code sent to <strong className="text-slate-900 font-mono">+91 {phone}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-[11px] text-blue-600 hover:underline font-semibold"
                >
                  Change mobile number
                </button>
              </div>

              {/* 4-digit OTP Inputs */}
              <div className="flex justify-center gap-3 py-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-12 h-14 text-center text-xl font-bold font-mono border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm bg-slate-50 focus:bg-white outline-none transition"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || otp.join('').length < 4}
                className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium font-heading uppercase tracking-wider text-xs rounded-sm shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Didn't receive code?</span>
                {resendTimer > 0 ? (
                  <span className="font-mono text-slate-400 text-[11px]">Resend in {resendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-blue-600 hover:underline font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend OTP</span>
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

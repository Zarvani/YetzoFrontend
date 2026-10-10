'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { motion, AnimatePresence } from 'framer-motion';

export default function OTPLoginPage() {
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      // Add country code if missing
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      
      await apiClient('auth/otp/send/', {
        method: 'POST',
        body: { phone_number: formattedPhone }
      });
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError("Please enter the complete OTP.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      
      const res: any = await apiClient('auth/otp/verify/', {
        method: 'POST',
        body: { phone_number: formattedPhone, otp_code: otp }
      });

      // Save the token
      if (res.access_token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', res.access_token);
        }
        // Redirect to dashboard
        router.push('/customer/home');
      } else {
        setError("Invalid response from server.");
      }
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please check and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 relative overflow-hidden">
        
        {/* Top Decorative Gradient */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Welcome Back.</h1>
          <p className="text-slate-500 text-sm">Log in or sign up to book home services</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSendOTP} 
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                <div className="flex rounded-xl shadow-sm border border-slate-200 overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                  <span className="flex items-center px-4 bg-slate-50 border-r border-slate-200 text-slate-500 font-medium">+91</span>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                    className="flex-1 px-4 py-3 text-slate-900 font-medium focus:outline-none"
                    placeholder="Enter 10 digit number"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isLoading || phone.length < 10}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : "Send OTP"}
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleVerifyOTP} 
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <p className="text-sm text-slate-600 mb-1">Code sent to <span className="font-bold text-slate-900">+91 {phone}</span></p>
                <button type="button" onClick={() => setStep(1)} className="text-sm text-blue-600 font-bold hover:underline">Change Number</button>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 text-center">Enter 6-digit OTP</label>
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  className="w-full text-center tracking-widest text-2xl px-4 py-3 rounded-xl shadow-sm border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-bold text-slate-900"
                  placeholder="------"
                  disabled={isLoading}
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading || otp.length < 4}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : "Verify & Login"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center text-xs text-slate-500">
          By continuing, you agree to our <a href="#" className="font-bold underline">Terms of Service</a> and <a href="#" className="font-bold underline">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}

"use client"
import * as React from "react"
import Link from "next/link"
import { ArrowRight, Smartphone, ShieldCheck } from "lucide-react"

export default function LoginPage() {
  const [step, setStep] = React.useState(1);
  const [phone, setPhone] = React.useState("");

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[1000px] bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Brand & Value Prop */}
        <div className="md:w-1/2 bg-gradient-to-br from-[#0B2D8F] via-[#2563EB] to-[#06B6D4] p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 blur-[80px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400 opacity-20 blur-[100px] rounded-full"></div>
          
          <div className="relative z-10">
            <Link href="/" className="text-[28px] font-bold tracking-tight inline-block mb-12">YETZO</Link>
            
            <h1 className="text-[36px] font-bold leading-tight mb-4">
              Your home,<br/>expertly cared for.
            </h1>
            <p className="text-[16px] text-blue-100 mb-8 font-light max-w-sm">
              Join millions of users who trust Yetzo for their cleaning, repair, and beauty needs.
            </p>
          </div>
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-cyan-300" />
              <p className="text-[14px] font-medium">100% Verified Professionals</p>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-cyan-300" />
              <p className="text-[14px] font-medium">Transparent upfront pricing</p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center">
          
          {step === 1 ? (
            <div className="max-w-[320px] mx-auto w-full">
              <h2 className="text-[24px] font-bold text-slate-900 mb-2">Welcome back</h2>
              <p className="text-[14px] text-slate-500 mb-8">Enter your mobile number to login or sign up.</p>
              
              <div className="mb-6 relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <span className="absolute left-11 top-1/2 -translate-y-1/2 text-[15px] font-bold text-slate-900">+91</span>
                <input 
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-[12px] py-4 pl-[80px] pr-4 text-[15px] font-bold text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
                  placeholder="99999 99999"
                />
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={phone.length !== 10}
                className="w-full bg-[#0F172A] disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-black text-white rounded-[12px] py-4 text-[15px] font-bold transition-colors flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
              
              <p className="text-[12px] text-slate-500 text-center mt-6">
                By continuing, you agree to Yetzo's <Link href="/terms" className="text-[#2563EB] font-bold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#2563EB] font-bold hover:underline">Privacy Policy</Link>.
              </p>
            </div>
          ) : (
            <div className="max-w-[320px] mx-auto w-full">
              <h2 className="text-[24px] font-bold text-slate-900 mb-2">Verify it's you</h2>
              <p className="text-[14px] text-slate-500 mb-8">We've sent a 4-digit code to <span className="font-bold text-slate-900">+91 {phone}</span>. <button onClick={() => setStep(1)} className="text-[#2563EB] font-bold hover:underline">Edit</button></p>
              
              <div className="flex gap-3 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <input 
                    key={i}
                    type="text"
                    maxLength={1}
                    className="w-14 h-14 text-center text-[24px] font-bold bg-slate-50 border border-slate-200 rounded-[12px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
                  />
                ))}
              </div>

              <button 
                onClick={() => window.location.href = '/'}
                className="w-full bg-[#0F172A] hover:bg-black text-white rounded-[12px] py-4 text-[15px] font-bold transition-colors"
              >
                Verify & Login
              </button>
              
              <p className="text-[13px] text-slate-500 text-center mt-6">
                Didn't receive the code? <button className="text-[#2563EB] font-bold hover:underline">Resend OTP</button>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

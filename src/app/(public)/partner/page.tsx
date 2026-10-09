import * as React from "react"
import { Header } from "@/components/layout/Header"
import { ShieldCheck, TrendingUp, Clock, CheckCircle2, DollarSign } from "lucide-react"

export default function PartnerOnboardingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero */}
      <div className="bg-[#0F172A] text-white pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2563EB] opacity-20 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="inline-block bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[13px] font-bold text-cyan-300 uppercase tracking-wider mb-6 border border-white/20">
              Join Yetzo Partners
            </div>
            <h1 className="text-[48px] md:text-[56px] font-bold leading-[1.1] mb-6">
              Be your own boss. <br /> Earn more every day.
            </h1>
            <p className="text-[18px] text-slate-300 mb-10 max-w-lg leading-relaxed">
              Join thousands of professionals earning reliable income on their own schedule. Yetzo provides the customers, the technology, and the support.
            </p>
            
            <div className="flex gap-6">
              <div>
                <p className="text-[32px] font-bold text-white leading-none">₹50k+</p>
                <p className="text-[13px] text-slate-400 mt-2 font-medium">Average Monthly Earnings</p>
              </div>
              <div className="w-px bg-slate-700"></div>
              <div>
                <p className="text-[32px] font-bold text-white leading-none">200k+</p>
                <p className="text-[13px] text-slate-400 mt-2 font-medium">Customers Waiting</p>
              </div>
            </div>
          </div>
          
          {/* Signup Card */}
          <div className="bg-white rounded-[24px] p-8 shadow-2xl text-slate-900 w-full max-w-md mx-auto lg:ml-auto">
            <h2 className="text-[24px] font-bold mb-2">Apply as a Professional</h2>
            <p className="text-[14px] text-slate-500 mb-8">Enter your details and our team will call you within 24 hours.</p>
            
            <form className="space-y-4">
              <div>
                <label className="text-[12px] font-bold text-slate-600 uppercase">Full Name</label>
                <input type="text" className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-[10px] p-3 text-[14px] focus:outline-none focus:border-[#2563EB]" placeholder="E.g. Rahul Kumar" />
              </div>
              <div>
                <label className="text-[12px] font-bold text-slate-600 uppercase">Mobile Number</label>
                <div className="flex mt-1">
                  <span className="bg-slate-100 border border-slate-200 border-r-0 rounded-l-[10px] px-4 flex items-center text-[14px] font-bold text-slate-700">+91</span>
                  <input type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-r-[10px] p-3 text-[14px] focus:outline-none focus:border-[#2563EB]" placeholder="99999 99999" />
                </div>
              </div>
              <div>
                <label className="text-[12px] font-bold text-slate-600 uppercase">Primary Skill</label>
                <select className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-[10px] p-3 text-[14px] focus:outline-none focus:border-[#2563EB]">
                  <option>AC Technician</option>
                  <option>Electrician</option>
                  <option>Plumber</option>
                  <option>Cleaner</option>
                  <option>Appliance Repair</option>
                </select>
              </div>
              <div>
                <label className="text-[12px] font-bold text-slate-600 uppercase">City</label>
                <input type="text" className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-[10px] p-3 text-[14px] focus:outline-none focus:border-[#2563EB]" placeholder="E.g. Agra" />
              </div>
              
              <button type="button" className="w-full mt-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-4 rounded-[12px] text-[15px] font-bold transition-colors">
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Benefits */}
      <div className="py-24 px-4 max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[32px] font-bold text-slate-900">Why partner with Yetzo?</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center">
            <div className="h-16 w-16 bg-blue-50 rounded-[16px] flex items-center justify-center mx-auto mb-6">
              <DollarSign className="h-8 w-8 text-[#2563EB]" />
            </div>
            <h3 className="text-[18px] font-bold text-slate-900 mb-3">Guaranteed High Earnings</h3>
            <p className="text-[14px] text-slate-600 leading-relaxed">Keep more of what you earn with low commission rates. Get tips directly, and receive your money automatically every Monday.</p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 bg-blue-50 rounded-[16px] flex items-center justify-center mx-auto mb-6">
              <Clock className="h-8 w-8 text-[#2563EB]" />
            </div>
            <h3 className="text-[18px] font-bold text-slate-900 mb-3">Flexible Schedule</h3>
            <p className="text-[14px] text-slate-600 leading-relaxed">You choose when you want to work. Go online with the tap of a button, and offline when you need a break.</p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 bg-blue-50 rounded-[16px] flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="h-8 w-8 text-[#2563EB]" />
            </div>
            <h3 className="text-[18px] font-bold text-slate-900 mb-3">Free Training & Upskilling</h3>
            <p className="text-[14px] text-slate-600 leading-relaxed">Access the Yetzo Training Center to learn new skills, get certified, and unlock higher-paying premium categories.</p>
          </div>
        </div>
      </div>

    </div>
  )
}

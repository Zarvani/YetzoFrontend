import * as React from "react"
import { ShieldCheck, CheckCircle2, Clock, UserCheck } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-[40px] font-bold text-[#0F172A] tracking-tight mb-4">How Yetzo Works</h1>
        <p className="text-[18px] text-[#475569] max-w-2xl mx-auto">
          We've simplified the process of finding trusted professionals for your everyday needs.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-12 relative">
        <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-[2px] bg-slate-200 -z-10"></div>
        
        {[
          { 
            step: "1", 
            title: "Select your service", 
            desc: "Browse our catalog and pick the exact service you need with upfront, transparent pricing.",
            icon: CheckCircle2 
          },
          { 
            step: "2", 
            title: "Pick a time", 
            desc: "Choose Instant delivery (arrives in ~30 mins) or schedule for a time that works best for you.",
            icon: Clock 
          },
          { 
            step: "3", 
            title: "Pro arrives & completes", 
            desc: "A background-verified expert will arrive with all necessary tools to complete the job.",
            icon: UserCheck 
          }
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center bg-white p-6 relative">
            <div className="h-16 w-16 bg-[#2563EB] text-white rounded-full flex items-center justify-center text-[24px] font-bold shadow-lg mb-6 z-10 border-4 border-white">
              {item.step}
            </div>
            <h3 className="text-[20px] font-bold text-[#0F172A] mb-3">{item.title}</h3>
            <p className="text-[15px] text-[#475569] leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-24 bg-slate-50 rounded-[24px] p-12 text-center border border-slate-200">
        <ShieldCheck className="h-16 w-16 text-[#16A34A] mx-auto mb-6" />
        <h2 className="text-[28px] font-bold text-[#0F172A] mb-4">The Yetzo Guarantee</h2>
        <p className="text-[16px] text-[#475569] max-w-3xl mx-auto">
          Every service booked through Yetzo comes with a 30-day warranty. If you're not completely satisfied with the quality of work, we'll send another professional to fix it at zero cost to you.
        </p>
      </div>
    </div>
  )
}

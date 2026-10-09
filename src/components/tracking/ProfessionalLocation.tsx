import * as React from "react"
import { Phone, MessageSquare, ShieldCheck, Star } from "lucide-react"

export function ProfessionalLocation() {
  return (
    <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.06)] overflow-hidden">
      <div className="p-5 flex items-center gap-4 border-b border-[#E2E8F0]">
        <div className="h-14 w-14 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm relative">
          <img src="/assets/images/ac-service.jpg" alt="Rahul Kumar" className="h-full w-full object-cover" />
          <div className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-[#16A34A] border-2 border-white rounded-full"></div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-[16px] font-bold text-[#0F172A]">Rahul Kumar</h3>
            <ShieldCheck className="h-4 w-4 text-[#2563EB]" />
          </div>
          <div className="flex items-center gap-3 text-[13px] text-[#64748B]">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
              <strong className="text-[#0F172A]">4.9</strong> (1.2k)
            </span>
            <span>•</span>
            <span>AC Technician</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="h-10 w-10 rounded-full border border-[#E2E8F0] flex items-center justify-center hover:bg-slate-50 transition-colors text-[#2563EB]">
            <MessageSquare className="h-4 w-4" />
          </button>
          <button className="h-10 w-10 rounded-full bg-[#16A34A] flex items-center justify-center hover:bg-green-700 transition-colors text-white shadow-sm">
            <Phone className="h-4 w-4 fill-white" />
          </button>
        </div>
      </div>
      
      <div className="bg-[#F8FAFC] p-4 flex items-center justify-between text-[13px]">
        <div className="flex items-center gap-2">
          <span className="text-[#64748B]">Temperature check:</span>
          <span className="font-semibold text-[#0F172A]">Normal (36.5°C)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#64748B]">Vaccinated:</span>
          <span className="font-semibold text-[#16A34A]">Yes</span>
        </div>
      </div>
    </div>
  )
}

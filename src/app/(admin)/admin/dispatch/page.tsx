import * as React from "react"
import Link from "next/link"
import { MapPin, AlertTriangle, Search, Navigation } from "lucide-react"

export default function AdminDispatchPage() {
  return (
    <div className="h-[calc(100vh-140px)] flex gap-6">
      
      {/* Left Panel: Delayed / Unassigned Jobs */}
      <div className="w-[400px] flex flex-col gap-4 bg-white border border-[#E2E8F0] rounded-[16px] shadow-sm overflow-hidden flex-shrink-0">
        <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h2 className="text-[18px] font-bold text-[#0F172A] mb-1">Live Dispatch Queue</h2>
          <p className="text-[13px] text-[#64748B]">Assign professionals to waiting jobs.</p>
          
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input 
              type="text" 
              placeholder="Search booking ID or area..." 
              className="w-full bg-white border border-[#CBD5E1] pl-9 pr-4 py-2 rounded-[8px] text-[13px] focus:outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          
          {/* Urgent Card */}
          <div className="bg-red-50 border border-red-200 rounded-[12px] p-4 relative cursor-pointer hover:border-red-300 transition-colors">
            <div className="absolute top-4 right-4 text-[12px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">14m Wait</div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-[14px] font-bold text-[#0F172A]">YZ-102941</span>
            </div>
            <p className="text-[15px] font-bold text-[#0F172A] mb-1">AC Deep Cleaning</p>
            <p className="text-[13px] text-[#475569] mb-3 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Sikandra, Agra</p>
            <button className="w-full bg-[#0F172A] text-white py-2 rounded-[6px] text-[13px] font-bold hover:bg-black transition-colors">
              Find Nearest Pro
            </button>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-4 cursor-pointer hover:border-[#CBD5E1] transition-colors">
            <div className="absolute top-4 right-4 text-[12px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">12m Wait</div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              <span className="text-[14px] font-bold text-[#0F172A]">YZ-102942</span>
            </div>
            <p className="text-[15px] font-bold text-[#0F172A] mb-1">Bathroom Cleaning</p>
            <p className="text-[13px] text-[#475569] mb-3 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Taj Ganj, Agra</p>
            <button className="w-full bg-[#F1F5F9] text-[#0F172A] py-2 rounded-[6px] text-[13px] font-bold hover:bg-[#E2E8F0] transition-colors border border-[#CBD5E1]">
              Find Nearest Pro
            </button>
          </div>

        </div>
      </div>

      {/* Right Panel: The Dispatch Map */}
      <div className="flex-1 bg-[#E2E8F0] rounded-[16px] border border-[#CBD5E1] shadow-sm relative overflow-hidden flex flex-col">
        <div 
          className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"
          style={{ backgroundSize: '40px 40px' }}
        ></div>

        {/* Floating Map Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="bg-white px-4 py-2 rounded-[8px] border border-[#E2E8F0] shadow-sm text-[13px] font-bold text-[#0F172A] flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#16A34A]"></span> Pros (156)
          </button>
          <button className="bg-white px-4 py-2 rounded-[8px] border border-[#E2E8F0] shadow-sm text-[13px] font-bold text-[#0F172A] flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#DC2626]"></span> Unassigned (2)
          </button>
        </div>

        {/* Map Elements (Simulated) */}
        
        {/* Selected Job Radius */}
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 bg-red-500/10 border-2 border-red-500/30 rounded-full flex items-center justify-center">
            {/* The Job Marker */}
            <div className="h-6 w-6 bg-red-600 rounded-full border-[3px] border-white shadow-lg relative z-10 flex items-center justify-center">
              <AlertTriangle className="h-3 w-3 text-white" />
            </div>
          </div>
        </div>

        {/* Available Pros around the job */}
        <div className="absolute top-[30%] left-[45%]">
          <div className="h-5 w-5 bg-[#16A34A] rounded-full border-2 border-white shadow-md relative group cursor-pointer">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white text-[11px] font-bold px-2 py-1 rounded hidden group-hover:block whitespace-nowrap">
              Rahul K. (2.1 km)
            </div>
          </div>
        </div>
        <div className="absolute top-[45%] left-[58%]">
          <div className="h-5 w-5 bg-[#16A34A] rounded-full border-2 border-white shadow-md relative group cursor-pointer">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white text-[11px] font-bold px-2 py-1 rounded hidden group-hover:block whitespace-nowrap">
              Amit S. (1.5 km)
            </div>
          </div>
        </div>
        <div className="absolute top-[48%] left-[40%]">
          <div className="h-5 w-5 bg-[#2563EB] rounded-full border-2 border-white shadow-md relative group cursor-pointer">
             <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white text-[11px] font-bold px-2 py-1 rounded hidden group-hover:block whitespace-nowrap">
              Vikram (On Job)
            </div>
          </div>
        </div>

        {/* Bottom Assignment Panel (Pops up when a job is clicked) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[600px] bg-white rounded-[12px] border border-[#E2E8F0] shadow-[0_10px_40px_rgba(15,23,42,0.1)] p-4 flex items-center justify-between">
          <div>
            <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-0.5">Assigning</p>
            <p className="text-[15px] font-bold text-[#0F172A]">YZ-102941 (AC Deep Cleaning)</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[14px] font-bold text-[#0F172A]">Amit S.</p>
              <p className="text-[12px] text-[#16A34A] font-semibold flex items-center gap-1 justify-end"><Navigation className="h-3 w-3" /> 1.5 km away</p>
            </div>
            <button className="bg-[#2563EB] text-white px-6 py-2.5 rounded-[8px] text-[14px] font-bold hover:bg-[#1D4ED8] transition-colors">
              Force Assign
            </button>
          </div>
        </div>

      </div>

    </div>
  )
}

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, MapPin, Phone, MessageSquare, AlertTriangle, Navigation as NavIcon, Zap, CheckCircle2 } from "lucide-react"

export default function ProfessionalNavigationPage() {
  return (
    <div className="max-w-[1200px] mx-auto h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6">
      
      {/* Left Panel: Job Details & Navigation Controls */}
      <div className="w-full lg:w-[400px] flex flex-col gap-4 overflow-y-auto">
        <Link href="/pro" className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors mb-2">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        
        {/* Job Header */}
        <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#06B6D4] text-white text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
              <Zap className="h-3 w-3 fill-white" /> Instant Dispatch
            </span>
            <span className="text-[13px] text-[#64748B] font-semibold">#YZ-102938</span>
          </div>
          <h1 className="text-[20px] font-bold text-[#0F172A]">AC Deep Cleaning</h1>
          
          <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
            <h2 className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Customer Details</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[15px] font-bold text-[#0F172A]">Amit Sharma</p>
                <p className="text-[13px] text-[#64748B]">New Customer</p>
              </div>
              <div className="flex gap-2">
                <button className="h-10 w-10 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#2563EB] hover:bg-slate-50 transition-colors">
                  <MessageSquare className="h-4 w-4" />
                </button>
                <button className="h-10 w-10 rounded-full bg-[#16A34A] flex items-center justify-center text-white shadow-sm hover:bg-green-700 transition-colors">
                  <Phone className="h-4 w-4 fill-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Destination Address */}
        <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm p-5">
          <h2 className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-3">Destination</h2>
          <div className="flex gap-3">
            <div className="mt-0.5">
              <MapPin className="h-5 w-5 text-[#2563EB]" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-[#0F172A]">Home</p>
              <p className="text-[13px] text-[#64748B] mt-1 leading-relaxed">
                B-104, Sunrise Apartments<br />
                Kargil Petrol Pump Road, Sikandra<br />
                Agra, UP 282007
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-4 pb-2">
          <button className="w-full bg-[#0F172A] hover:bg-black text-white rounded-[12px] py-4 text-[16px] font-bold shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
            <CheckCircle2 className="h-5 w-5" /> Mark as Arrived
          </button>
          
          <button className="w-full mt-3 flex items-center justify-center gap-2 text-[13px] font-semibold text-[#DC2626] py-3 hover:bg-red-50 rounded-[8px] transition-colors">
            <AlertTriangle className="h-4 w-4" /> Report Issue (SOS)
          </button>
        </div>
      </div>

      {/* Right Panel: The Map & ETA */}
      <div className="flex-1 bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm relative overflow-hidden flex flex-col">
        {/* Floating ETA Card on Map */}
        <div className="absolute top-6 left-6 z-10 bg-white/95 backdrop-blur shadow-[0_4px_20px_rgba(15,23,42,0.1)] rounded-[12px] p-4 min-w-[200px] border border-[#E2E8F0]">
          <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Time to Destination</p>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-[#0F172A] leading-none text-[#2563EB]">12</span>
            <span className="text-[16px] font-bold text-[#0F172A]">min</span>
          </div>
          <p className="text-[13px] font-medium text-[#64748B] mt-1">2.4 km remaining</p>
        </div>

        {/* Re-center Button */}
        <button className="absolute bottom-6 right-6 z-10 h-12 w-12 bg-white rounded-full shadow-lg border border-[#E2E8F0] flex items-center justify-center text-[#2563EB] hover:bg-slate-50">
          <NavIcon className="h-5 w-5" />
        </button>

        {/* Simulated Map Background */}
        <div className="flex-1 relative bg-[#E2E8F0]">
          <div 
            className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"
            style={{ backgroundSize: '40px 40px' }}
          ></div>
          
          {/* Navigation Route Line */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none">
            <path 
              d="M 300,500 C 400,450 500,200 700,250" 
              stroke="#2563EB" 
              strokeWidth="6" 
              fill="none" 
              className="drop-shadow-md"
            />
          </svg>

          {/* Professional Current Location (Bottom Left) */}
          <div className="absolute top-[500px] left-[300px] -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-[#2563EB] rounded-full animate-ping opacity-60"></div>
              <div className="relative h-6 w-6 bg-[#2563EB] rounded-full border-[3px] border-white shadow-lg flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Customer Destination (Top Right) */}
          <div className="absolute top-[250px] left-[700px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="bg-[#0F172A] text-white text-[12px] font-bold px-3 py-1.5 rounded-[8px] mb-2 shadow-lg flex items-center gap-2">
              <MapPin className="h-3 w-3" /> Customer
            </div>
            <div className="h-4 w-4 bg-[#0F172A] rounded-full border-2 border-white shadow-lg z-10"></div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

import * as React from "react"
import { MapPin, Plus } from "lucide-react"

export function BookingAddressSelector() {
  return (
    <div className="space-y-4">
      {/* Existing Address */}
      <label className="relative flex cursor-pointer rounded-[12px] border-2 border-[#2563EB] bg-blue-50/30 p-5 focus:outline-none hover:bg-blue-50 transition-colors">
        <input type="radio" name="address" value="home" className="sr-only" defaultChecked />
        <span className="flex flex-1 items-start gap-4">
          <div className="bg-white p-2 rounded-full border border-[#2563EB] shrink-0 mt-0.5">
            <MapPin className="h-4 w-4 text-[#2563EB]" />
          </div>
          <div className="flex-1 flex flex-col">
            <span className="flex items-center justify-between mb-1">
              <span className="text-[15px] font-bold text-[#0F172A]">Home</span>
              <span className="h-5 w-5 rounded-full border-[5px] border-[#2563EB] bg-white"></span>
            </span>
            <span className="text-[14px] text-[#475569] leading-relaxed">
              B-104, Sunrise Apartments<br />
              Kargil Petrol Pump Road, Sikandra<br />
              Agra, UP 282007
            </span>
          </div>
        </span>
      </label>

      {/* Add New Address */}
      <button className="w-full relative flex cursor-pointer rounded-[12px] border-2 border-dashed border-[#CBD5E1] bg-white p-5 focus:outline-none hover:border-[#2563EB] transition-colors items-center justify-center gap-2 group">
        <Plus className="h-5 w-5 text-[#64748B] group-hover:text-[#2563EB] transition-colors" />
        <span className="text-[15px] font-semibold text-[#64748B] group-hover:text-[#2563EB] transition-colors">Add New Address</span>
      </button>
    </div>
  )
}

import * as React from "react"
import Link from "next/link"
import { Star, Clock, Zap } from "lucide-react"

interface ServiceCardProps {
  id: string
  title: string
  image: string
  rating: number
  reviewsCount: string
  price: number
  isInstantAvailable: boolean
  isScheduledAvailable: boolean
  slug: string
}

export function ServiceCard({
  title,
  image,
  rating,
  reviewsCount,
  price,
  isInstantAvailable,
  isScheduledAvailable,
  slug
}: ServiceCardProps) {
  return (
    <div className="bg-white rounded-[12px] border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-[2px] overflow-hidden flex flex-col h-full group">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img 
          src={image} 
          alt={title} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-[16px] font-bold text-[#0F172A] mb-1 leading-tight">{title}</h3>
        
        <div className="flex items-center gap-1.5 mb-3 text-[13px] text-[#475569]">
          <Star className="h-3.5 w-3.5 fill-[#16A34A] text-[#16A34A]" />
          <span className="font-semibold text-[#0F172A]">{rating}</span>
          <span>({reviewsCount} bookings)</span>
        </div>
        
        <div className="mt-auto pt-3 border-t border-[#E2E8F0] flex items-end justify-between">
          <div>
            <p className="text-[12px] text-[#64748B] font-medium uppercase tracking-wider mb-0.5">From</p>
            <p className="text-[18px] font-bold text-[#0F172A]">₹{price}</p>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5">
              {isInstantAvailable && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-[#06B6D4] bg-cyan-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <Zap className="h-3 w-3" /> Instant
                </span>
              )}
              {isScheduledAvailable && !isInstantAvailable && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-[#334155] bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <Clock className="h-3 w-3" /> Scheduled
                </span>
              )}
            </div>
            <Link 
              href={`/service/${slug}`} 
              className="text-[13px] font-bold text-[#2563EB] hover:text-[#1D4ED8]"
            >
              View Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

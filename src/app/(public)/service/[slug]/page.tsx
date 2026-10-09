import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Star, CheckCircle2, ShieldCheck, Clock, ChevronRight } from "lucide-react"
import { apiClient } from "@/lib/apiClient"
import { Service } from "@/types/service"
import { notFound } from "next/navigation"

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  let service: Service;
  
  try {
    service = await apiClient<Service>(`/services/${params.slug}/`, { next: { revalidate: 60 } });
  } catch (error) {
    console.error("Service not found:", error);
    return notFound();
  }
  
  const serviceName = service.name;
  
  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-8">
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-[13px] font-medium text-[#64748B] mb-8">
        <span className="hover:text-[#2563EB] cursor-pointer transition-colors">Home</span>
        <ChevronRight className="h-3 w-3" />
        <span className="hover:text-[#2563EB] cursor-pointer transition-colors">Appliance Repair</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-[#0F172A]">{serviceName}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* LEFT COLUMN: Media & Content */}
        <div className="flex-1">
          {/* Main Photo Placeholder */}
          <div className="w-full aspect-video bg-slate-100 rounded-[12px] border border-[#E2E8F0] mb-12 flex items-center justify-center">
             <span className="text-slate-400 font-medium">Service Image / Video Placeholder</span>
          </div>

          <div className="flex flex-col gap-12">
            
            {/* WHAT'S INCLUDED */}
            <section>
              <h2 className="text-[24px] font-bold text-[#0F172A] mb-6 tracking-tight">What's included</h2>
              <div className="text-[16px] text-[#475569] whitespace-pre-wrap">
                {service.description || "Detailed description coming soon."}
              </div>
            </section>
            
            <hr className="border-[#E2E8F0]" />

            {/* HOW IT WORKS */}
            <section>
              <h2 className="text-[24px] font-bold text-[#0F172A] mb-6 tracking-tight">How it works</h2>
              <div className="flex flex-col gap-6">
                {[
                  { title: "Select your service", desc: "Choose the exact repair or service package you need." },
                  { title: "Pick a time", desc: "Select Instant arrival (~30 mins) or schedule for later." },
                  { title: "Professional arrives", desc: "A background-verified expert will arrive with tools." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 font-bold text-[#2563EB]">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0F172A] text-[16px]">{step.title}</h4>
                      <p className="text-[15px] text-[#475569] mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Booking Panel */}
        <div className="w-full lg:w-[420px]">
          <div className="sticky top-[104px]">
            <Card className="border-[#E2E8F0]">
              <CardContent className="p-6">
                <h1 className="text-[28px] font-bold text-[#0F172A] leading-tight mb-2 tracking-tight">
                  {serviceName}
                </h1>
                
                <div className="flex items-center gap-2 text-[14px] font-medium text-[#475569] mb-4">
                  <Star className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                  <span className="text-[#0F172A]">4.8</span>
                  <span>(12k+ reviews)</span>
                </div>
                
                <div className="text-[32px] font-bold text-[#0F172A] mb-6">
                  <span className="text-[16px] font-medium text-[#64748B] mr-2">From</span>
                  ₹{service.base_price || 499}
                </div>
                
                <div className="flex items-center gap-4 mb-8 bg-slate-50 p-3 rounded-[8px] border border-slate-100">
                   <div className="flex items-center gap-2 text-[14px] font-semibold text-[#0F172A]">
                     <Clock className="h-4 w-4 text-[#06B6D4]" />
                     Instant
                   </div>
                   <span className="text-slate-300">|</span>
                   <div className="flex items-center gap-2 text-[14px] font-medium text-[#475569]">
                     Scheduled
                   </div>
                </div>

                <Button variant="primary" className="w-full h-12 text-[16px]">
                  Book Now
                </Button>
                
                <div className="mt-6 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-[13px] text-[#475569]">
                    <ShieldCheck className="h-4 w-4 text-[#16A34A]" />
                    <span>30-day service warranty</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-[#475569]">
                    <CheckCircle2 className="h-4 w-4 text-[#2563EB]" />
                    <span>Verified background-checked professionals</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  )
}

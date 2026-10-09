import * as React from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Star, ThumbsUp, MessageSquare, AlertCircle } from "lucide-react"

export default function ProfessionalPerformancePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight">Performance metrics</h1>
          <p className="text-[15px] text-[#475569] mt-1">See how customers rate your service.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-[#2563EB] bg-blue-50/50">
          <CardContent className="p-6 text-center">
            <Star className="h-10 w-10 text-[#F59E0B] mx-auto mb-3" />
            <p className="text-[14px] font-semibold text-[#0F172A] uppercase tracking-wider mb-1">Average Rating</p>
            <h2 className="text-[40px] font-bold text-[#0F172A]">4.88</h2>
            <p className="text-[13px] text-slate-500 mt-2">Based on 142 reviews</p>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200">
          <CardContent className="p-6 text-center">
            <ThumbsUp className="h-10 w-10 text-[#16A34A] mx-auto mb-3" />
            <p className="text-[14px] font-semibold text-[#0F172A] uppercase tracking-wider mb-1">Acceptance Rate</p>
            <h2 className="text-[40px] font-bold text-[#0F172A]">94%</h2>
            <p className="text-[13px] text-green-600 font-medium mt-2">Excellent standing</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-10 w-10 text-orange-500 mx-auto mb-3" />
            <p className="text-[14px] font-semibold text-[#0F172A] uppercase tracking-wider mb-1">Cancellation Rate</p>
            <h2 className="text-[40px] font-bold text-[#0F172A]">2.1%</h2>
            <p className="text-[13px] text-slate-500 mt-2">Target: Below 5%</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <h2 className="text-[20px] font-bold text-[#0F172A] mb-4 border-b border-slate-200 pb-2">Recent Customer Reviews</h2>
        <div className="flex flex-col gap-4">
          {[
            { name: "Anjali Sharma", date: "Oct 5, 2026", rating: 5, comment: "Rahul was very professional and fixed the AC leak within 20 minutes. Highly recommended." },
            { name: "Vikram S.", date: "Oct 2, 2026", rating: 5, comment: "Arrived exactly on time. Cleaned up after the work was done." },
            { name: "Neha G.", date: "Sep 28, 2026", rating: 4, comment: "Good service, but the spare part took a bit long to procure." },
          ].map((review, i) => (
            <Card key={i} className="border-slate-200">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-[#0F172A]">{review.name}</h4>
                    <span className="text-[12px] text-slate-500">{review.date}</span>
                  </div>
                  <div className="flex text-[#F59E0B]">
                    {[...Array(review.rating)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                  </div>
                </div>
                <p className="text-[14px] text-slate-700 mt-2 flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  "{review.comment}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

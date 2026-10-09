"use client"

import * as React from "react"
import { SearchBar } from "@/components/ui/SearchBar"
import { Card, CardContent } from "@/components/ui/Card"
import { MessageCircle, FileText, Phone } from "lucide-react"

export default function HelpCenterPage() {
  return (
    <div className="max-w-[1000px] mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-[32px] font-bold text-[#0F172A] tracking-tight mb-4">How can we help?</h1>
        <div className="max-w-xl mx-auto">
          <SearchBar placeholder="Search for articles, questions..." className="max-w-full" />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center hover:border-[#2563EB] transition-colors cursor-pointer">
          <CardContent className="p-6">
            <MessageCircle className="h-8 w-8 mx-auto text-[#2563EB] mb-4" />
            <h3 className="font-bold text-[#0F172A] mb-2">Live Chat</h3>
            <p className="text-[14px] text-[#475569]">Chat with our support team instantly.</p>
          </CardContent>
        </Card>
        
        <Card className="text-center hover:border-[#2563EB] transition-colors cursor-pointer">
          <CardContent className="p-6">
            <FileText className="h-8 w-8 mx-auto text-[#16A34A] mb-4" />
            <h3 className="font-bold text-[#0F172A] mb-2">Knowledge Base</h3>
            <p className="text-[14px] text-[#475569]">Read articles on how to use Yetzo.</p>
          </CardContent>
        </Card>

        <Card className="text-center hover:border-[#2563EB] transition-colors cursor-pointer">
          <CardContent className="p-6">
            <Phone className="h-8 w-8 mx-auto text-orange-500 mb-4" />
            <h3 className="font-bold text-[#0F172A] mb-2">Call Us</h3>
            <p className="text-[14px] text-[#475569]">Available 24/7 for urgent issues.</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-[20px] font-bold text-[#0F172A] mb-4 border-b border-slate-200 pb-2">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "How do I cancel a booking?", a: "You can cancel a booking from your 'My Bookings' tab up to 2 hours before the scheduled time for free." },
            { q: "Are the professionals verified?", a: "Yes, every professional undergoes a strict background check and skill assessment before joining Yetzo." },
            { q: "How does the warranty work?", a: "If you face an issue within 30 days of the service, we will send a professional to fix it for free." }
          ].map((faq, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-[8px] p-4">
              <h4 className="font-semibold text-[#0F172A] mb-2">{faq.q}</h4>
              <p className="text-[14px] text-[#475569]">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

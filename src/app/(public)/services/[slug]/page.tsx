"use client"
import * as React from "react"
import { Header } from "@/components/layout/Header"
import { Star, CheckCircle2, ShieldCheck, Clock, Award, ChevronRight, Info } from "lucide-react"
import Link from "next/link"

export default function ServiceDetailPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      
      {/* Breadcrumb & Hero */}
      <div className="bg-white border-b border-slate-200 pt-24 pb-8 px-4">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex items-center gap-2 text-[13px] text-slate-500 font-medium mb-6">
            <Link href="/" className="hover:text-[#2563EB]">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/" className="hover:text-[#2563EB]">AC Services</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-900">AC Deep Cleaning</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-[36px] md:text-[42px] font-bold text-slate-900 leading-tight mb-4">
                AC Deep Cleaning & Service
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1.5 text-[15px] font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 text-[#F59E0B] fill-current" /> 4.8 <span className="text-slate-500 font-medium">(12K+ reviews)</span>
                </div>
                <div className="text-[14px] text-slate-600 font-medium flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> 60 mins
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#16A34A] shrink-0" />
                  <p className="text-[15px] text-slate-700">Advanced jet pump cleaning of cooling coils</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#16A34A] shrink-0" />
                  <p className="text-[15px] text-slate-700">Gas pressure & cooling efficiency check</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#16A34A] shrink-0" />
                  <p className="text-[15px] text-slate-700">Mess-free experience with cleaning jackets</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-[12px] p-4 flex items-start gap-3">
                <ShieldCheck className="h-6 w-6 text-[#2563EB] shrink-0" />
                <div>
                  <p className="text-[14px] font-bold text-blue-900">Yetzo Guarantee</p>
                  <p className="text-[13px] text-blue-800 mt-0.5">30-day warranty on all repairs. If it breaks, we fix it for free.</p>
                </div>
              </div>
            </div>

            <div className="relative rounded-[24px] overflow-hidden shadow-2xl aspect-[4/3]">
              <img src="/assets/images/ac-service.jpg" alt="AC Service" className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[12px] font-bold text-slate-900 flex items-center gap-1.5 shadow-sm">
                <Award className="h-4 w-4 text-[#2563EB]" /> Top Rated Professionals
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Left Col: Details */}
        <div className="md:col-span-8">
          <h2 className="text-[24px] font-bold text-slate-900 mb-6">Select your variant</h2>
          
          <div className="space-y-4">
            
            {/* Variant 1 */}
            <div className="bg-white border border-[#2563EB] rounded-[16px] p-6 shadow-sm relative">
              <div className="absolute top-0 right-0 bg-[#2563EB] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-[12px] rounded-tr-[15px]">
                Most Popular
              </div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-[18px] font-bold text-slate-900">Split AC Deep Cleaning</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[18px] font-bold text-slate-900">₹499</span>
                    <span className="text-[14px] text-slate-400 line-through">₹999</span>
                    <span className="text-[12px] font-bold text-[#16A34A] bg-green-50 px-2 py-0.5 rounded">50% OFF</span>
                  </div>
                </div>
                <button className="bg-white border-2 border-[#2563EB] text-[#2563EB] font-bold text-[14px] px-6 py-2 rounded-[8px] hover:bg-blue-50 transition-colors">
                  Add
                </button>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <p className="text-[13px] text-slate-500 font-medium flex items-center gap-1.5 mb-2"><Info className="h-4 w-4" /> What's included</p>
                <ul className="text-[14px] text-slate-700 space-y-2 list-disc pl-5">
                  <li>Deep cleaning of indoor unit with foam jet technology</li>
                  <li>Outdoor unit wash for better heat exchange</li>
                  <li>Gas and performance check</li>
                </ul>
              </div>
            </div>

            {/* Variant 2 */}
            <div className="bg-white border border-slate-200 rounded-[16px] p-6 hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-[18px] font-bold text-slate-900">Window AC Deep Cleaning</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[18px] font-bold text-slate-900">₹399</span>
                    <span className="text-[14px] text-slate-400 line-through">₹799</span>
                  </div>
                </div>
                <button className="bg-white border border-slate-300 text-[#2563EB] font-bold text-[14px] px-6 py-2 rounded-[8px] hover:bg-slate-50 transition-colors">
                  Add
                </button>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <ul className="text-[14px] text-slate-700 space-y-2 list-disc pl-5">
                  <li>Complete removal and wash of cooling coil</li>
                  <li>Filter cleaning and gas check</li>
                </ul>
              </div>
            </div>

          </div>

          <h2 className="text-[24px] font-bold text-slate-900 mt-12 mb-6">Customer Reviews</h2>
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="border-b border-slate-200 pb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">R</div>
                  <div>
                    <p className="text-[14px] font-bold text-slate-900">Ravi Kumar</p>
                    <div className="flex items-center text-[#F59E0B]">
                      <Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3 fill-current" />
                    </div>
                  </div>
                </div>
                <p className="text-[14px] text-slate-700 leading-relaxed">The professional arrived exactly on time. They used a large cover so my walls didn't get dirty at all. The AC cooling improved significantly immediately after the service. Very happy!</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Cart Summary Sticky */}
        <div className="md:col-span-4 relative">
          <div className="bg-white border border-slate-200 rounded-[16px] p-6 shadow-xl sticky top-24">
            <h3 className="text-[18px] font-bold text-slate-900 mb-6">Your Cart</h3>
            
            <div className="flex items-center justify-center py-8 text-center border-2 border-dashed border-slate-200 rounded-[12px] mb-6">
              <div>
                <p className="text-[14px] font-medium text-slate-500">No items added</p>
                <p className="text-[12px] text-slate-400 mt-1">Select a variant to continue</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-[14px] text-slate-600">
                <span>Item Total</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between text-[14px] text-slate-600">
                <span>Taxes & Fee</span>
                <span>₹0</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between text-[16px] font-bold text-slate-900">
                <span>To Pay</span>
                <span>₹0</span>
              </div>
            </div>

            <Link href="/booking/details">
              <button className="w-full bg-[#0F172A] hover:bg-black text-white font-bold text-[15px] py-4 rounded-[12px] transition-colors flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                Proceed to Checkout <ChevronRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

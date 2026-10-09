"use client";

import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { TrendingUp, Clock, MapPin, ChevronRight, Zap, IndianRupee, Star } from "lucide-react"
import { apiClient } from "@/lib/apiClient"

export default function ProfessionalDashboardPage() {
  const [metrics, setMetrics] = useState({
    todayEarnings: 0,
    todayJobs: 0,
    completedJobs: 0,
    rating: 0.0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch earnings and jobs concurrently
        const [earningsRes, jobsRes] = await Promise.all([
          apiClient('/api/v1/finance/earnings/') as Promise<any>,
          apiClient('/api/v1/bookings/') as Promise<any>
        ]);
        
        let todayEarnings = 0;
        if (earningsRes.success && Array.isArray(earningsRes.data)) {
          // Sum up today's earnings (In a real app, filter by date)
          todayEarnings = earningsRes.data.reduce((acc: number, curr: any) => acc + curr.net_amount, 0);
        }
        
        let completed = 0;
        let todayJobs = 0;
        if (jobsRes.success && Array.isArray(jobsRes.data)) {
          completed = jobsRes.data.filter((b: any) => b.status === 'COMPLETED').length;
          // Mock today jobs based on total pending/confirmed
          todayJobs = jobsRes.data.filter((b: any) => ['CONFIRMED', 'ASSIGNED'].includes(b.status)).length;
        }
        
        setMetrics({
          todayEarnings,
          todayJobs,
          completedJobs: completed,
          rating: 4.8 // Mocking rating until rating aggregate API is built
        });
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-[#64748B]">Loading performance data...</div>;
  }

  return (
    <div className="max-w-[1000px]">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight">Good morning, Rahul 👋</h1>
        <p className="text-[15px] text-[#64748B] mt-1">Here's your performance today.</p>
      </div>

      {/* Top 4 Metrics - As per spec */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-[12px] border border-[#E2E8F0] shadow-sm">
          <p className="text-[13px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Today's Earnings</p>
          <div className="flex items-end gap-2">
            <h2 className="text-[28px] font-bold text-[#0F172A] leading-none">₹{metrics.todayEarnings.toLocaleString('en-IN')}</h2>
            <span className="text-[13px] font-medium text-[#16A34A] flex items-center mb-1">
              <TrendingUp className="h-3.5 w-3.5 mr-0.5" /> +12%
            </span>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-[12px] border border-[#E2E8F0] shadow-sm">
          <p className="text-[13px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Today's Jobs</p>
          <div className="flex items-end gap-2">
            <h2 className="text-[28px] font-bold text-[#0F172A] leading-none">{metrics.todayJobs}</h2>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-[12px] border border-[#E2E8F0] shadow-sm">
          <p className="text-[13px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Completed</p>
          <div className="flex items-end gap-2">
            <h2 className="text-[28px] font-bold text-[#0F172A] leading-none">{metrics.completedJobs}</h2>
            <span className="text-[13px] font-medium text-[#64748B] mb-1">This week</span>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-[12px] border border-[#E2E8F0] shadow-sm">
          <p className="text-[13px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Rating</p>
          <div className="flex items-end gap-2">
            <h2 className="text-[28px] font-bold text-[#0F172A] leading-none">{metrics.rating}</h2>
            <span className="text-[16px] text-[#F59E0B] mb-1">★</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active/Next Job */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-[18px] font-bold text-[#0F172A]">Up Next</h2>
            <Link href="/pro/jobs" className="text-[13px] font-bold text-[#2563EB] hover:text-[#1D4ED8]">View all jobs</Link>
          </div>
          
          <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="bg-blue-50/50 p-5 border-b border-[#E2E8F0] flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#06B6D4] text-white text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Zap className="h-3 w-3 fill-white" /> Instant Dispatch
                  </span>
                  <span className="text-[13px] text-[#64748B] font-semibold">#YZ-102938</span>
                </div>
                <h3 className="text-[18px] font-bold text-[#0F172A]">AC Deep Cleaning</h3>
                <p className="text-[14px] text-[#0F172A] mt-1 font-medium">Customer: Amit Sharma</p>
              </div>
              <div className="text-right">
                <p className="text-[13px] text-[#64748B] font-medium mb-0.5">Expected Earnings</p>
                <p className="text-[20px] font-bold text-[#16A34A]">₹420</p>
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex gap-6 mb-6">
                <div className="flex gap-3">
                  <div className="mt-0.5"><Clock className="h-5 w-5 text-[#64748B]" /></div>
                  <div>
                    <p className="text-[14px] font-bold text-[#0F172A]">Start in 15 mins</p>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Approx 1.5 hours</p>
                  </div>
                </div>
                
                <div className="flex gap-3 border-l border-[#E2E8F0] pl-6">
                  <div className="mt-0.5"><MapPin className="h-5 w-5 text-[#64748B]" /></div>
                  <div>
                    <p className="text-[14px] font-bold text-[#0F172A]">2.4 km away</p>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Kargil Petrol Pump Road</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Link href="/pro/jobs/YZ-102938/navigation" className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-3 rounded-[8px] text-[14px] font-bold text-center transition-colors shadow-sm">
                  Start Navigation
                </Link>
                <Link href="/pro/jobs/YZ-102938" className="bg-white border border-[#CBD5E1] text-[#0F172A] py-3 px-6 rounded-[8px] text-[14px] font-bold hover:bg-slate-50 transition-colors">
                  Details
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Activity / Announcements */}
        <div className="lg:col-span-1">
          <h2 className="text-[18px] font-bold text-[#0F172A] mb-4">Activity</h2>
          
          <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#E2E8F0] flex gap-3 hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center shrink-0 mt-1">
                <IndianRupee className="h-4 w-4 text-[#16A34A]" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#0F172A]">Payout processed</p>
                <p className="text-[13px] text-[#64748B] mt-0.5">₹4,250 has been sent to your bank account.</p>
                <p className="text-[11px] text-[#64748B] mt-2 font-medium">2 hours ago</p>
              </div>
            </div>
            
            <div className="p-4 border-b border-[#E2E8F0] flex gap-3 hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0 mt-1">
                <Star className="h-4 w-4 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#0F172A]">New 5-star rating!</p>
                <p className="text-[13px] text-[#64748B] mt-0.5">"Very professional and quick service."</p>
                <p className="text-[11px] text-[#64748B] mt-2 font-medium">Yesterday</p>
              </div>
            </div>
            
            <Link href="/pro/notifications" className="block p-3 text-center text-[13px] font-bold text-[#2563EB] hover:bg-blue-50 transition-colors">
              View all notifications
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  )
}

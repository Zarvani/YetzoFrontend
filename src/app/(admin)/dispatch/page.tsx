"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Search, MapPin, User, Clock, AlertTriangle } from "lucide-react"
import { apiClient } from "@/lib/apiClient"

export default function AdminDispatchPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await apiClient<any>('/api/v1/bookings/');
        if (response.success && Array.isArray(response.data)) {
          // Filter to only active jobs (not completed/cancelled)
          const activeJobs = response.data.filter(
            (b: any) => !['COMPLETED', 'CANCELLED'].includes(b.status)
          );
          setJobs(activeJobs);
        }
      } catch (err) {
        console.error("Failed to load dispatch jobs", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'CONFIRMED': return 'text-blue-600 bg-blue-50';
      case 'ASSIGNED': return 'text-orange-600 bg-orange-50';
      case 'IN_PROGRESS': return 'text-purple-600 bg-purple-50';
      case 'FAILED': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6">
      
      {/* Left List View */}
      <div className="w-1/3 flex flex-col bg-white border border-slate-200 rounded-[12px] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="font-bold text-slate-900 text-[18px]">Active Dispatches ({jobs.length})</h2>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter by Job ID or Pro Name..." 
              className="w-full pl-9 pr-3 py-2 text-[13px] border border-slate-200 rounded-md outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400 font-medium">Loading live radar...</div>
          ) : jobs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-medium">No active jobs found.</div>
          ) : jobs.map((job) => {
            const colorClass = getStatusColor(job.status);
            return (
            <div key={job.id} className="p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors relative">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[12px] font-bold text-slate-900">{job.booking_reference}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${colorClass}`}>
                  {job.status}
                </span>
              </div>
              <h4 className="text-[14px] font-bold text-slate-800 mb-1">
                {job.service_details?.name || 'Service Job'}
              </h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[12px] text-slate-500">
                  <User className="h-3 w-3" /> {job.professional_details?.name || "Unassigned"}
                </div>
                <div className="font-bold text-[12px] text-[#2563EB]">
                  ₹{job.total_amount}
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>

      {/* Right Map View */}
      <div className="flex-1 bg-slate-100 border border-slate-200 rounded-[12px] relative overflow-hidden flex flex-col">
        {/* Fake Map UI */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="bg-white shadow-md rounded-md p-1.5 flex gap-1">
             <button className="px-3 py-1 text-[12px] font-semibold bg-slate-900 text-white rounded">All</button>
             <button className="px-3 py-1 text-[12px] font-semibold text-slate-600 hover:bg-slate-100 rounded">Pros</button>
             <button className="px-3 py-1 text-[12px] font-semibold text-slate-600 hover:bg-slate-100 rounded">Jobs</button>
          </div>
        </div>
        
        {/* Dynamic Map Markers based on active jobs */}
        {jobs.map((job, idx) => {
          // Calculate a simulated position based on index since we don't have real lat/lng in the basic booking list yet
          const topPercent = 20 + (idx * 15) % 60;
          const leftPercent = 30 + (idx * 20) % 50;
          
          return (
            <div key={job.id} className="absolute" style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}>
              <div className="relative flex flex-col items-center">
                <div className={`text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg mb-1 whitespace-nowrap ${job.status === 'FAILED' ? 'bg-red-600 animate-bounce' : 'bg-slate-900'}`}>
                  {job.professional_details?.name || 'Unassigned'} ({job.status})
                </div>
                {job.status === 'FAILED' ? (
                  <AlertTriangle className="h-8 w-8 text-red-600 drop-shadow-md" />
                ) : (
                  <MapPin className="h-8 w-8 text-blue-600 drop-shadow-md" />
                )}
              </div>
            </div>
          );
        })}
        
      </div>

    </div>
  )
}

'use client';

import * as React from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { MapPin, Clock, IndianRupee, ShieldCheck } from "lucide-react"

export default function ProfessionalJobsPage() {
  const [activeTab, setActiveTab] = React.useState("new")
  const [jobs, setJobs] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [otpInput, setOtpInput] = React.useState("")
  const [verifyingId, setVerifyingId] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function fetchJobs() {
      const token = localStorage.getItem("yetzo_access_token")
      if (!token) return
      
      try {
        const { apiClient } = await import("@/lib/apiClient")
        const res = await apiClient<any>("/bookings/", { token: token || undefined })
        setJobs(res.data)
      } catch (err) {
        console.error("Failed to load professional jobs", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const verifyOtp = async (jobId: string, type: 'start' | 'end') => {
    setVerifyingId(jobId);
    try {
      const { apiClient } = await import("@/lib/apiClient");
      const token = localStorage.getItem("yetzo_access_token");
      await apiClient(`/bookings/${jobId}/status/`, {
        method: 'PATCH',
        token: token || undefined,
        body: {
          status: type === 'start' ? 'in_progress' : 'completed',
          [type === 'start' ? 'start_otp' : 'end_otp']: otpInput
        }
      });
      alert("OTP Verified Successfully");
      setOtpInput("");
      // Refresh jobs list
      const res = await apiClient<any>("/bookings/", { token: token || undefined });
      setJobs(res.data || res.results || []);
    } catch (err: any) {
      alert("Failed to verify OTP: " + err.message);
    } finally {
      setVerifyingId(null);
    }
  };

  const newJobs = jobs.filter(j => j.status === 'searching' || j.status === 'scheduled');
  const activeJobs = jobs.filter(j => j.status === 'in_progress' || j.status === 'completed');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight">Job Requests</h1>
        <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16A34A]"></span>
          </span>
          <span className="text-[13px] font-semibold text-[#16A34A]">Receiving Jobs</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab("new")}
          className={`pb-3 px-4 font-semibold text-[15px] border-b-2 transition-colors ${activeTab === 'new' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          New Requests ({newJobs.length})
        </button>
        <button 
          onClick={() => setActiveTab("active")}
          className={`pb-3 px-4 font-semibold text-[15px] border-b-2 transition-colors ${activeTab === 'active' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Active Jobs ({activeJobs.length})
        </button>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {isLoading && <div className="p-4 text-center text-slate-500">Loading jobs...</div>}
        
        {!isLoading && activeTab === "new" && newJobs.length === 0 && (
          <div className="p-8 text-center text-slate-500">No new job requests at the moment.</div>
        )}

        {!isLoading && activeTab === "new" && newJobs.map((job) => (
          <Card key={job.id} className="border-2 border-blue-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#2563EB]"></div>
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-100 text-[#2563EB] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">{job.is_instant ? 'Instant Request' : 'Scheduled'}</span>
                    <span className="text-[12px] text-slate-500">{new Date(job.created_at).toLocaleTimeString()}</span>
                  </div>
                  <h3 className="text-[18px] font-bold text-slate-900">{job.service}</h3>
                </div>
                <div className="text-right">
                  <p className="text-[12px] text-slate-500 font-medium mb-0.5">Estimated Payout</p>
                  <p className="text-[20px] font-bold text-[#16A34A]">₹{job.total_amount}</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mb-6 bg-slate-50 p-3 rounded-[8px]">
                <div className="flex items-start gap-2 text-[14px] text-slate-700">
                  <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <span>Customer Address (Masked)</span>
                </div>
                <div className="flex items-start gap-2 text-[14px] text-slate-700">
                  <Clock className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <span>{job.scheduled_time ? new Date(job.scheduled_time).toLocaleString() : 'ASAP'}</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1 text-slate-600">
                  Decline
                </Button>
                <Button variant="primary" className="flex-1 bg-[#2563EB] hover:bg-blue-700">
                  Accept Job
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {!isLoading && activeTab === "active" && activeJobs.length === 0 && (
          <div className="p-8 text-center text-slate-500">No active jobs.</div>
        )}

        {!isLoading && activeTab === "active" && activeJobs.map((job) => (
          <Card key={job.id} className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-[18px] font-bold text-slate-900">{job.service?.name || job.service || 'Assigned Job'}</h3>
                 <span className="bg-purple-100 text-purple-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">{job.status.replace('_', ' ')}</span>
               </div>
               <div className="text-[14px] text-slate-500 mb-6 flex justify-between items-center">
                 <span>ID: #{job.id.substring(0,8)}</span>
                 <span className="font-bold text-slate-800">₹{job.total_price || job.total_amount}</span>
               </div>
               
               {job.status === 'scheduled' && (
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2">
                   <p className="text-sm font-medium text-slate-700 mb-2">Customer Start OTP required</p>
                   <div className="flex gap-2">
                     <input 
                       type="text" 
                       maxLength={4} 
                       value={verifyingId === job.id ? otpInput : ""} 
                       onChange={(e) => { setVerifyingId(job.id); setOtpInput(e.target.value) }}
                       placeholder="0000" 
                       className="flex-1 bg-white border border-slate-300 rounded-lg px-3 text-center tracking-[0.5em] font-bold"
                     />
                     <Button 
                       onClick={() => verifyOtp(job.id, 'start')} 
                       disabled={verifyingId === job.id && otpInput.length < 4}
                       variant="primary" 
                       className="bg-[#2563EB] hover:bg-blue-700 whitespace-nowrap"
                     >
                       Start Job
                     </Button>
                   </div>
                 </div>
               )}

               {job.status === 'in_progress' && (
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2">
                   <p className="text-sm font-medium text-slate-700 mb-2">Customer End OTP required</p>
                   <div className="flex gap-2">
                     <input 
                       type="text" 
                       maxLength={4} 
                       value={verifyingId === job.id ? otpInput : ""} 
                       onChange={(e) => { setVerifyingId(job.id); setOtpInput(e.target.value) }}
                       placeholder="0000" 
                       className="flex-1 bg-white border border-slate-300 rounded-lg px-3 text-center tracking-[0.5em] font-bold"
                     />
                     <Button 
                       onClick={() => verifyOtp(job.id, 'end')} 
                       disabled={verifyingId === job.id && otpInput.length < 4}
                       variant="primary" 
                       className="bg-[#16A34A] hover:bg-green-700 whitespace-nowrap"
                     >
                       Complete Job
                     </Button>
                   </div>
                 </div>
               )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

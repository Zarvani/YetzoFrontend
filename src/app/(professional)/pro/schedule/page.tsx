import * as React from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Calendar as CalendarIcon, Clock, MoreHorizontal } from "lucide-react"

export default function ProfessionalSchedulePage() {
  const [jobs, setJobs] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchJobs() {
      const token = localStorage.getItem("yetzo_access_token")
      if (!token) return
      
      try {
        const { apiClient } = await import("@/lib/apiClient")
        const res = await apiClient<any>("/bookings/", { token })
        setJobs(res.data)
      } catch (err) {
        console.error("Failed to load professional jobs", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchJobs()
  }, [])
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight">My Schedule</h1>
          <p className="text-[15px] text-[#475569] mt-1">Manage your upcoming jobs and availability.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Calendar Side */}
        <div className="md:col-span-1">
          <Card className="border-slate-200 shadow-sm sticky top-6">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">October 2026</h3>
                <div className="flex gap-2">
                  <button className="h-6 w-6 rounded bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200">{"<"}</button>
                  <button className="h-6 w-6 rounded bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200">{">"}</button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center text-[12px] font-semibold text-slate-400 mb-2">
                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center text-[13px] font-medium text-slate-700">
                {/* Dummy Dates */}
                <div className="text-slate-300">27</div><div className="text-slate-300">28</div><div className="text-slate-300">29</div><div className="text-slate-300">30</div>
                {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map((d) => (
                  <div key={d} className={`h-8 w-8 flex items-center justify-center rounded-full mx-auto cursor-pointer ${d === 8 ? 'bg-[#2563EB] text-white shadow-md' : 'hover:bg-slate-100'}`}>
                    {d}
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4">
                <h4 className="text-[14px] font-bold text-slate-900 mb-3">Availability Settings</h4>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-slate-600">Accepting Instant Jobs</span>
                  <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule Side */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <h3 className="text-[18px] font-bold text-slate-900 mb-2">Today's Jobs</h3>
          
          {isLoading && <div className="p-4 text-center text-slate-500">Loading schedule...</div>}
          
          {!isLoading && jobs.length === 0 && (
            <div className="p-4 text-center text-slate-500">No jobs scheduled for today.</div>
          )}

          {!isLoading && jobs.map((job) => (
            <Card key={job.id} className={`border-l-4 ${job.status === 'COMPLETED' ? 'border-l-green-500 opacity-70' : 'border-l-[#2563EB] shadow-sm'}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center justify-center w-20 shrink-0 border-r border-slate-100 pr-4">
                    <span className="text-[14px] font-bold text-slate-900">
                      {job.scheduled_time ? new Date(job.scheduled_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'ASAP'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-[16px] font-bold text-slate-900 mb-1">{job.service}</h4>
                    <p className="text-[13px] text-slate-500 flex items-center gap-1">
                      {job.status.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-700">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </CardContent>
            </Card>
          ))}
          
        </div>
      </div>
    </div>
  )
}

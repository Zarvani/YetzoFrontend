import * as React from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Search, Filter } from "lucide-react"
import { ProTable } from "@/components/admin/ProTable"

export default function AdminProfessionalsPage() {
  const [pros, setPros] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchAdminPros() {
      const token = localStorage.getItem("yetzo_access_token")
      if (!token) return
      
      try {
        const { apiClient } = await import("@/lib/apiClient")
        const res = await apiClient<any>("/professionals/", { token })
        setPros(res.data)
      } catch (err) {
        console.error("Failed to load admin professionals", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAdminPros()
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Professionals Fleet</h1>
          <p className="text-[15px] text-slate-500 mt-1">Manage onboarding, ratings, and active statuses.</p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Name, Phone, or City..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#2563EB] transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm font-semibold hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4" /> Filters
          </button>
        </div>
        
        <ProTable pros={pros} isLoading={isLoading} />
      </Card>
    </div>
  )
}

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { ShieldAlert, AlertTriangle, Fingerprint, Lock } from "lucide-react"

export default function AdminAuditPage() {
  const [logs, setLogs] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchAuditLogs() {
      const token = localStorage.getItem("yetzo_access_token")
      if (!token) return
      
      try {
        const { apiClient } = await import("@/lib/apiClient")
        const res = await apiClient<any>("/audit/logs/", { token })
        setLogs(res.data)
      } catch (err) {
        console.error("Failed to load audit logs", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAuditLogs()
  }, [])
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Fraud & Audit Logs</h1>
          <p className="text-[15px] text-slate-500 mt-1">Monitor suspicious activities and system integrity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
             <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-red-800">High Risk Alerts</h3>
                <ShieldAlert className="h-6 w-6 text-red-600" />
             </div>
             <p className="text-4xl font-bold text-red-900">12</p>
             <p className="text-sm text-red-700 mt-2">Requires immediate action</p>
          </CardContent>
        </Card>
        
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
             <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-orange-800">Suspicious Logins</h3>
                <Fingerprint className="h-6 w-6 text-orange-600" />
             </div>
             <p className="text-4xl font-bold text-orange-900">34</p>
             <p className="text-sm text-orange-700 mt-2">In the last 24 hours</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardContent className="p-6">
             <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-800">System Locks</h3>
                <Lock className="h-6 w-6 text-slate-600" />
             </div>
             <p className="text-4xl font-bold text-slate-900">3</p>
             <p className="text-sm text-slate-500 mt-2">Auto-suspended accounts</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm mt-4">
        <CardHeader className="border-b border-slate-100 bg-slate-50">
          <CardTitle>Recent Audit Trail</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-slate-100">
            {isLoading && <li className="p-4 text-slate-500 text-center">Loading audit logs...</li>}
            
            {!isLoading && logs.length === 0 && (
              <li className="p-4 text-slate-500 text-center">No audit logs found.</li>
            )}
            
            {!isLoading && logs.map((log) => (
              <li key={log.id} className="p-4 hover:bg-slate-50 flex items-start gap-4">
                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${log.actor_type === 'ADMIN' ? 'bg-orange-500' : 'bg-slate-300'}`}></div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-[14px] font-semibold text-slate-900">{log.action}</p>
                    <span className="text-[12px] text-slate-500 whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-[13px] text-slate-500 mt-1">
                    Actor ID: {log.actor_id || "System"} • Entity: {log.entity_type} ({log.entity_id})
                  </p>
                  {log.reason && <p className="text-[12px] text-slate-400 mt-1">Reason: {log.reason}</p>}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

import * as React from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Bell, CheckCircle2, AlertTriangle, MessageSquare } from "lucide-react"

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchNotifications = React.useCallback(async () => {
    const token = localStorage.getItem("yetzo_access_token")
    if (!token) return
    
    try {
      const { apiClient } = await import("@/lib/apiClient")
      const res = await apiClient<any>("/notifications/", { token })
      setNotifications(res.data)
    } catch (err) {
      console.error("Failed to load notifications", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const markAllAsRead = async () => {
    const token = localStorage.getItem("yetzo_access_token")
    if (!token) return
    
    try {
      const { apiClient } = await import("@/lib/apiClient")
      await apiClient("/notifications/read-all/", { token, method: "POST" })
      fetchNotifications()
    } catch (err) {
      console.error("Failed to mark all as read", err)
    }
  }

  const getIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'info': return <Bell className="h-5 w-5 text-blue-600" />
      case 'alert': return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'message': return <MessageSquare className="h-5 w-5 text-purple-600" />
      default: return <Bell className="h-5 w-5 text-slate-600" />
    }
  }

  const getBg = (type: string) => {
    switch(type) {
      case 'success': return 'bg-green-100'
      case 'info': return 'bg-blue-100'
      case 'alert': return 'bg-red-100'
      case 'message': return 'bg-purple-100'
      default: return 'bg-slate-100'
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight">Notifications</h1>
          <p className="text-[15px] text-[#475569] mt-1">Stay updated with your bookings and account.</p>
        </div>
        <button onClick={markAllAsRead} className="text-[13px] font-semibold text-[#2563EB] hover:underline">Mark all as read</button>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading && <div className="text-slate-500">Loading notifications...</div>}
        
        {!isLoading && notifications.length === 0 && (
          <div className="text-slate-500 p-8 border border-dashed rounded-[12px] text-center">
            You're all caught up! No notifications.
          </div>
        )}

        {!isLoading && notifications.map((notif) => (
          <Card key={notif.id} className={`border-l-4 ${!notif.is_read ? 'border-l-[#2563EB] bg-blue-50/20' : 'border-l-transparent'} transition-colors cursor-pointer hover:bg-slate-50`}>
            <CardContent className="p-4 flex items-start gap-4">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${getBg(notif.data_payload?.type || 'info')}`}>
                {getIcon(notif.data_payload?.type || 'info')}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-[15px] ${!notif.is_read ? 'font-bold text-[#0F172A]' : 'font-medium text-[#334155]'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[12px] text-slate-500 whitespace-nowrap">{new Date(notif.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-[14px] text-slate-600">{notif.body}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

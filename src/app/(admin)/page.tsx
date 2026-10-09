import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { MapPin, Users, Briefcase, Activity } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-[28px] font-bold tracking-tight text-slate-900">Operations Overview</h1>
        <p className="text-[15px] text-slate-500 mt-1">Real-time metrics for all active cities.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { title: "Active Bookings", value: "1,284", icon: Briefcase, trend: "+14.5%", color: "text-blue-600", bg: "bg-blue-100" },
          { title: "Professionals Online", value: "432", icon: Users, trend: "+2.1%", color: "text-green-600", bg: "bg-green-100" },
          { title: "Pending Dispatch", value: "28", icon: Activity, trend: "-5.4%", color: "text-orange-600", bg: "bg-orange-100" },
          { title: "Live Regions", value: "4", icon: MapPin, trend: "0%", color: "text-purple-600", bg: "bg-purple-100" },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="border-slate-200 shadow-sm rounded-lg">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                  </div>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${stat.bg}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className={`font-medium ${stat.trend.startsWith('+') ? 'text-green-600' : stat.trend.startsWith('-') ? 'text-red-600' : 'text-slate-500'}`}>
                    {stat.trend}
                  </span>
                  <span className="text-slate-500 ml-2">from last hour</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Live Dispatch Map Placeholder */}
        <div className="xl:col-span-2">
          <Card className="h-[500px] border-slate-200 shadow-sm flex flex-col">
            <CardHeader className="px-6 py-4 border-b border-slate-100">
              <CardTitle className="text-lg">Live Dispatch Map</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 relative bg-slate-100">
              {/* Map Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">MapBox / Google Maps Integration Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Required Queue */}
        <div className="xl:col-span-1">
          <Card className="h-[500px] border-slate-200 shadow-sm flex flex-col">
            <CardHeader className="px-6 py-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Action Required</CardTitle>
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">5 Critical</span>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto">
              <ul className="divide-y divide-slate-100">
                {[
                  { id: "YZ-8492A", issue: "Pro marked as 'Arrived' but GPS mismatch (>2km)", time: "4 mins ago", severity: "high" },
                  { id: "YZ-9102B", issue: "Customer requested cancellation (Post-dispatch)", time: "12 mins ago", severity: "high" },
                  { id: "YZ-3312C", issue: "Payment Failed for completed job", time: "22 mins ago", severity: "medium" },
                  { id: "YZ-1122D", issue: "Pro No-Show (15 mins past SLA)", time: "28 mins ago", severity: "high" },
                ].map((alert, i) => (
                  <li key={i} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-slate-900">{alert.id}</span>
                      <span className="text-xs text-slate-500">{alert.time}</span>
                    </div>
                    <p className={`text-sm ${alert.severity === 'high' ? 'text-red-600 font-medium' : 'text-slate-700'}`}>
                      {alert.issue}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}

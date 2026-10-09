import * as React from "react"
import { ShieldCheck, AlertTriangle, MoreHorizontal } from "lucide-react"

interface ProTableProps {
  pros: any[];
  isLoading: boolean;
}

export function ProTable({ pros, isLoading }: ProTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
          <tr>
            <th className="px-6 py-4">Pro ID</th>
            <th className="px-6 py-4">Name / Phone</th>
            <th className="px-6 py-4">City</th>
            <th className="px-6 py-4">Rating</th>
            <th className="px-6 py-4">Jobs Completed</th>
            <th className="px-6 py-4">KYC Status</th>
            <th className="px-6 py-4">Account Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {isLoading ? (
            <tr><td colSpan={8} className="p-4 text-center text-slate-500">Loading...</td></tr>
          ) : pros.length === 0 ? (
            <tr><td colSpan={8} className="p-4 text-center text-slate-500">No professionals found.</td></tr>
          ) : pros.map((pro) => (
            <tr key={pro.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-bold text-slate-900">{pro.id.split('-')[0].toUpperCase()}</td>
              <td className="px-6 py-4">
                <div className="font-semibold text-slate-900">{pro.user_data?.first_name} {pro.user_data?.last_name}</div>
                <div className="text-slate-500 text-xs mt-0.5">{pro.user_data?.phone_number || "No phone"}</div>
              </td>
              <td className="px-6 py-4">N/A</td>
              <td className="px-6 py-4">
                <span className={`font-bold ${!pro.rating ? 'text-slate-400' : Number(pro.rating) >= 4.5 ? 'text-green-600' : Number(pro.rating) < 4.0 ? 'text-red-600' : 'text-slate-700'}`}>
                  {pro.rating || "N/A"}
                </span>
              </td>
              <td className="px-6 py-4">{pro.total_jobs_completed || 0}</td>
              <td className="px-6 py-4">
                <div className={`flex items-center gap-1.5 text-xs font-semibold ${pro.kyc_status === 'VERIFIED' ? 'text-green-600' : 'text-orange-600'}`}>
                  {pro.kyc_status === 'VERIFIED' ? <ShieldCheck className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                  {pro.kyc_status}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                  pro.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {pro.is_active ? "Active" : "Suspended"}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-md hover:bg-slate-100">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

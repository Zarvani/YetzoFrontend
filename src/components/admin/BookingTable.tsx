import * as React from "react"
import { MoreHorizontal } from "lucide-react"

interface BookingTableProps {
  bookings: any[];
  isLoading: boolean;
}

export function BookingTable({ bookings, isLoading }: BookingTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
          <tr>
            <th className="px-6 py-4">Booking ID</th>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Professional</th>
            <th className="px-6 py-4">Service</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {isLoading ? (
            <tr><td colSpan={8} className="p-4 text-center text-slate-500">Loading...</td></tr>
          ) : bookings.length === 0 ? (
            <tr><td colSpan={8} className="p-4 text-center text-slate-500">No bookings found.</td></tr>
          ) : bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-bold text-slate-900">{booking.booking_reference || booking.id.split('-')[0].toUpperCase()}</td>
              <td className="px-6 py-4">{booking.customer}</td>
              <td className="px-6 py-4">
                {!booking.professional ? (
                  <span className="text-slate-400 italic">Unassigned</span>
                ) : booking.professional}
              </td>
              <td className="px-6 py-4">{booking.service}</td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                  booking.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                  booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                  booking.status === 'SEARCHING' ? 'bg-blue-100 text-blue-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {booking.status.replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-4 font-semibold text-slate-900">₹{booking.total_amount}</td>
              <td className="px-6 py-4 text-slate-500">{new Date(booking.created_at).toLocaleDateString()}</td>
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

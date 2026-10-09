"use client"

import * as React from "react"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"

interface ServiceTableProps {
  services: any[];
  isLoading: boolean;
  onEdit: (service: any) => void;
  onDelete: (serviceId: string) => void;
}

export function ServiceTable({ services, isLoading, onEdit, onDelete }: ServiceTableProps) {
  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading catalog...</div>
  }

  if (services.length === 0) {
    return <div className="p-8 text-center text-slate-500">No services found in the catalog.</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
          <tr>
            <th className="px-6 py-4">Service Name</th>
            <th className="px-6 py-4">Base Price</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Created</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {services.map((service) => (
            <tr key={service.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-bold text-slate-900">{service.name}</div>
                <div className="text-[12px] text-slate-500 truncate max-w-[300px]">{service.description}</div>
              </td>
              <td className="px-6 py-4 font-semibold text-slate-900">₹{service.base_price}</td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                  service.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                  service.status === 'DRAFT' ? 'bg-orange-100 text-orange-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {service.status}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-500">{new Date(service.created_at).toLocaleDateString()}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => onEdit(service)} className="text-[#2563EB] hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-md transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={() => onDelete(service.id)} className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-md transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

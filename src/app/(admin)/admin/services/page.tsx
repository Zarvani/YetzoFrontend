"use client"
import * as React from "react"
import { Search, Plus, Filter, MoreVertical, Edit, Trash } from "lucide-react"
import { ServiceForm } from "@/components/forms/ServiceForm"

export default function AdminServicesPage() {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState<any>(null);

  // Mock data for UI demonstration
  const services = [
    { id: "1", name: "AC Deep Cleaning", category: "AC Repair", price: 499, status: "ACTIVE" },
    { id: "2", name: "Premium Home Cleaning", category: "Cleaning", price: 1299, status: "ACTIVE" },
    { id: "3", name: "Plumbing Basics", category: "Plumbing", price: 299, status: "DRAFT" },
  ];

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[16px] shadow-sm flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-[#0F172A]">Service Catalog</h1>
          <p className="text-[13px] text-[#64748B] mt-0.5">Manage platform services, pricing, and variants.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input 
              type="text" 
              placeholder="Search services..." 
              className="w-[250px] bg-[#F8FAFC] border border-[#CBD5E1] pl-9 pr-4 py-2 rounded-[8px] text-[13px] focus:outline-none focus:border-[#2563EB]"
            />
          </div>
          <button className="h-[38px] px-3 bg-white border border-[#CBD5E1] rounded-[8px] text-[#0F172A] flex items-center justify-center hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4" />
          </button>
          <button 
            onClick={() => { setSelectedService(null); setIsFormOpen(true); }}
            className="h-[38px] px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-[8px] text-[13px] font-bold transition-colors flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> Add Service
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Table Area */}
        <div className={`flex-1 overflow-auto transition-all ${isFormOpen ? 'w-2/3 border-r border-[#E2E8F0]' : 'w-full'}`}>
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8FAFC] sticky top-0 z-10">
              <tr>
                <th className="py-3 px-6 text-[12px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Service Name</th>
                <th className="py-3 px-6 text-[12px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Category</th>
                <th className="py-3 px-6 text-[12px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Base Price</th>
                <th className="py-3 px-6 text-[12px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Status</th>
                <th className="py-3 px-6 text-[12px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[14px]">
              {services.map((srv) => (
                <tr key={srv.id} className="border-b border-[#E2E8F0] hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#0F172A]">{srv.name}</td>
                  <td className="py-4 px-6 text-[#475569]">{srv.category}</td>
                  <td className="py-4 px-6 font-medium text-[#0F172A]">₹{srv.price}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                      srv.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {srv.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => { setSelectedService(srv); setIsFormOpen(true); }}
                        className="p-1.5 text-[#64748B] hover:text-[#2563EB] hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Form Slide-in Area */}
        {isFormOpen && (
          <div className="w-[400px] bg-[#F8FAFC] flex-shrink-0 flex flex-col h-full overflow-y-auto">
            <div className="p-5 border-b border-[#E2E8F0] bg-white flex items-center justify-between sticky top-0 z-10">
              <h2 className="text-[16px] font-bold text-[#0F172A]">
                {selectedService ? 'Edit Service' : 'Create New Service'}
              </h2>
            </div>
            <div className="p-5">
              <ServiceForm 
                initialData={selectedService} 
                onSubmit={(data) => {
                  console.log("Saved", data);
                  setIsFormOpen(false);
                }} 
                onCancel={() => setIsFormOpen(false)} 
                isLoading={false} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

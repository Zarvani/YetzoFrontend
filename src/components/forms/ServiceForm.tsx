import * as React from "react"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

interface ServiceFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function ServiceForm({ initialData, onSubmit, onCancel, isLoading }: ServiceFormProps) {
  const [formData, setFormData] = React.useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    base_price: initialData?.base_price || "",
    status: initialData?.status || "ACTIVE",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="space-y-2">
        <label className="text-[13px] font-semibold text-slate-600 uppercase">Service Name</label>
        <Input required name="name" value={formData.name} onChange={handleChange} placeholder="e.g. AC Deep Cleaning" />
      </div>
      
      <div className="space-y-2">
        <label className="text-[13px] font-semibold text-slate-600 uppercase">Description</label>
        <textarea 
          required 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          className="w-full border border-slate-200 rounded-md p-3 text-sm focus:outline-none focus:border-[#2563EB] min-h-[100px]"
          placeholder="Detailed description of the service..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-slate-600 uppercase">Base Price (₹)</label>
          <Input required type="number" name="base_price" value={formData.base_price} onChange={handleChange} placeholder="e.g. 499" />
        </div>
        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-slate-600 uppercase">Status</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-md p-3 text-sm focus:outline-none focus:border-[#2563EB]"
          >
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update Service" : "Create Service"}
        </Button>
      </div>
    </form>
  )
}

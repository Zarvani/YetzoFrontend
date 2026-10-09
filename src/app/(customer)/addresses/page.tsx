import * as React from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { MapPin, Plus, Home, Briefcase, MoreVertical } from "lucide-react"
import { apiClient } from "@/lib/apiClient"

export default function AddressesPage() {
  const [addresses, setAddresses] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchAddresses() {
      const token = localStorage.getItem("yetzo_access_token")
      if (!token) return
      
      try {
        const res = await apiClient<any>("/locations/addresses/", { token })
        setAddresses(res.data)
      } catch (err) {
        console.error("Failed to load addresses", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAddresses()
  }, [])
  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight">Saved Addresses</h1>
          <p className="text-[15px] text-[#475569] mt-1">Manage where you receive your services.</p>
        </div>
        <Button variant="primary" className="gap-2">
          <Plus className="h-4 w-4" /> Add New
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {isLoading && <div className="text-slate-500">Loading addresses...</div>}
        
        {!isLoading && addresses.length === 0 && (
          <div className="text-slate-500 p-4 border border-dashed rounded-[12px] w-full text-center md:col-span-2">
            No saved addresses found. Click "Add New" to create one.
          </div>
        )}

        {!isLoading && addresses.map((addr) => (
          <Card key={addr.id} className={`${addr.is_default ? 'border-[#2563EB] bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'} transition-colors relative`}>
            <div className="absolute top-4 right-4">
              <button className="text-slate-400 hover:text-slate-700">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${addr.is_default ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {addr.address_type === 'HOME' ? <Home className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />}
                </div>
                <span className="font-bold text-[15px] text-[#0F172A] capitalize">{addr.address_type.toLowerCase()}</span>
                {addr.is_default && (
                  <span className="ml-2 text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded uppercase tracking-wider">Default</span>
                )}
              </div>
              
              <p className="text-[14px] text-slate-700 font-medium mb-1">{addr.landmark || "Customer Address"}</p>
              <p className="text-[14px] text-slate-500 leading-relaxed mb-4">
                {addr.address_line_1}<br />
                {addr.address_line_2 && <>{addr.address_line_2}<br /></>}
                {addr.city}, {addr.pincode}
              </p>
              
              <div className="flex gap-4">
                <button className="text-[13px] font-semibold text-[#2563EB] hover:underline">Edit</button>
                {!addr.is_default && (
                  <button className="text-[13px] font-semibold text-slate-500 hover:text-slate-900">Set as Default</button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

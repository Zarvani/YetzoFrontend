"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { User, Mail, Phone, ShieldCheck } from "lucide-react"

export default function CustomerProfilePage() {
  const [isEditing, setIsEditing] = React.useState(false)

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight">My Profile</h1>
        <Button variant={isEditing ? "primary" : "secondary"} onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <Card>
        <CardContent className="p-6 md:p-8">
          
          <div className="flex items-center gap-6 mb-10">
            <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-sm relative">
              <User className="h-10 w-10 text-[#2563EB]" />
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-[#0F172A] text-white p-1.5 rounded-full shadow-md text-xs hover:bg-[#2563EB] transition-colors">
                  Edit
                </button>
              )}
            </div>
            <div>
              <h2 className="text-[22px] font-bold text-[#0F172A]">Customer Name</h2>
              <p className="text-[#64748B] flex items-center gap-1 mt-1">
                <ShieldCheck className="h-4 w-4 text-[#16A34A]" /> Verified Account
              </p>
            </div>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-[#475569] uppercase tracking-wider">First Name</label>
              <Input defaultValue="Rahul" disabled={!isEditing} className="h-12" />
            </div>
            
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-[#475569] uppercase tracking-wider">Last Name</label>
              <Input defaultValue="Kumar" disabled={!isEditing} className="h-12" />
            </div>
            
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-[#475569] uppercase tracking-wider flex items-center gap-2">
                <Phone className="h-4 w-4" /> Phone Number
              </label>
              <Input defaultValue="+91 99999 99999" disabled className="h-12 bg-slate-50 text-slate-500" />
              <p className="text-[11px] text-slate-400">Phone number cannot be changed.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-[#475569] uppercase tracking-wider flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email Address
              </label>
              <Input defaultValue="rahul@example.com" disabled={!isEditing} className="h-12" />
            </div>
          </form>

        </CardContent>
      </Card>

      <div className="mt-4">
        <h3 className="text-[18px] font-bold text-[#0F172A] mb-4">Danger Zone</h3>
        <Card className="border-red-100 bg-red-50/50">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-red-700">Delete Account</h4>
              <p className="text-[14px] text-red-600/80 mt-1">Permanently remove your account and all data.</p>
            </div>
            <Button variant="danger">Delete</Button>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

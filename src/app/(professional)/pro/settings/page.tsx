"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export default function ProfessionalSettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight">App Settings</h1>
          <p className="text-[15px] text-[#475569] mt-1">Manage your account and preferences.</p>
        </div>
        <Button variant="primary">Save Changes</Button>
      </div>

      <Card className="border-slate-200">
        <CardContent className="p-6 md:p-8 flex flex-col gap-8">
          
          <div>
            <h3 className="text-[18px] font-bold text-[#0F172A] mb-4">Bank Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-slate-600 uppercase">Account Holder Name</label>
                <Input defaultValue="Rahul Kumar" />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-slate-600 uppercase">Account Number</label>
                <Input type="password" defaultValue="123456789012" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[13px] font-semibold text-slate-600 uppercase">IFSC Code</label>
                <Input defaultValue="HDFC0001234" />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-[18px] font-bold text-[#0F172A] mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-slate-900">SMS Alerts</h4>
                  <p className="text-[13px] text-slate-500">Receive an SMS when a new job arrives.</p>
                </div>
                <div className="w-10 h-6 bg-[#2563EB] rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-slate-900">WhatsApp Updates</h4>
                  <p className="text-[13px] text-slate-500">Receive payout and rating summaries on WhatsApp.</p>
                </div>
                <div className="w-10 h-6 bg-[#2563EB] rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

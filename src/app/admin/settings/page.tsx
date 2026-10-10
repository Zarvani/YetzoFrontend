"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Save } from "lucide-react"

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Platform Settings</h1>
          <p className="text-[15px] text-slate-500 mt-1">Configure global platform rules and fees.</p>
        </div>
        <Button className="bg-[#0B2D8F] hover:bg-blue-900 gap-2">
          <Save className="h-4 w-4" /> Save Changes
        </Button>
      </div>

      <div className="grid gap-6 mt-4">
        <Card className="border-slate-200">
          <CardHeader className="border-b border-slate-100 bg-slate-50">
            <CardTitle>Commission & Fees</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-slate-600 uppercase">Platform Fee (%)</label>
                <Input defaultValue="15" type="number" />
                <p className="text-[12px] text-slate-500">Percentage taken from professional's payout.</p>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-slate-600 uppercase">Trust & Safety Fee (₹)</label>
                <Input defaultValue="49" type="number" />
                <p className="text-[12px] text-slate-500">Fixed amount charged to customer per booking.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="border-b border-slate-100 bg-slate-50">
            <CardTitle>Surge Pricing</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-slate-900">Enable Automated Surge</h4>
                <p className="text-[13px] text-slate-500">Automatically increase prices during high demand / low supply.</p>
              </div>
              <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-slate-600 uppercase">Max Surge Multiplier</label>
                <Input defaultValue="1.5" type="number" step="0.1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { UploadCloud, CheckCircle2 } from "lucide-react"

export default function ProfessionalOnboardingPage() {
  const [step, setStep] = React.useState(1)

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-bold text-[#0F172A] tracking-tight">Professional Onboarding</h1>
          <p className="text-slate-500 mt-2">Complete your KYC to start receiving jobs.</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-[#2563EB] text-white' : 'bg-slate-200 text-slate-500'}`}>
                {s}
              </div>
              {s < 3 && <div className={`h-1 w-12 rounded-full ${step > s ? 'bg-[#2563EB]' : 'bg-slate-200'}`}></div>}
            </React.Fragment>
          ))}
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-8">
            {step === 1 && (
              <div className="flex flex-col gap-6">
                <h2 className="text-[20px] font-bold text-slate-900">Personal Details</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[13px] font-semibold text-slate-600 uppercase mb-1 block">Legal Full Name</label>
                    <Input placeholder="As per Aadhar Card" />
                  </div>
                  <div>
                    <label className="text-[13px] font-semibold text-slate-600 uppercase mb-1 block">Phone Number</label>
                    <Input placeholder="+91" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[13px] font-semibold text-slate-600 uppercase mb-1 block">Current Address</label>
                    <Input placeholder="Full address" />
                  </div>
                </div>
                <Button variant="primary" className="w-full mt-4" onClick={() => setStep(2)}>Next Step</Button>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-6">
                <h2 className="text-[20px] font-bold text-slate-900">Document Upload (KYC)</h2>
                
                <div className="border-2 border-dashed border-slate-300 rounded-[12px] p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                  <UploadCloud className="h-12 w-12 text-[#2563EB] mx-auto mb-4" />
                  <h3 className="font-bold text-slate-900 mb-1">Upload Aadhar Card (Front & Back)</h3>
                  <p className="text-sm text-slate-500 mb-4">PNG, JPG or PDF (Max 5MB)</p>
                  <Button variant="secondary" className="bg-white">Browse Files</Button>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-[12px] p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                  <UploadCloud className="h-12 w-12 text-[#2563EB] mx-auto mb-4" />
                  <h3 className="font-bold text-slate-900 mb-1">Upload PAN Card</h3>
                  <p className="text-sm text-slate-500 mb-4">PNG, JPG or PDF (Max 5MB)</p>
                  <Button variant="secondary" className="bg-white">Browse Files</Button>
                </div>

                <div className="flex gap-4 mt-4">
                  <Button variant="secondary" className="w-full" onClick={() => setStep(1)}>Back</Button>
                  <Button variant="primary" className="w-full" onClick={() => setStep(3)}>Submit Documents</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-[24px] font-bold text-slate-900 mb-2">Documents Submitted</h2>
                <p className="text-slate-500 max-w-sm mb-8">
                  Our verification team is reviewing your documents. This usually takes 24-48 hours. We will notify you once you are approved to take jobs.
                </p>
                <Button variant="primary" onClick={() => window.location.href = '/pro'}>Go to Dashboard</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

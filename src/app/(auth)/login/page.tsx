"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { apiClient } from "@/lib/apiClient"

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = React.useState<1 | 2>(1)
  const [phoneNumber, setPhoneNumber] = React.useState("")
  const [otp, setOtp] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await apiClient<any>("/api/v1/auth/otp/send/", {
        method: "POST",
        body: JSON.stringify({ phone_number: phoneNumber })
      })

      if (response.success) {
        setStep(2)
      } else {
        setError(response.error || "Failed to send OTP.")
      }
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please check your number.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phoneNumber, otp: otp })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Token is now securely stored in HttpOnly cookies by the Next.js API
        router.push("/profile")
      } else {
        setError(data.error || data.detail || "Invalid OTP.")
      }
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col w-full">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight mb-2">
          {step === 1 ? "Welcome back" : "Verify your number"}
        </h1>
        <p className="text-[15px] text-[#475569]">
          {step === 1 
            ? "Enter your phone number to log in." 
            : `Enter the 6-digit code sent to ${phoneNumber}`}
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-[8px] bg-red-50 p-3 text-[14px] text-red-600 border border-red-100">
          {error}
        </div>
      )}

      {step === 1 ? (
        <form className="space-y-5" onSubmit={handleSendOTP}>
          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="text-[14px] font-medium text-[#0F172A]">
              Phone Number
            </label>
            <Input 
              id="phoneNumber" 
              type="tel" 
              placeholder="+91 9999999999" 
              autoComplete="tel" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <Button variant="primary" className="w-full mt-2" type="submit" isLoading={isLoading}>
            Send OTP
          </Button>
        </form>
      ) : (
        <form className="space-y-5" onSubmit={handleVerifyOTP}>
          <div className="space-y-2">
            <label htmlFor="otp" className="text-[14px] font-medium text-[#0F172A]">
              6-Digit OTP Code
            </label>
            <Input 
              id="otp" 
              type="text" 
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              disabled={isLoading}
              required
            />
          </div>

          <Button variant="primary" className="w-full mt-2" type="submit" isLoading={isLoading}>
            Verify & Log in
          </Button>
          
          <button 
            type="button" 
            onClick={() => setStep(1)} 
            className="w-full text-center text-[13px] font-medium text-[#64748B] hover:text-[#0F172A] mt-4"
          >
            Change Phone Number
          </button>
        </form>
      )}

      {step === 1 && (
        <>
          <div className="mt-8 flex items-center justify-center">
            <div className="h-px bg-[#E2E8F0] flex-1"></div>
            <span className="px-4 text-[13px] font-medium text-[#64748B]">OR</span>
            <div className="h-px bg-[#E2E8F0] flex-1"></div>
          </div>

          <div className="mt-8 space-y-3">
            <Button variant="secondary" className="w-full" type="button">
              Continue with Google
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { apiClient } from "@/lib/apiClient"

export default function RegisterPage() {
  const router = useRouter()
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        phone,
        email: email || undefined,
        // Typically registration also needs a password or uses OTP
        // Assuming the backend handles initial registration and sends OTP
      }

      await apiClient("/auth/register/", {
        method: "POST",
        body: payload
      })
      
      // Redirect to OTP verification or login
      router.push("/login?registered=true")
    } catch (err: any) {
      setError(err.message || "Registration failed. Please check your details.")
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="flex flex-col w-full">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight mb-2">
          Create an account
        </h1>
        <p className="text-[15px] text-[#475569]">
          Enter your details to get started with Yetzo.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-[8px] bg-red-50 p-3 text-[14px] text-red-600 border border-red-100">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleRegister}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-[14px] font-medium text-[#0F172A]">
              First Name
            </label>
            <Input 
              id="firstName" 
              type="text" 
              placeholder="Rahul" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading}
              required 
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-[14px] font-medium text-[#0F172A]">
              Last Name
            </label>
            <Input 
              id="lastName" 
              type="text" 
              placeholder="Kumar" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isLoading}
              required 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-[14px] font-medium text-[#0F172A]">
            Phone Number
          </label>
          <Input 
            id="phone" 
            type="tel" 
            placeholder="+91 99999 99999" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isLoading}
            required 
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-[14px] font-medium text-[#0F172A]">
            Email (Optional)
          </label>
          <Input 
            id="email" 
            type="email" 
            placeholder="rahul@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <Button variant="primary" className="w-full mt-4" type="submit" isLoading={isLoading}>
          Continue
        </Button>
      </form>

      <div className="mt-8 text-center text-[14px] text-[#475569]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
          Log in
        </Link>
      </div>
      
      <p className="mt-12 text-center text-[12px] text-[#64748B] leading-relaxed">
        By clicking continue, you agree to our <br />
        <Link href="/terms" className="underline hover:text-[#0F172A]">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-[#0F172A]">Privacy Policy</Link>.
      </p>
    </div>
  )
}

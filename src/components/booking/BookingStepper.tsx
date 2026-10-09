import * as React from "react"
import { Check } from "lucide-react"

interface BookingStepperProps {
  currentStep: number
}

export function BookingStepper({ currentStep }: BookingStepperProps) {
  const steps = [
    { id: 1, name: "Details" },
    { id: 2, name: "Schedule" },
    { id: 3, name: "Address" },
    { id: 4, name: "Payment" }
  ]

  return (
    <div className="mb-8">
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
              <div className="flex items-center">
                <div className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                  step.id < currentStep 
                    ? 'bg-[#2563EB] hover:bg-[#1D4ED8]' 
                    : step.id === currentStep 
                      ? 'border-2 border-[#2563EB] bg-white' 
                      : 'border-2 border-[#E2E8F0] bg-white'
                }`}>
                  {step.id < currentStep ? (
                    <Check className="h-4 w-4 text-white" aria-hidden="true" />
                  ) : (
                    <span className={`text-[13px] font-bold ${
                      step.id === currentStep ? 'text-[#2563EB]' : 'text-[#64748B]'
                    }`}>
                      {step.id}
                    </span>
                  )}
                </div>
                {stepIdx !== steps.length - 1 ? (
                  <div className={`absolute top-4 left-0 -ml-px mt-0.5 h-0.5 w-full bg-[#E2E8F0] ${
                    step.id < currentStep ? 'bg-[#2563EB]' : ''
                  }`} />
                ) : null}
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-max">
                <span className={`text-[12px] font-semibold ${
                  step.id <= currentStep ? 'text-[#0F172A]' : 'text-[#64748B]'
                }`}>
                  {step.name}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}

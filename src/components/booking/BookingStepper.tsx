'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

interface BookingStepperProps {
  currentStep: number;
}

export function BookingStepper({ currentStep }: BookingStepperProps) {
  const router = useRouter();

  const steps = [
    { id: 1, name: 'Chores', path: '/customer/booking' },
    { id: 2, name: 'Timing', path: '/customer/booking/schedule' },
    { id: 3, name: 'Address', path: '/customer/booking/address' },
    { id: 4, name: 'Payment', path: '/customer/booking/payment' },
  ];

  return (
    <div className="mb-6 w-full max-w-xl mx-auto px-2 font-body">
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center justify-between">
          {steps.map((step, stepIdx) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isClickable = step.id <= currentStep;

            return (
              <li
                key={step.name}
                className={`relative flex-1 flex flex-col items-center ${
                  stepIdx !== steps.length - 1 ? 'after:content-[\'\'] after:w-full after:h-0.5 after:bg-slate-200 after:absolute after:top-3.5 after:left-1/2' : ''
                } ${isCompleted ? 'after:!bg-[#05AC5F]' : ''}`}
              >
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && router.push(step.path)}
                  className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-sm transition-all text-xs font-heading ${
                    isCompleted
                      ? 'bg-[#05AC5F] text-white cursor-pointer shadow-sm'
                      : isCurrent
                        ? 'border border-[#05AC5F] bg-white text-[#05AC5F] font-semibold ring-2 ring-emerald-50'
                        : 'border border-slate-200 bg-white text-slate-400 cursor-not-allowed'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5 stroke-[3]" aria-hidden="true" />
                  ) : (
                    <span>0{step.id}</span>
                  )}
                </button>
                <span
                  className={`mt-1.5 text-[10px] uppercase tracking-wider font-heading transition-colors ${
                    isCurrent ? 'text-slate-900 font-semibold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                  }`}
                >
                  {step.name}
                </span>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

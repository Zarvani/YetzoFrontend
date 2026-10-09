"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayButtonProps {
  bookingId: string;
  amount: number;
}

export function RazorpayButton({ bookingId, amount }: RazorpayButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const handlePayment = async () => {
    setIsLoading(true);
    setFeedback(null);
    
    try {
      // 1. Initialize Order in Backend
      interface PaymentInitResponse {
        success: boolean;
        error?: string;
        data?: {
          provider_order_id: string;
          razorpay_key_id: string;
          amount: number;
          currency: string;
        };
      }
      
      const response = (await apiClient('/api/v1/payments/initiate/', {
        method: 'POST',
        body: JSON.stringify({
          booking_id: bookingId,
          payment_method: 'CARD'
        })
      })) as PaymentInitResponse;

      if (!response.success) {
        setFeedback({ type: 'error', message: "Payment initialization failed: " + response.error });
        setIsLoading(false);
        return;
      }

      if (!response.data) {
        setFeedback({ type: 'error', message: "Invalid response from payment gateway." });
        setIsLoading(false);
        return;
      }

      const { provider_order_id, razorpay_key_id, amount: orderAmount, currency } = response.data;

      // 2. Load Razorpay Script dynamically if not already loaded
      const loadRazorpayScript = () => {
        return new Promise((resolve) => {
          if (window.Razorpay) {
            resolve(true);
            return;
          }
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const res = await loadRazorpayScript();
      if (!res) {
        setFeedback({ type: 'error', message: "Payment gateway failed to load. Please check your connection." });
        setIsLoading(false);
        return;
      }

      // 3. Open Razorpay Checkout Widget
      const options = {
        key: razorpay_key_id,
        amount: orderAmount.toString(),
        currency: currency,
        name: "Yetzo Services",
        description: "Service Booking Payment",
        order_id: provider_order_id,
        handler: async function (response: any) {
          // Success handler - Payment captured by Razorpay, waiting for webhook
          setFeedback({ type: 'success', message: "Payment Successful! Redirecting..." });
          setTimeout(() => {
            router.push('/booking/confirmation');
          }, 1500);
        },
        prefill: {
          name: "Yetzo Customer",
          email: "customer@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#2563EB"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error("Payment error:", error);
      setFeedback({ type: 'error', message: "An unexpected error occurred during payment." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-3">
      {feedback && (
        <div className={`px-4 py-2.5 rounded-[8px] text-[13px] font-medium flex items-center gap-2 max-w-sm ${
          feedback.type === 'error' 
            ? 'bg-red-50 text-red-600 border border-red-100' 
            : 'bg-green-50 text-green-600 border border-green-100'
        }`}>
          {feedback.type === 'error' ? (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {feedback.message}
        </div>
      )}
      <button 
        onClick={handlePayment} 
        disabled={isLoading || feedback?.type === 'success'}
        className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-3.5 rounded-[10px] text-[15px] font-bold transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Secure Payment...
          </>
        ) : (
          `Pay ₹${amount}`
        )}
      </button>
    </div>
  );
}

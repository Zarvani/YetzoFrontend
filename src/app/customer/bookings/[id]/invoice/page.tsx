'use client';

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Download, Printer } from "lucide-react"
import { apiClient } from "@/lib/apiClient"
import { motion } from "framer-motion"

export default function BookingInvoicePage({ params }: { params: { id: string } }) {
  const [invoice, setInvoice] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchInvoice = async () => {
      try {
        // Fetch invoice or booking details for invoice rendering
        const res = await apiClient<any>(`bookings/${params.id}/`);
        setInvoice(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoice();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Generating Invoice...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4">
      <div className="max-w-[700px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href={`/customer/bookings/${params.id}`} className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#CBD5E1] rounded-[8px] text-[13px] font-bold text-[#0F172A] hover:bg-slate-50 transition-colors">
              <Printer className="h-4 w-4" /> Print
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-[8px] text-[13px] font-bold hover:bg-[#1D4ED8] transition-colors">
              <Download className="h-4 w-4" /> Download PDF
            </button>
          </div>
        </div>

        {/* Invoice Paper */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[16px] shadow-sm border border-[#E2E8F0] p-8 md:p-12">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b border-[#E2E8F0] pb-8 mb-8">
            <div>
              <img src="/assets/images/logo.png" alt="Yetzo" className="h-[28px] w-auto object-contain mb-4" />
              <p className="text-[13px] text-[#64748B] leading-relaxed">
                Yetzo Home Services Pvt. Ltd.<br />
                Level 4, Corporate Park<br />
                Agra, UP 282002<br />
                GSTIN: 09AAACY8932J1Z3
              </p>
            </div>
            <div className="text-right">
              <h1 className="text-[24px] font-bold text-[#0F172A] mb-1">INVOICE</h1>
              <p className="text-[14px] font-bold text-[#64748B] mb-4">#INV-{invoice?.id?.substring(0,8).toUpperCase()}</p>
              
              <p className="text-[12px] text-[#64748B] font-bold uppercase tracking-wider mb-0.5">Date of Issue</p>
              <p className="text-[14px] font-medium text-[#0F172A]">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-10">
            <p className="text-[12px] text-[#64748B] font-bold uppercase tracking-wider mb-2">Billed To</p>
            <p className="text-[15px] font-bold text-[#0F172A]">{invoice?.customer?.user?.first_name || 'Customer'}</p>
            <p className="text-[14px] text-[#64748B] mt-1 leading-relaxed whitespace-pre-wrap">
              {invoice?.address?.address_line_1 || 'Address not provided'}
            </p>
          </div>

          {/* Line Items */}
          <div className="mb-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="py-3 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Description</th>
                  <th className="py-3 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-center">Qty</th>
                  <th className="py-3 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-[14px]">
                <tr className="border-b border-[#E2E8F0]">
                  <td className="py-4 font-medium text-[#0F172A]">
                    {invoice?.service?.name || 'Service Booking'}
                    <div className="text-[12px] text-[#64748B] font-normal mt-0.5">{invoice?.service?.category || 'Service'}</div>
                  </td>
                  <td className="py-4 text-center text-[#475569]">1</td>
                  <td className="py-4 text-right text-[#0F172A] font-medium">₹{invoice?.total_amount || '0.00'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-12">
            <div className="w-[280px]">
              <div className="flex justify-between py-2 text-[14px]">
                <span className="text-[#64748B]">Subtotal</span>
                <span className="text-[#0F172A] font-medium">₹{invoice?.total_amount || '0.00'}</span>
              </div>
              {invoice?.status === 'completed' && (
                <div className="flex justify-between py-2 text-[14px] text-[#16A34A]">
                  <span>Status</span>
                  <span className="font-medium">Paid</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-t-2 border-[#0F172A] mt-2">
                <span className="text-[16px] font-bold text-[#0F172A]">Total</span>
                <span className="text-[20px] font-bold text-[#0F172A]">₹{invoice?.total_amount || '0.00'}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-[#E2E8F0] pt-6 text-center">
            <p className="text-[12px] text-[#64748B]">
              This is a computer-generated invoice and does not require a physical signature.<br />
              Thank you for choosing Yetzo.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

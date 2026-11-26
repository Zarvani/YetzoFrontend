'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Printer, Download, CheckCircle2, ShieldCheck, Building } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

function BookingInvoiceContent() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient(`bookings/${bookingId}/`);
      setBooking(res?.data || res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-slate-600 font-medium">Generating Tax Invoice...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <p className="text-slate-600 mb-4">Invoice not found for this booking.</p>
        <Link href="/customer/bookings" className="text-blue-600 font-bold hover:underline">
          Back to Bookings
        </Link>
      </div>
    );
  }

  const subtotal = booking.base_price || 499;
  const discount = booking.discount || 0;
  const taxes = booking.taxes || Math.round((subtotal - discount) * 0.18);
  const cgst = Math.round(taxes / 2);
  const sgst = Math.round(taxes / 2);
  const platformFee = booking.platform_fee || 49;
  const total = booking.total_amount || (subtotal - discount + taxes + platformFee);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 print:p-0 print:bg-white">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between print:hidden">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Booking
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Print Invoice
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-xl text-xs font-bold hover:bg-[#1D4ED8] transition shadow-sm"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm print:border-none print:shadow-none print:p-4 text-slate-800">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-[#2563EB] tracking-tight">YETZO</span>
                <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                  TAX INVOICE
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Yetzo Technologies Private Limited</p>
              <p className="text-xs text-slate-500">GSTIN: 07AAACY1234A1Z5</p>
              <p className="text-xs text-slate-500">SAC Code: 9987 (Maintenance & Repair Services)</p>
            </div>

            <div className="text-right">
              <p className="text-xs font-mono font-bold text-slate-900">
                INVOICE #: INV-{booking.booking_reference}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Date: {booking.created_at ? new Date(booking.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
              </p>
              <p className="text-xs text-slate-500 font-mono">
                Booking Ref: {booking.booking_reference}
              </p>
            </div>
          </div>

          {/* Billed To / Service Location */}
          <div className="grid grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs">
            <div>
              <h4 className="font-bold text-slate-500 uppercase tracking-wider mb-1">Billed To (Customer)</h4>
              <p className="font-bold text-slate-900 text-sm">{booking.customer?.first_name || 'Valued Customer'}</p>
              <p className="text-slate-600">{booking.customer?.email || booking.customer?.phone || 'Customer Account'}</p>
              <p className="text-slate-600 mt-1">{booking.address?.address_line_1}</p>
              <p className="text-slate-600">{booking.address?.city}, {booking.address?.state} - {booking.address?.pincode}</p>
            </div>

            <div className="text-right">
              <h4 className="font-bold text-slate-500 uppercase tracking-wider mb-1">Service Execution Details</h4>
              <p className="font-medium text-slate-800">
                Service: <span className="font-bold">{booking.service?.name || 'On-Demand Service'}</span>
              </p>
              <p className="text-slate-600">
                Partner: {booking.assigned_professional?.user?.first_name || 'Yetzo Certified Expert'}
              </p>
              <p className="text-slate-600">
                Execution Date: {booking.scheduled_date || 'Instant Dispatch'}
              </p>
              <p className="text-slate-600">
                Payment Status: <span className="font-bold text-blue-600">{booking.status}</span>
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-6 border-b border-slate-200">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                  <th className="text-left py-2">Description</th>
                  <th className="text-center py-2">SAC</th>
                  <th className="text-center py-2">Qty</th>
                  <th className="text-right py-2">Rate (₹)</th>
                  <th className="text-right py-2">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 font-medium text-slate-800">
                    {booking.service?.name || 'Standard Service Package'}
                  </td>
                  <td className="py-3 text-center text-slate-500">9987</td>
                  <td className="py-3 text-center text-slate-600">1</td>
                  <td className="py-3 text-right text-slate-600 font-mono">₹{subtotal}</td>
                  <td className="py-3 text-right text-slate-800 font-bold font-mono">₹{subtotal}</td>
                </tr>

                {discount > 0 && (
                  <tr className="text-blue-700 bg-blue-50/40">
                    <td className="py-2.5 font-medium">
                      Multi-Chore Bundle / Membership Discount
                    </td>
                    <td className="py-2.5 text-center">-</td>
                    <td className="py-2.5 text-center">1</td>
                    <td className="py-2.5 text-right font-mono">-₹{discount}</td>
                    <td className="py-2.5 text-right font-bold font-mono">-₹{discount}</td>
                  </tr>
                )}

                <tr>
                  <td className="py-2.5 text-slate-600">Convenience & Platform Fee</td>
                  <td className="py-2.5 text-center text-slate-500">9987</td>
                  <td className="py-2.5 text-center text-slate-600">1</td>
                  <td className="py-2.5 text-right font-mono">₹{platformFee}</td>
                  <td className="py-2.5 text-right font-bold font-mono">₹{platformFee}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tax Breakdown & Totals */}
          <div className="py-6 flex justify-end">
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Amount:</span>
                <span className="font-mono">₹{subtotal - discount}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CGST (9%):</span>
                <span className="font-mono">₹{cgst}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SGST (9%):</span>
                <span className="font-mono">₹{sgst}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Amount Paid:</span>
                <span className="text-[#2563EB] font-mono">₹{total}</span>
              </div>
            </div>
          </div>

          {/* Warranty & Guarantee Stamp */}
          <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Covered by Yetzo 30-Day Yetzo Certified Standard Service Warranty</span>
            </div>
            <div className="text-right text-[11px]">
              Computer Generated Invoice. No Signature Required.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingInvoicePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-500 font-semibold text-sm">Loading invoice...</div>}>
      <BookingInvoiceContent />
    </Suspense>
  );
}

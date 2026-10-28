'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle, 
  Calendar, Clock, Upload, Camera, FileText, ChevronRight, Award
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

function BookingWarrantyContent() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submittedClaim, setSubmittedClaim] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [issueType, setIssueType] = useState('WORKMANSHIP');
  const [description, setDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredSlot, setPreferredSlot] = useState('MORNING');
  const [evidencePhoto, setEvidencePhoto] = useState<string>('');

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient(`bookings/${bookingId}/`);
      setBooking(res?.data || res);
    } catch (err: any) {
      setError(err?.message || 'Failed to retrieve booking information');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please describe the problem you are experiencing.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        booking_id: bookingId,
        issue_type: issueType,
        description: description.trim(),
        preferred_date: preferredDate || new Date().toISOString().split('T')[0],
        preferred_time_slot: preferredSlot,
        evidence_photo_url: evidencePhoto || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80',
      };

      const res: any = await apiClient('reviews/warranty/claim/', {
        method: 'POST',
        body: payload,
      });

      setSubmittedClaim(res?.data || res);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit warranty claim. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-4 border-[#059669] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-slate-600 font-medium">Checking Urban Company 30-Day Warranty...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Booking
        </button>

        {/* Urban Company 30-Day Guarantee Header */}
        <div className="bg-gradient-to-br from-[#064E3B] to-[#047857] text-white p-6 rounded-2xl shadow-md relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/20 shrink-0">
              <ShieldCheck className="w-8 h-8 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-emerald-400/20 text-emerald-100 px-2 py-0.5 rounded">
                  Urban Company Benchmark
                </span>
                <span className="text-xs text-emerald-200 font-mono">
                  Ref: {booking?.booking_reference || bookingId.slice(0, 8)}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold mt-1">
                30-Day Free Re-work Warranty
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 leading-relaxed">
                If the problem recurs or you are not completely satisfied with the workmanship, Yetzo sends a senior master technician for a 100% free inspection and re-work.
              </p>
            </div>
          </div>
        </div>

        {/* Claim Success State */}
        {submittedClaim ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Warranty Claim Registered</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your claim <span className="font-mono font-bold text-slate-900">#{submittedClaim.claim_id || 'WC-84920'}</span> has been approved under Yetzo 30-Day Protection. A senior inspection expert is scheduled.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="font-semibold text-slate-800">{booking?.service?.name || 'Home Appliance Service'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Inspection Fee:</span>
                <span className="font-bold text-emerald-600">₹0 (100% Free under UC Guarantee)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scheduled Slot:</span>
                <span className="font-semibold text-slate-800">{preferredDate || 'Tomorrow'} ({preferredSlot})</span>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <Link
                href={`/customer/bookings/${bookingId}`}
                className="px-6 py-2.5 bg-[#059669] text-white rounded-xl text-sm font-semibold hover:bg-[#047857] shadow transition"
              >
                Back to Booking Overview
              </Link>
            </div>
          </div>
        ) : (
          /* Claim Request Form */
          <form onSubmit={handleClaimSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Issue Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                What issue are you facing?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'WORKMANSHIP', label: 'Improper cooling or functioning', desc: 'Appliance stopped working again' },
                  { id: 'DAMAGE', label: 'Leakage / Water Dripping', desc: 'Water leak or pipe issue post-service' },
                  { id: 'INCOMPLETE', label: 'Incomplete Service Scope', desc: 'Technician left tasks unfinished' },
                  { id: 'SPARE_PART', label: 'Spare Part Malfunction', desc: 'Installed part failed within 30 days' },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start p-3.5 rounded-xl border-2 cursor-pointer transition ${
                      issueType === item.id
                        ? 'border-[#059669] bg-emerald-50/40 text-slate-900'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="issueType"
                      value={item.id}
                      checked={issueType === item.id}
                      onChange={(e) => setIssueType(e.target.value)}
                      className="mt-0.5 text-[#059669] focus:ring-[#059669]"
                    />
                    <div className="ml-2.5">
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Describe the problem in detail *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. The Split AC was serviced yesterday but started blowing warm air and making a vibrating noise this morning..."
                className="w-full text-xs p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent text-slate-900 placeholder:text-slate-400"
                required
              />
            </div>

            {/* Preferred Re-visit Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Preferred Re-work Date
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#059669] text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Preferred Time Slot
                </label>
                <select
                  value={preferredSlot}
                  onChange={(e) => setPreferredSlot(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#059669] text-slate-900 bg-white"
                >
                  <option value="MORNING">Morning (09:00 AM - 12:00 PM)</option>
                  <option value="AFTERNOON">Afternoon (12:00 PM - 04:00 PM)</option>
                  <option value="EVENING">Evening (04:00 PM - 08:00 PM)</option>
                </select>
              </div>
            </div>

            {/* Evidence Photo Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                Attach Photo Evidence (Optional)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition cursor-pointer">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <span className="text-xs text-slate-600 font-medium">
                  Click to upload appliance issue photo or drag & drop
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP up to 5MB</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl shadow-md transition disabled:opacity-50 text-sm flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Filing Warranty Re-work Claim...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Submit 30-Day Free Re-work Claim
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-slate-500 mt-2">
                Protected by Yetzo 30-Day Re-work Guarantee. No hidden visit charges.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function BookingWarrantyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-500 font-semibold text-sm">Loading warranty claim...</div>}>
      <BookingWarrantyContent />
    </Suspense>
  );
}

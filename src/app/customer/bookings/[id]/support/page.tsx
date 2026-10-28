'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, LifeBuoy, AlertTriangle, MessageSquare, PhoneCall, CheckCircle2, ChevronRight, Loader2, Send } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

function BookingSupportContent() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.id as string;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<string>('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ticketCreated, setTicketCreated] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) return;
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const data = await apiClient<any>(`bookings/${bookingId}/`);
        setBooking(data);
      } catch (err: any) {
        console.warn('Could not fetch booking:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const issueOptions = [
    { id: 'DELAYED', title: 'Professional is delayed / Unreachable', priority: 'HIGH' },
    { id: 'OVERCHARGING', title: 'Asked for extra cash payment outside app', priority: 'CRITICAL' },
    { id: 'QUALITY', title: 'Unsatisfactory work / Incomplete chore', priority: 'MEDIUM' },
    { id: 'DAMAGE', title: 'Property damage during service execution', priority: 'CRITICAL' },
    { id: 'SAFETY', title: 'Safety or behavioral concern (SOS)', priority: 'CRITICAL' },
    { id: 'OTHER', title: 'General question regarding this booking', priority: 'LOW' },
  ];

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue || !message.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      const issueObj = issueOptions.find((i) => i.id === selectedIssue);
      const res = await apiClient<any>('support/tickets/', {
        method: 'POST',
        body: {
          booking_id: bookingId,
          subject: `[Booking ${booking?.booking_number || bookingId.slice(0, 8)}] ${issueObj?.title || selectedIssue}`,
          priority: issueObj?.priority || 'MEDIUM',
          description: message.trim(),
        },
      });

      setTicketCreated(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit support ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-[#059669]" />
          Loading booking support details...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Booking Details
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl">
                <LifeBuoy className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Booking Assistance</h1>
                <p className="text-xs text-slate-500">
                  Order #{booking?.booking_number || bookingId?.slice(0, 8)} • Direct Operations Help
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push(`/customer/support/chat?bookingId=${bookingId}`)}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#059669] text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Live Chat</span>
            </button>
          </div>

          {ticketCreated ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h2 className="text-base font-bold text-slate-900">Ticket #{ticketCreated.ticket_number} Created</h2>
              <p className="text-xs text-slate-600">
                Our operations team has received your priority escalation. A support agent has been assigned and will reach out via call/chat within 10 minutes.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => router.push(`/customer/support/tickets/${ticketCreated.id || ''}`)}
                  className="px-6 py-2.5 bg-[#059669] text-white text-xs font-bold rounded-xl shadow hover:bg-[#047857] transition"
                >
                  View Ticket Status
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateTicket} className="space-y-5">
              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  What is the issue with this service booking? *
                </label>
                <div className="space-y-2">
                  {issueOptions.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedIssue(opt.id)}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-center justify-between text-xs ${
                        selectedIssue === opt.id
                          ? 'border-[#059669] bg-emerald-50/50 font-bold text-slate-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            opt.priority === 'CRITICAL' ? 'bg-rose-500' : opt.priority === 'HIGH' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                        />
                        <span>{opt.title}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selectedIssue === opt.id ? 'border-[#059669] bg-[#059669]' : 'border-slate-300'
                        }`}
                      >
                        {selectedIssue === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Describe what happened in detail *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide any relevant details, notes, or specific safety concerns..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#059669] text-xs text-slate-900"
                  required
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-[11px] text-amber-800">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  For urgent safety threats or medical emergencies, please trigger the SOS button on the live tracking screen or call local emergency services immediately.
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting || !selectedIssue || !message.trim()}
                className="w-full py-3.5 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl shadow transition text-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Ticket...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Priority Support Ticket</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookingSupportPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-500 font-semibold text-sm">Loading...</div>}>
      <BookingSupportContent />
    </Suspense>
  );
}

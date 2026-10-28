'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LifeBuoy, ArrowLeft, PhoneCall, AlertTriangle, Send, CheckCircle2, ShieldAlert, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function ProfessionalSupportPage() {
  const router = useRouter();

  const [issueType, setIssueType] = useState('DOORSTEP_UNREACHABLE');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [ticketCreated, setTicketCreated] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const issues = [
    { id: 'DOORSTEP_UNREACHABLE', label: 'Customer Not Opening Door / Phone Unreachable' },
    { id: 'NO_END_OTP', label: 'Job Finished But Customer Refuses to Share End OTP' },
    { id: 'SCOPE_DISPUTE', label: 'Customer Demanding Free Extra Work Outside Package' },
    { id: 'PAYMENT_WALLET', label: 'Wallet Payout Delay / Bank Withdrawal Failure' },
    { id: 'SAFETY_SOS', label: 'Physical Threat / Safety Concern (Priority SOS)' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const label = issues.find((i) => i.id === issueType)?.label || issueType;
      const res: any = await apiClient('support/tickets/', {
        method: 'POST',
        body: {
          subject: `[PARTNER DESK] ${label}`,
          priority: issueType === 'SAFETY_SOS' ? 'CRITICAL' : 'HIGH',
          description: description.trim(),
        },
      });

      setTicketCreated(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit partner assistance request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl">
                <LifeBuoy className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Partner Fleet Support Desk</h1>
                <p className="text-xs text-slate-500">Instant operations assistance for on-ground field difficulties.</p>
              </div>
            </div>

            <a
              href="tel:1800-YETZO-PRO"
              className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-rose-100 transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>SOS Line</span>
            </a>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {ticketCreated ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h2 className="text-sm font-bold text-slate-900">
                Ticket #{ticketCreated.ticket_number} Created
              </h2>
              <p className="text-xs text-slate-600">
                Our Fleet Dispatch Commander has received your on-ground alert. Expect a call within 3 minutes.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => router.push('/professional/pro/jobs')}
                  className="px-4 py-2 bg-[#059669] text-white font-bold rounded-xl text-xs"
                >
                  Return to Active Jobs
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-2">Select Issue Category *</label>
                <div className="space-y-2">
                  {issues.map((i) => (
                    <div
                      key={i.id}
                      onClick={() => setIssueType(i.id)}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${
                        issueType === i.id
                          ? 'border-[#059669] bg-emerald-50/40 text-slate-900 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span>{i.label}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          issueType === i.id ? 'border-[#059669] bg-[#059669]' : 'border-slate-300'
                        }`}
                      >
                        {issueType === i.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Describe the Situation / Customer Name / Address *
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide complete on-ground details so our ops team can intervene immediately..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#059669] text-slate-900"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !description.trim()}
                className="w-full py-3.5 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl shadow transition text-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Dispatch Alert...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Fleet Support Ticket</span>
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

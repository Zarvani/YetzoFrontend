'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  HelpCircle, Plus, MessageSquare, Clock, 
  CheckCircle2, AlertCircle, ChevronRight, ShieldCheck 
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function CustomerTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('BOOKING');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient('support/tickets/');
      const list = res?.data || (Array.isArray(res) ? res : []);
      setTickets(list);
    } catch (e: any) {
      console.warn('Tickets fetch note:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    try {
      setCreating(true);
      setError(null);

      await apiClient('support/tickets/', {
        method: 'POST',
        body: {
          subject: subject.trim(),
          category: category,
          description: description.trim(),
          priority: 'MEDIUM',
        },
      });

      setShowCreateModal(false);
      setSubject('');
      setDescription('');
      fetchTickets();
    } catch (err: any) {
      setError(err?.message || 'Failed to open support ticket. Please check input.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-[#2563EB]" />
              <h1 className="text-xl font-bold text-slate-900">Yetzo Customer Care & Support</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Yetzo Certified grade resolution. 24/7 priority ticket tracking and escalation desk.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white rounded-xl text-xs font-bold hover:bg-[#1D4ED8] shadow transition"
          >
            <Plus className="w-4 h-4" />
            Open New Ticket
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tickets List */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Your Support Requests ({tickets.length})
          </h2>

          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading support tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-xl space-y-3">
              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-600 font-medium">You have no active support tickets.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Raise an Issue
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {tickets.map((t) => (
                <Link
                  key={t.id}
                  href={`/customer/support/tickets/${t.id}`}
                  className="py-4 flex items-center justify-between group hover:bg-slate-50/60 transition p-2 rounded-xl"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        #{t.ticket_number || t.id.slice(0, 8)}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {t.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          t.status === 'RESOLVED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm group-hover:text-[#2563EB] transition">
                      {t.subject}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{t.description}</p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-900">Open Support Ticket</h3>

              <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Issue Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2563EB] bg-white text-slate-900"
                  >
                    <option value="BOOKING">Booking Issue</option>
                    <option value="PAYMENT">Payment / Escrow / Refund</option>
                    <option value="PROFESSIONAL">Technician / Behavior Issue</option>
                    <option value="WARRANTY">30-Day Warranty Inquiry</option>
                    <option value="SAFETY">Safety Concern</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief summary of issue"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2563EB] text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Detailed Description *</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what occurred, any technician details, etc."
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2563EB] text-slate-900"
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-5 py-2 bg-[#2563EB] text-white rounded-xl font-bold hover:bg-[#1D4ED8] shadow transition disabled:opacity-50"
                  >
                    {creating ? 'Submitting...' : 'Submit Ticket'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

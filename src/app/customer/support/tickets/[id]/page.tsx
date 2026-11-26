'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Send, CheckCircle2, AlertCircle, 
  User, ShieldCheck, Clock, MessageSquare 
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

function TicketDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTicketAndMessages();
  }, [ticketId]);

  const fetchTicketAndMessages = async () => {
    try {
      setLoading(true);
      const [ticketRes, msgsRes]: any = await Promise.all([
        apiClient(`support/tickets/${ticketId}/`).catch(() => null),
        apiClient(`support/tickets/${ticketId}/messages/`).catch(() => ({ data: [] })),
      ]);

      setTicket(ticketRes?.data || ticketRes);
      const mList = msgsRes?.data || (Array.isArray(msgsRes) ? msgsRes : []);
      setMessages(mList);
    } catch (e) {
      console.warn('Ticket detail fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      setSending(true);
      await apiClient(`support/tickets/${ticketId}/messages/`, {
        method: 'POST',
        body: { message: replyText.trim() },
      });
      setReplyText('');
      fetchTicketAndMessages();
    } catch (e: any) {
      alert(e?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <div className="w-8 h-8 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-500">Loading ticket thread...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-2" />
        <h2 className="text-lg font-bold text-slate-900">Ticket Not Found</h2>
        <p className="text-xs text-slate-500 mb-4">The requested ticket does not exist or was closed.</p>
        <Link href="/customer/support/tickets" className="text-xs font-bold text-[#2563EB] hover:underline">
          Back to Tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Back */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Tickets
        </button>

        {/* Ticket Header Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-slate-500">
              #{ticket.ticket_number || ticket.id.slice(0, 8)}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                ticket.status === 'RESOLVED'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {ticket.status}
            </span>
          </div>

          <h1 className="text-xl font-bold text-slate-900">{ticket.subject}</h1>
          <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
            {ticket.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Category: <strong className="text-slate-800">{ticket.category}</strong></span>
            <span>Priority: <strong className="text-slate-800">{ticket.priority}</strong></span>
          </div>
        </div>

        {/* Message Thread */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Discussion & Agent Responses
          </h2>

          <div className="space-y-3 min-h-[200px]">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                An operations support agent will review your ticket shortly.
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-2xl text-xs max-w-md ${
                    msg.is_agent
                      ? 'bg-slate-100 text-slate-800 mr-auto'
                      : 'bg-blue-50 text-emerald-950 border border-blue-200 ml-auto'
                  }`}
                >
                  <div className="font-bold text-[11px] mb-1 text-slate-600">
                    {msg.is_agent ? 'Yetzo Support Specialist' : 'You'}
                  </div>
                  <p className="leading-relaxed">{msg.message}</p>
                </div>
              ))
            )}
          </div>

          {/* Reply Box */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply to the support agent..."
              className="flex-1 text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2563EB] text-slate-900"
            />
            <button
              type="submit"
              disabled={sending || !replyText.trim()}
              className="px-5 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold text-xs shadow transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function TicketDetailPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-slate-400 font-bold">Loading ticket...</div>}>
      <TicketDetailPageContent />
    </React.Suspense>
  );
}

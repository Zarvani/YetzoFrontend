'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, MessageSquare, Shield, User, Clock } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

function CustomerChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      sender: 'CUSTOMER',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Trigger agent / backend response
    try {
      if (bookingId) {
        await apiClient(`support/tickets/`, {
          method: 'POST',
          body: {
            subject: `Chat regarding booking ${bookingId}`,
            category: 'BOOKING',
            description: newMsg.text,
            priority: 'MEDIUM',
          },
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('Chat dispatch note:', e);
    }
  };

  return (
    <div className="h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900">
                {bookingId ? `Service Partner Chat (${bookingId.slice(0, 8)})` : 'Yetzo Live Support Desk'}
              </h1>
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400">Yetzo On-Demand Services Verified Resolution</p>
          </div>
        </div>

        <Link
          href="/customer/support/tickets"
          className="text-xs font-bold text-[#2563EB] hover:underline"
        >
          View All Tickets
        </Link>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 max-w-3xl w-full mx-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
            <MessageSquare className="w-12 h-12 text-slate-300" />
            <h3 className="text-sm font-bold text-slate-700">Live Support Active</h3>
            <p className="text-xs max-w-xs">
              Send a message to your assigned service partner or Yetzo support representative.
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`p-3.5 rounded-2xl text-xs max-w-sm ${
                m.sender === 'CUSTOMER'
                  ? 'bg-[#2563EB] text-white ml-auto rounded-br-none shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-800 mr-auto rounded-bl-none shadow-sm'
              }`}
            >
              <p className="leading-relaxed">{m.text}</p>
              <span
                className={`text-[10px] mt-1 block text-right ${
                  m.sender === 'CUSTOMER' ? 'text-blue-100' : 'text-slate-400'
                }`}
              >
                {m.timestamp}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Input Footer */}
      <footer className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-10">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2563EB] text-slate-900"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-5 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl text-xs shadow transition disabled:opacity-50 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}

export default function CustomerChatPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-slate-400 font-bold">Connecting chat...</div>}>
      <CustomerChatPageContent />
    </React.Suspense>
  );
}

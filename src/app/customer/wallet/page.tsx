'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';

export default function WalletPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient('payments/wallet/')
      .then((res: any) => setWallet(res.data || res || null))
      .catch(() => setWallet(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <h1 className="text-xl font-black text-slate-900">Yetzo Wallet</h1>
        </div>
      </div>

      <main className="px-4 py-6 space-y-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-blue-600/30">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <p className="text-blue-100 text-sm font-medium mb-1">Available Balance</p>
            <h2 className="text-4xl font-black mb-6">
              ₹{loading ? '---' : ((wallet?.balance || 0) / 100).toLocaleString('en-IN')}
            </h2>
            <div className="flex gap-3">
              <button className="flex-1 bg-white text-blue-600 font-bold py-2.5 rounded-xl text-sm">Add Money</button>
              <button className="flex-1 bg-blue-500/30 text-white font-bold py-2.5 rounded-xl text-sm">Send to Bank</button>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div>
          <h3 className="text-lg font-black text-slate-900 mb-4">Recent Transactions</h3>
          {loading ? (
            <div className="space-y-3">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 animate-pulse flex justify-between">
                  <div className="h-4 w-32 bg-slate-200 rounded" />
                  <div className="h-4 w-16 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          ) : !wallet?.transactions || wallet.transactions.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="font-black text-lg text-slate-900 mb-1">No transactions</h3>
              <p className="text-slate-500 text-sm">Your wallet history will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {wallet.transactions.map((t: any) => (
                <div key={t.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${t.transaction_type === 'CREDIT' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {t.transaction_type === 'CREDIT' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      )}
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{t.description || (t.transaction_type === 'CREDIT' ? 'Money Added' : 'Payment Made')}</p>
                    <p className="text-xs font-medium text-slate-500">{new Date(t.created_at).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-black ${t.transaction_type === 'CREDIT' ? 'text-green-600' : 'text-slate-900'}`}>
                      {t.transaction_type === 'CREDIT' ? '+' : '-'}₹{((t.amount || 0)/100).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

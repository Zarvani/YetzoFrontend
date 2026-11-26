'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Wallet, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function CustomerWalletTransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient('payments/wallet/transactions/');
      const list = res?.data || (Array.isArray(res) ? res : []);
      setTransactions(list);
    } catch (e) {
      console.warn('Wallet transactions fetch note:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Wallet
          </button>

          <button
            onClick={fetchTransactions}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#2563EB]" />
            <h1 className="text-lg font-bold text-slate-900">Wallet Passbook & Statements</h1>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Loading ledger transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No transactions recorded in your wallet passbook.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <div key={tx.id} className="py-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        tx.transaction_type === 'CREDIT'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {tx.transaction_type === 'CREDIT' ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">{tx.description}</span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(tx.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`font-mono font-bold text-sm ${
                      tx.transaction_type === 'CREDIT'
                        ? 'text-blue-600'
                        : 'text-slate-900'
                    }`}
                  >
                    {tx.transaction_type === 'CREDIT' ? '+' : '-'}₹{tx.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

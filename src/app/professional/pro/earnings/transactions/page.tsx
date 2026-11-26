'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, DollarSign, ArrowDownLeft, ArrowUpRight, RefreshCw, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface TxItem {
  id: string;
  transaction_type: 'CREDIT' | 'DEBIT';
  amount: number;
  description: string;
  created_at: string;
  reference?: string;
}

export default function ProfessionalTransactionsPage() {
  const router = useRouter();

  const [transactions, setTransactions] = useState<TxItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient('payments/wallet/transactions/').catch(() => []);
      const list = Array.isArray(res) ? res : res?.results || [];
      setTransactions(list);
    } catch (e) {
      console.warn('Transactions load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Earnings
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-800 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Wallet Passbook Statement</h1>
                <p className="text-xs text-slate-500">Chronological ledger of job payouts and UPI bank settlements.</p>
              </div>
            </div>

            <button
              onClick={fetchTransactions}
              className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loading ? (
            <div className="py-12 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-[#2563EB]" />
              Loading wallet statement...
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl text-xs text-slate-500">
              No recent transactions recorded. Completed jobs will disburse earnings here in real-time.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {transactions.map((tx) => {
                const isCredit = tx.transaction_type === 'CREDIT' || Number(tx.amount) > 0;
                return (
                  <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-xl mt-0.5 ${
                          isCredit ? 'bg-blue-50 text-blue-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{tx.description}</span>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                          {new Date(tx.created_at).toLocaleString()} {tx.reference ? `• Ref: ${tx.reference}` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`font-mono font-bold text-sm ${
                          isCredit ? 'text-blue-800' : 'text-slate-900'
                        }`}
                      >
                        {isCredit ? '+' : '-'}₹{Math.abs(Number(tx.amount))}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

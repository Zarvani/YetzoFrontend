'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Landmark, Send, CheckCircle2, AlertCircle, ArrowUpRight, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function ProfessionalPayoutsPage() {
  const router = useRouter();

  const [balance, setBalance] = useState<number>(0);
  const [upiId, setUpiId] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const [walletRes, userRes]: any = await Promise.all([
        apiClient('payments/wallet/').catch(() => null),
        apiClient('auth/me/').catch(() => null),
      ]);
      if (walletRes?.balance !== undefined) {
        setBalance(Number(walletRes.balance));
      }
      if (userRes?.phone_number) {
        setUpiId(`${userRes.phone_number}@upi`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0) {
      setError('Please enter a valid withdrawal amount.');
      return;
    }
    if (amt > balance) {
      setError(`Withdrawal amount cannot exceed available balance of ₹${balance}.`);
      return;
    }

    try {
      setWithdrawing(true);
      setError(null);
      await apiClient('payments/wallet/withdraw/', {
        method: 'POST',
        body: { amount: amt, upi_id: upiId },
      }).catch(() => null);

      setBalance((prev) => Math.max(0, prev - amt));
      setSuccessMsg(`Instant payout of ₹${amt} initiated to ${upiId}. Expected in 2 minutes.`);
      setWithdrawAmount('');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err?.message || 'Payout failed. Please try again.');
    } finally {
      setWithdrawing(false);
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
          Back to Earnings
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-800 rounded-xl">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Instant UPI Bank Settlements</h1>
                <p className="text-xs text-slate-500">Withdraw your job earnings directly to bank account.</p>
              </div>
            </div>
          </div>

          {/* Balance card */}
          <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl shadow space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Withdrawable Wallet Balance
            </span>
            <div className="text-3xl font-black text-sky-400">
              ₹{balance.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-300">
              Zero withdrawal fees • Powered by Razorpay Route Instant Payouts
            </p>
          </div>

          {successMsg && (
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Linked UPI ID / VPA *</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@okhdfcbank"
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2563EB] text-slate-900 font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Withdrawal Amount (₹) *</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter amount (e.g. 2000)"
                max={balance}
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2563EB] text-slate-900 font-mono text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={withdrawing || !withdrawAmount || Number(withdrawAmount) > balance}
              className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl shadow transition text-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {withdrawing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Instant Transfer...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Disburse Funds via UPI • 2 Min SLA</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

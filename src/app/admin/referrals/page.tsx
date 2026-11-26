'use client';

import React, { useState } from 'react';
import { Gift, Users, DollarSign, CheckCircle2, TrendingUp } from 'lucide-react';

export default function AdminReferralsPage() {
  const [stats] = useState({
    totalInvites: 1842,
    convertedBookings: 649,
    rewardDisbursed: 97350,
    conversionRate: '35.2%',
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Gift className="w-6 h-6 text-[#2563EB]" />
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Viral Referral & Growth Engine</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">Configure customer invite rewards, referral wallet credits, and fraud prevention rules.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Invites Sent</span>
          <div className="text-2xl font-black text-slate-900">{stats.totalInvites.toLocaleString()}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Converted Orders</span>
          <div className="text-2xl font-black text-[#2563EB]">{stats.convertedBookings}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Conversion Rate</span>
          <div className="text-2xl font-black text-blue-600">{stats.conversionRate}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Wallet Bonuses Disbursed</span>
          <div className="text-2xl font-black text-purple-600">₹{stats.rewardDisbursed.toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Current Referral Incentive Rules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
            <span className="font-bold text-blue-900 block">Inviter Bonus (Referrer)</span>
            <p className="text-blue-800">₹150 instant Yetzo Wallet credit upon referee's first completed job.</p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
            <span className="font-bold text-blue-900 block">Referee Welcome Gift</span>
            <p className="text-blue-800">₹150 off voucher code applied automatically at checkout.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

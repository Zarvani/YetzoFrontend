"use client";

import * as React from "react"
import { useState, useEffect } from "react"
import { Header } from "@/components/layout/Header"
import { Wallet, ShieldCheck, CreditCard, Clock, CheckCircle2, ChevronRight, Gift } from "lucide-react"
import { apiClient } from "@/lib/apiClient"

export default function CustomerWalletPage() {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const walletRes = await apiClient<any>('wallet/');
        if (walletRes && walletRes.balance !== undefined) {
          setBalance(walletRes.balance);
        }
        const txRes = await apiClient<any>('wallet/transactions/');
        if (txRes && txRes.results) {
          setTransactions(txRes.results);
        } else if (Array.isArray(txRes)) {
          setTransactions(txRes);
        }
      } catch (error) {
        console.error("Failed to fetch wallet", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWallet();
  }, []);
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      
      <div className="max-w-[1000px] mx-auto pt-24 px-4 pb-20">
        <h1 className="text-[32px] font-bold text-slate-900 mb-8">Yetzo Pay & Memberships</h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Wallet & Membership */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Yetzo Plus Subscription Card */}
            <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-[20px] p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563EB] opacity-20 blur-[80px] rounded-full"></div>
              
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h2 className="text-[24px] font-bold tracking-tight mb-1 flex items-center gap-2">
                    YETZO <span className="text-[#06B6D4]">PLUS</span>
                  </h2>
                  <p className="text-[14px] text-slate-400">Premium Membership</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-[12px] font-bold border border-white/20">
                  Active
                </div>
              </div>

              <div className="mt-8 relative z-10 grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-[12px] p-4 border border-white/10">
                  <p className="text-[12px] text-slate-400 uppercase tracking-wider font-bold mb-1">Savings</p>
                  <p className="text-[24px] font-bold text-white">₹1,250</p>
                </div>
                <div className="bg-white/5 rounded-[12px] p-4 border border-white/10">
                  <p className="text-[12px] text-slate-400 uppercase tracking-wider font-bold mb-1">Valid Till</p>
                  <p className="text-[18px] font-bold text-white mt-1">Oct 24, 2027</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between relative z-10">
                <p className="text-[13px] text-slate-300">Enjoying 10% off on all bookings!</p>
                <button className="text-[13px] font-bold text-[#06B6D4] hover:text-white transition-colors">Manage</button>
              </div>
            </div>

            {/* Wallet Balance */}
            <div className="bg-white rounded-[20px] border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-blue-50 text-[#2563EB] rounded-xl flex items-center justify-center">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold text-slate-900">Yetzo Wallet</h2>
                  <p className="text-[13px] text-slate-500">Pay securely without OTPs</p>
                </div>
              </div>

              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1">Available Balance</p>
                  <h3 className="text-[40px] font-bold text-slate-900 leading-none">
                    {isLoading ? "..." : `₹${balance.toFixed(2)}`}
                  </h3>
                </div>
                <button className="bg-[#0F172A] hover:bg-black text-white px-6 py-2.5 rounded-[10px] text-[14px] font-bold transition-colors">
                  + Add Money
                </button>
              </div>

              <div className="bg-[#F8FAFC] rounded-[12px] p-4 border border-slate-100 flex items-start gap-3">
                <Gift className="h-5 w-5 text-[#2563EB] mt-0.5" />
                <div>
                  <p className="text-[14px] font-bold text-slate-900">Add ₹2,000 to get ₹200 Cashback!</p>
                  <p className="text-[13px] text-slate-500 mt-0.5">Offer valid till end of this month. Cashback instantly credited.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Linked Methods & History */}
          <div className="md:col-span-5 space-y-6">
            
            <div className="bg-white rounded-[20px] border border-slate-200 p-6 shadow-sm">
              <h3 className="text-[16px] font-bold text-slate-900 mb-4">Saved Payment Methods</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-[12px] hover:border-[#2563EB] transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-12 bg-slate-100 rounded flex items-center justify-center border border-slate-200">
                      <CreditCard className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-slate-900">HDFC Bank •••• 4092</p>
                      <p className="text-[12px] text-slate-500">Credit Card</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#2563EB]" />
                </div>
                
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-[12px] hover:border-[#2563EB] transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-12 bg-slate-100 rounded flex items-center justify-center border border-slate-200 font-bold text-[#2563EB] text-[11px]">
                      UPI
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-slate-900">amit@okhdfcbank</p>
                      <p className="text-[12px] text-slate-500">Google Pay</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#2563EB]" />
                </div>
              </div>
              
              <button className="w-full mt-4 py-3 bg-[#F8FAFC] border border-slate-200 text-slate-700 rounded-[10px] text-[13px] font-bold hover:bg-slate-100 transition-colors">
                Add New Card or UPI
              </button>
            </div>

            <div className="bg-white rounded-[20px] border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-bold text-slate-900">Recent Activity</h3>
                <button className="text-[12px] font-bold text-[#2563EB]">View All</button>
              </div>
              
              <div className="space-y-4">
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-12 bg-slate-100 rounded-xl"></div>
                    <div className="h-12 bg-slate-100 rounded-xl"></div>
                  </div>
                ) : transactions.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">No recent activity.</p>
                ) : (
                  transactions.map((tx: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tx.transaction_type === 'credit' ? 'bg-green-50' : 'bg-slate-100'}`}>
                          {tx.transaction_type === 'credit' ? <CheckCircle2 className="h-4 w-4 text-[#16A34A]" /> : <Clock className="h-4 w-4 text-slate-600" />}
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-slate-900 capitalize">{tx.description || tx.transaction_type}</p>
                          <p className="text-[12px] text-slate-500">{new Date(tx.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className={`text-[14px] font-bold ${tx.transaction_type === 'credit' ? 'text-[#16A34A]' : 'text-slate-900'}`}>
                        {tx.transaction_type === 'credit' ? '+' : '-'}₹{tx.amount}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

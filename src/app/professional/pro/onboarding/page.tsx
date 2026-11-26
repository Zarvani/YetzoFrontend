'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, ChevronRight, FileText, Award, Calendar, Video, ArrowRight, UserCheck, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface ChecklistStep {
  id: string;
  title: string;
  desc: string;
  href: string;
  icon: any;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
}

export default function ProfessionalOnboardingPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [partnerProfile, setPartnerProfile] = useState<any>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const me: any = await apiClient('professionals/me/').catch(() => null);
        setPartnerProfile(me);
      } catch (e) {
        console.warn('Profile fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const steps: ChecklistStep[] = [
    {
      id: 'kyc',
      title: 'Identity Verification & Police Clearance',
      desc: 'Verify Aadhaar UIDAI & submit criminal record clearance certificate.',
      href: '/professional/pro/kyc',
      icon: ShieldCheck,
      status: partnerProfile?.is_verified ? 'COMPLETED' : 'IN_PROGRESS',
    },
    {
      id: 'docs',
      title: 'Upload Official Credentials',
      desc: 'Driving license, trade diploma, and bank account for UPI payouts.',
      href: '/professional/pro/documents',
      icon: FileText,
      status: partnerProfile?.documents?.length > 0 ? 'COMPLETED' : 'PENDING',
    },
    {
      id: 'skills',
      title: 'Skills & Service Catalog Selection',
      desc: 'Choose service chore specializations (AC, Cleaning, Electrical).',
      href: '/professional/pro/skills',
      icon: Award,
      status: 'PENDING',
    },
    {
      id: 'training',
      title: 'Yetzo Verified Bodycam & Safety Protocol',
      desc: 'Watch required 8-minute protocol video on customer safety & privacy.',
      href: '/professional/pro/training',
      icon: Video,
      status: 'PENDING',
    },
    {
      id: 'schedule',
      title: 'Weekly Operating Shift & Micro-Cluster',
      desc: 'Set your active days, hours, and preferred society cluster zones.',
      href: '/professional/pro/schedule',
      icon: Calendar,
      status: 'PENDING',
    },
  ];

  const completedCount = steps.filter((s) => s.status === 'COMPLETED').length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-black text-slate-900">Partner Fleet Onboarding</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete the verification milestones below to unlock live 15-minute customer dispatches.
            </p>
          </div>
          <Link
            href="/professional/pro/jobs"
            className="text-xs font-bold text-[#2563EB] hover:underline"
          >
            Go to Job Queue
          </Link>
        </header>

        {/* Progress Bar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-700">Verification Readiness</span>
            <span className="text-[#2563EB] font-black">{progressPercent}% Completed</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2563EB] transition-all duration-500 rounded-full"
              style={{ width: `${Math.max(10, progressPercent)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            {completedCount} of {steps.length} onboarding requirements completed.
          </p>
        </div>

        {/* Checklist */}
        <div className="space-y-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Link
                key={step.id}
                href={step.href}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#2563EB] shadow-sm transition flex items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-3 rounded-xl shrink-0 mt-0.5 ${
                      step.status === 'COMPLETED'
                        ? 'bg-blue-50 text-blue-800'
                        : step.status === 'IN_PROGRESS'
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-[#2563EB] transition">
                        {step.title}
                      </span>
                      {step.status === 'COMPLETED' ? (
                        <span className="px-2 py-0.5 rounded text-[9px] font-black bg-blue-100 text-blue-800">
                          COMPLETED
                        </span>
                      ) : step.status === 'IN_PROGRESS' ? (
                        <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-100 text-amber-800">
                          ACTION REQUIRED
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>

                <div className="p-2 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Final Submission CTA */}
        <div className="pt-2">
          <Link
            href="/professional/pro/jobs"
            className="w-full py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-2xl shadow-md transition text-xs flex items-center justify-center gap-2"
          >
            <span>Proceed to Active Job Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Video, ArrowLeft, CheckCircle2, PlayCircle, Award, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface TrainingModule {
  id: string;
  title: string;
  duration: string;
  desc: string;
  completed: boolean;
}

export default function ProfessionalTrainingPage() {
  const router = useRouter();

  const standardModules: TrainingModule[] = [
    {
      id: 'm1',
      title: 'Yetzo Verified: Bodycam Hardware & Privacy Ethics',
      duration: '4 mins',
      desc: 'How to mount the tamper-proof camera, announce recording to homeowner, and end stream upon OTP verification.',
      completed: false,
    },
    {
      id: 'm2',
      title: 'Yetzo Certified Standards: Post-Service Cleanliness & OTP',
      duration: '6 mins',
      desc: '100% floor cleanup, showing customer the checklist, and entering customer End OTP to trigger instant wallet release.',
      completed: false,
    },
    {
      id: 'm3',
      title: 'Yetzo Instant 15-Min Rapid Response & Safety SOP',
      duration: '3 mins',
      desc: 'Accepting instant micro-cluster jobs within 45 seconds, safe transit, and emergency SOS protocol.',
      completed: false,
    },
  ];

  const [modules, setModules] = useState<TrainingModule[]>(standardModules);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        setLoading(true);
        const res: any = await apiClient('professionals/me/').catch(() => null);
        const completedIds: string[] = res?.training_completed_ids || [];
        if (completedIds.length > 0) {
          setModules((prev) =>
            prev.map((m) => ({ ...m, completed: completedIds.includes(m.id) }))
          );
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTraining();
  }, []);

  const handleCompleteModule = async (id: string) => {
    const updated = modules.map((m) => (m.id === id ? { ...m, completed: true } : m));
    setModules(updated);
    setActiveVideo(null);

    const completedIds = updated.filter((m) => m.completed).map((m) => m.id);
    await apiClient('professionals/me/', {
      method: 'PATCH',
      body: JSON.stringify({ training_completed_ids: completedIds }),
    }).catch(() => null);
  };

  const allCompleted = modules.every((m) => m.completed);

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 px-4 sm:px-6 font-body">
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-heading font-medium text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Services</span>
        </button>

        <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 bg-blue-50 text-blue-800 rounded-sm border border-blue-200">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold font-heading">
                Operational Certification
              </span>
              <h1 className="text-xl font-[300] font-heading text-slate-900 tracking-tight mt-0.5">
                Standard Partner Training SOP
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete modules to unlock 15m instant arrival and Yetzo Verified badges.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Verifying training credentials with database...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {modules.map((m) => (
                <div
                  key={m.id}
                  className={`p-4 rounded-sm border transition ${
                    m.completed
                      ? 'border-blue-200 bg-blue-50/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-medium text-xs text-slate-900">{m.title}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-sm font-mono">
                          {m.duration}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed max-w-lg">
                        {m.desc}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {m.completed ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-heading font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-sm border border-blue-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Certified</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => setActiveVideo(m.id)}
                          className="px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs uppercase tracking-wider font-heading font-medium rounded-sm flex items-center gap-1.5 shadow-xs transition"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Watch Module</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Inline Video Player Simulator */}
                  {activeVideo === m.id && (
                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                      <div className="aspect-video bg-[#0B0F19] rounded-sm flex flex-col items-center justify-center p-6 text-center text-white space-y-2">
                        <Video className="w-8 h-8 text-sky-400 animate-pulse" />
                        <p className="text-xs font-mono text-slate-300">Streaming: {m.title}</p>
                        <p className="text-[10px] text-slate-500">Yetzo Verified Technical Academy Video Feed</p>
                      </div>
                      <button
                        onClick={() => handleCompleteModule(m.id)}
                        className="w-full py-2 bg-slate-900 hover:bg-black text-white text-xs uppercase tracking-wider font-heading font-medium rounded-sm transition flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                        <span>I Understand & Complete Module</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 flex items-center gap-1 font-heading">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Certified under ISO 9001 Field Standards</span>
            </span>

            <Link
              href="/professional/pro/schedule"
              className={`px-5 py-2.5 rounded-sm text-xs uppercase tracking-wider font-heading font-medium transition flex items-center gap-1.5 ${
                allCompleted
                  ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-400 pointer-events-none'
              }`}
            >
              <span>Proceed to Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

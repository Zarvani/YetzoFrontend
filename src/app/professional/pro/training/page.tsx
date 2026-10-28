'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Video, ArrowLeft, CheckCircle2, PlayCircle, Award, ArrowRight, ShieldCheck } from 'lucide-react';

interface TrainingModule {
  id: string;
  title: string;
  duration: string;
  desc: string;
  completed: boolean;
}

export default function ProfessionalTrainingPage() {
  const router = useRouter();

  const [modules, setModules] = useState<TrainingModule[]>([
    {
      id: 'm1',
      title: 'Pronto Verified: Bodycam Hardware & Privacy Ethics',
      duration: '4 mins',
      desc: 'How to mount the tamper-proof camera, announce recording to homeowner, and end stream upon OTP verification.',
      completed: true,
    },
    {
      id: 'm2',
      title: 'Urban Company Standards: Post-Service Cleanliness & OTP',
      duration: '6 mins',
      desc: '100% floor cleanup, showing customer the checklist, and entering customer End OTP to trigger instant wallet release.',
      completed: true,
    },
    {
      id: 'm3',
      title: 'Snabbit 15-Min Rapid Response & Safety SOP',
      duration: '3 mins',
      desc: 'Accepting instant micro-cluster jobs within 45 seconds, safe transit, and emergency SOS protocol.',
      completed: false,
    },
  ]);

  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const handleCompleteModule = (id: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: true } : m))
    );
    setActiveVideo(null);
  };

  const allCompleted = modules.every((m) => m.completed);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Partner Training Academy</h1>
              <p className="text-xs text-slate-500">Pronto Verified bodycam safety and service execution guidelines.</p>
            </div>
          </div>

          {/* Video Player Modal/Block if active */}
          {activeVideo && (
            <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
              <div className="aspect-video bg-slate-800 rounded-xl flex flex-col items-center justify-center p-6 text-center">
                <PlayCircle className="w-12 h-12 text-emerald-400 mb-2 animate-bounce" />
                <span className="font-bold text-sm">Streaming HD Protocol Video Module</span>
                <span className="text-xs text-slate-400 mt-1">Duration: 3:45 • Mandatory for field certification</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Watched 100% of material</span>
                <button
                  onClick={() => handleCompleteModule(activeVideo)}
                  className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl transition"
                >
                  Mark Module Completed
                </button>
              </div>
            </div>
          )}

          {/* Module List */}
          <div className="space-y-3">
            {modules.map((m) => (
              <div
                key={m.id}
                className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${
                  m.completed ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{m.title}</span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {m.duration}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{m.desc}</p>
                </div>

                <div>
                  {m.completed ? (
                    <span className="flex items-center gap-1 text-emerald-800 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Passed</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => setActiveVideo(m.id)}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Watch</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => router.push('/professional/pro/schedule')}
              disabled={!allCompleted}
              className="w-full py-3.5 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl shadow transition text-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{allCompleted ? 'Continue to Operating Hours' : 'Complete All Modules to Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

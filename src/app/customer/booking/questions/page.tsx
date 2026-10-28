'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, HelpCircle, ArrowRight, Check, AlertCircle, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { useBookingStore } from '@/store/useBookingStore';

interface QuestionOption {
  id: string;
  label: string;
  extra_price?: number;
}

interface Question {
  id: string;
  question_text: string;
  question_type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TEXT' | 'BOOLEAN';
  is_required?: boolean;
  options?: QuestionOption[];
}

function QuestionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceIdParam = searchParams.get('service_id');

  const [serviceId, setServiceId] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sid = serviceIdParam || (typeof window !== 'undefined' ? sessionStorage.getItem('selected_service_id') : '');
    if (sid) {
      setServiceId(sid);
      fetchQuestions(sid);
    } else {
      // If no service is selected yet, redirect to booking catalog
      router.replace('/customer/booking');
    }
  }, [serviceIdParam, router]);

  const fetchQuestions = async (id: string) => {
    try {
      setLoading(true);
      const data = await apiClient<any>(`services/${id}/questions/`);
      const list = Array.isArray(data) ? data : data?.results || [];
      setQuestions(list);
    } catch (err) {
      console.warn('Could not fetch questions, using general requirement options:', err);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (qId: string, optionValue: string, isMulti: boolean) => {
    if (isMulti) {
      const current = answers[qId] || [];
      const updated = current.includes(optionValue)
        ? current.filter((item: string) => item !== optionValue)
        : [...current, optionValue];
      setAnswers({ ...answers, [qId]: updated });
    } else {
      setAnswers({ ...answers, [qId]: optionValue });
    }
  };

  const handleContinue = () => {
    useBookingStore.getState().setAnswers(answers);
    router.push('/customer/booking/addons');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Service
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Service Customization</h1>
              <p className="text-xs text-slate-500">
                Help our professional prepare the right tools and equipment for your home.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="py-12 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-[#059669]" />
              Loading service requirements...
            </div>
          ) : questions.length === 0 ? (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs text-emerald-800">
                Standard equipment and verified tools will be automatically brought by the professional. No additional setup questions are required for this service.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Any specific instructions for the partner? (Optional)
                </label>
                <textarea
                  rows={3}
                  value={answers['notes'] || ''}
                  onChange={(e) => setAnswers({ ...answers, notes: e.target.value })}
                  placeholder="e.g. Ring bell twice, gate code #4201, pets inside"
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#059669] text-xs text-slate-900"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q) => (
                <div key={q.id} className="space-y-2">
                  <label className="block text-xs font-bold text-slate-900">
                    {q.question_text} {q.is_required && <span className="text-rose-500">*</span>}
                  </label>

                  {q.question_type === 'TEXT' && (
                    <input
                      type="text"
                      value={answers[q.id] || ''}
                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      placeholder="Type your response..."
                      className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#059669] text-xs text-slate-900"
                    />
                  )}

                  {q.question_type === 'BOOLEAN' && (
                    <div className="flex gap-3">
                      {['Yes', 'No'].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setAnswers({ ...answers, [q.id]: val === 'Yes' })}
                          className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition ${
                            answers[q.id] === (val === 'Yes')
                              ? 'border-[#059669] bg-emerald-50 text-emerald-800'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  )}

                  {(q.question_type === 'SINGLE_CHOICE' || q.question_type === 'MULTIPLE_CHOICE') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options?.map((opt) => {
                        const isMulti = q.question_type === 'MULTIPLE_CHOICE';
                        const isSelected = isMulti
                          ? (answers[q.id] || []).includes(opt.id)
                          : answers[q.id] === opt.id;

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleOptionSelect(q.id, opt.id, isMulti)}
                            className={`p-3 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition ${
                              isSelected
                                ? 'border-[#059669] bg-emerald-50 text-emerald-900 font-bold'
                                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span>{opt.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#059669] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleContinue}
              className="w-full py-3.5 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl shadow-md transition text-xs flex items-center justify-center gap-2"
            >
              <span>Continue to Add-ons</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingQuestionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-500 font-semibold text-sm">Loading...</div>}>
      <QuestionsContent />
    </Suspense>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Award, ArrowLeft, Check, ArrowRight, Loader2, Save } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function ProfessionalSkillsPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        setLoading(true);
        const res: any = await apiClient('categories/');
        const list = Array.isArray(res) ? res : res?.results || [];
        setCategories(list);
        if (list.length > 0) {
          // Select first two categories by default
          setSelectedCategoryIds([list[0].id, list[1]?.id].filter(Boolean));
        }
      } catch (err) {
        console.warn('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveSkills = async () => {
    try {
      setSaving(true);
      await apiClient('professionals/me/', {
        method: 'PATCH',
        body: { skills: selectedCategoryIds },
      }).catch(() => null);
      router.push('/professional/pro/services');
    } finally {
      setSaving(false);
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
          Back to Onboarding
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-3 bg-blue-50 text-blue-800 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Trade Skills & Disciplines</h1>
              <p className="text-xs text-slate-500">Select the home service categories you are certified to execute.</p>
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-[#2563EB]" />
              Loading service trade disciplines...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => {
                const isSelected = selectedCategoryIds.includes(cat.id);
                return (
                  <div
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-[#2563EB] bg-blue-50/50 ring-2 ring-[#2563EB]/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{cat.name}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {cat.services_count || 4} verified services
                      </span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-[#2563EB] bg-[#2563EB] text-white' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={handleSaveSkills}
              disabled={saving || selectedCategoryIds.length === 0}
              className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl shadow transition text-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Skills...</span>
                </>
              ) : (
                <>
                  <span>Save & Continue to Rate Cards</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

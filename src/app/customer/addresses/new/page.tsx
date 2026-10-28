'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Save, AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function NewAddressPage() {
  const router = useRouter();
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('Delhi NCR');
  const [state, setState] = useState('Delhi');
  const [pincode, setPincode] = useState('110001');
  const [addressType, setAddressType] = useState('HOME');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLine.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      await apiClient('locations/addresses/', {
        method: 'POST',
        body: {
          address_line_1: addressLine.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
          address_type: addressType,
          latitude: '28.5355',
          longitude: '77.3910',
        },
      });

      router.push('/customer/addresses');
    } catch (err: any) {
      setError(err?.message || 'Failed to save address.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Addresses
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Add Service Address</h1>
              <p className="text-xs text-slate-500">Enter delivery and service execution location.</p>
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">House / Flat / Street Address *</label>
              <textarea
                rows={3}
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="e.g. Flat 301, Tower C, Prateek Laurel, Sector 120"
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#059669] text-slate-900"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#059669] text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pincode *</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#059669] text-slate-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Address Label</label>
              <div className="flex gap-2">
                {['HOME', 'WORK', 'OTHER'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAddressType(type)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition ${
                      addressType === type
                        ? 'border-[#059669] bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl shadow-md transition disabled:opacity-50 text-xs flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {submitting ? 'Saving Address...' : 'Save Service Address'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

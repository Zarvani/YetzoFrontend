'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, MapPin, Save, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

function EditAddressContent() {
  const router = useRouter();
  const params = useParams();
  const addressId = params?.id as string;

  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [addressType, setAddressType] = useState('HOME');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!addressId) return;
    const fetchAddress = async () => {
      try {
        setLoading(true);
        const data = await apiClient<any>(`locations/addresses/${addressId}/`);
        setAddressLine(data.address_line_1 || '');
        setCity(data.city || '');
        setState(data.state || '');
        setPincode(data.pincode || '');
        setAddressType(data.address_type || 'HOME');
      } catch (err: any) {
        setError(err?.message || 'Failed to load address details.');
      } finally {
        setLoading(false);
      }
    };
    fetchAddress();
  }, [addressId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLine.trim()) return;

    try {
      setSubmitting(true);
      setError(null);
      await apiClient(`locations/addresses/${addressId}/`, {
        method: 'PATCH',
        body: {
          address_line_1: addressLine.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
          address_type: addressType,
        },
      });
      router.push('/customer/addresses');
    } catch (err: any) {
      setError(err?.message || 'Failed to update address.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      setDeleting(true);
      setError(null);
      await apiClient(`locations/addresses/${addressId}/`, {
        method: 'DELETE',
      });
      router.push('/customer/addresses');
    } catch (err: any) {
      setError(err?.message || 'Failed to delete address.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500 font-semibold text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-[#2563EB]" />
          Loading address details...
        </div>
      </div>
    );
  }

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
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-800 rounded-xl">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Edit Service Address</h1>
                <p className="text-xs text-slate-500">Update your verified home/work service location.</p>
              </div>
            </div>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition"
              title="Delete Address"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">House / Flat / Street Address *</label>
              <textarea
                rows={3}
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="e.g. Flat 301, Tower C, Prateek Laurel, Sector 120"
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2563EB] text-slate-900"
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
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2563EB] text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pincode *</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2563EB] text-slate-900"
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
                        ? 'border-[#2563EB] bg-blue-50 text-blue-800'
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
                className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl shadow-md transition disabled:opacity-50 text-xs flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {submitting ? 'Updating Address...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function EditAddressPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-500 font-semibold text-sm">Loading...</div>}>
      <EditAddressContent />
    </Suspense>
  );
}

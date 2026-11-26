'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { Plus, X, MapPin, Building, Home, Briefcase, Trash2, CheckCircle2 } from 'lucide-react';

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    house_flat: '',
    building: '',
    street: '',
    landmark: '',
    city: 'New Delhi',
    state: 'Delhi NCR',
    pincode: '110001',
    address_type: 'HOME',
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const data: any = await apiClient('locations/addresses/');
      setAddresses(data?.results || (Array.isArray(data) ? data : []));
    } catch (e) {
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.house_flat || !form.street || !form.city || !form.pincode) {
      setError('Please fill in Flat/House, Street, City, and Pincode.');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await apiClient('locations/addresses/', {
        method: 'POST',
        body: form,
      });
      setShowModal(false);
      setForm({
        house_flat: '',
        building: '',
        street: '',
        landmark: '',
        city: 'New Delhi',
        state: 'Delhi NCR',
        pincode: '110001',
        address_type: 'HOME',
      });
      fetchAddresses();
    } catch (err: any) {
      setError(err?.message || 'Failed to save address.');
    } finally {
      setSaving(false);
    }
  };

  const deleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await apiClient(`locations/addresses/${id}/`, { method: 'DELETE' });
      fetchAddresses();
    } catch (e) {
      alert('Failed to delete address');
    }
  };

  const getIcon = (type: string) => {
    if (type === 'HOME') return <Home className="w-5 h-5 text-blue-600" />;
    if (type === 'WORK') return <Briefcase className="w-5 h-5 text-purple-600" />;
    return <MapPin className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <h1 className="text-xl font-black text-slate-900">Saved Addresses</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New</span>
        </button>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 animate-pulse flex gap-4">
              <div className="w-12 h-12 bg-slate-200 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-slate-200 rounded" />
                <div className="h-3 w-48 bg-slate-200 rounded" />
              </div>
            </div>
          ))
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="font-black text-lg text-slate-900 mb-1">No addresses saved</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
              Add your home, office, or apartment address to enable instant 15-minute dispatch and scheduled bookings.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition shadow-md shadow-blue-600/20"
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          addresses.map((addr) => (
            <div key={addr.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-blue-300 transition">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
                {getIcon(addr.address_type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md">
                    {addr.address_type || 'HOME'}
                  </span>
                  <button onClick={() => deleteAddress(addr.id)} className="text-slate-400 hover:text-red-500 p-1.5 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm font-bold text-slate-900 mt-2">
                  {addr.house_flat || addr.address_line_1}{addr.building ? `, ${addr.building}` : ''}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{addr.street}</p>
                {addr.landmark && <p className="text-xs text-slate-400 mt-0.5">Landmark: {addr.landmark}</p>}
                <p className="text-xs font-semibold text-slate-700 mt-1">
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
              </div>
            </div>
          ))
        )}
      </main>

      {/* Add Address Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-black text-slate-900">Add New Address</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleAddAddress} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-2">
                {['HOME', 'WORK', 'OTHER'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm({ ...form, address_type: type })}
                    className={`py-2.5 rounded-xl font-bold border transition ${
                      form.address_type === type
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">House / Flat / Floor No. *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 402, Tower B"
                  value={form.house_flat}
                  onChange={(e) => setForm({ ...form, house_flat: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Apartment / Society Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sunrise Greens Apartments"
                  value={form.building}
                  onChange={(e) => setForm({ ...form, building: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Street / Area / Sector *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector 62, Golf Course Ext Road"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nearby Landmark (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Near Metro Pillar 142"
                  value={form.landmark}
                  onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md shadow-blue-600/20 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


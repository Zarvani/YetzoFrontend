'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { MapPin, Plus, Check, Home, Building2, MapPinned, AlertCircle, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { AddressItem } from '@/types/booking';

interface BookingAddressSelectorProps {
  selectedAddressId?: string;
  onSelectAddress: (address: AddressItem) => void;
}

export function BookingAddressSelector({
  selectedAddressId,
  onSelectAddress,
}: BookingAddressSelectorProps) {
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [pincode, setPincode] = useState('560038');
  const [addressType, setAddressType] = useState<'HOME' | 'WORK' | 'OTHER'>('HOME');

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient<any>('locations/addresses/');
      const list: AddressItem[] = res?.data || (Array.isArray(res) ? res : res?.results || []);
      setAddresses(list);

      // Auto-select first address if none selected
      if (list.length > 0 && !selectedAddressId) {
        onSelectAddress(list[0]);
      }
    } catch (err: any) {
      console.warn('Address fetch note:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLine.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        address_line_1: addressLine.trim(),
        city: city.trim(),
        state: 'Karnataka',
        pincode: pincode.trim(),
        address_type: addressType,
        latitude: '12.9716',
        longitude: '77.5946',
      };

      const res = await apiClient<any>('locations/addresses/', {
        method: 'POST',
        body: payload,
      });

      const newAddr: AddressItem = res?.data || res;
      setShowAddModal(false);
      setAddressLine('');
      await fetchAddresses();
      if (newAddr?.id) {
        onSelectAddress(newAddr);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to save address. Please check input.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center bg-white rounded-sm border border-slate-200 font-body">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600 mx-auto mb-2" />
        <p className="text-xs text-slate-500 font-medium">Loading saved addresses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 font-body">
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-sm text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Address Cards List */}
      <div className="grid grid-cols-1 gap-2.5">
        {addresses.map((addr) => {
          const isSelected = selectedAddressId === addr.id;
          const TypeIcon = addr.address_type === 'WORK' ? Building2 : addr.address_type === 'HOME' ? Home : MapPinned;

          return (
            <div
              key={addr.id}
              onClick={() => onSelectAddress(addr)}
              className={`p-4 rounded-sm border cursor-pointer transition flex items-start gap-3.5 ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div
                className={`p-2 rounded-sm mt-0.5 shrink-0 ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <TypeIcon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] font-semibold font-heading uppercase tracking-wider text-slate-900">
                    {addr.address_type || 'Address'}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-sm border flex items-center justify-center transition ${
                      isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                <p className="text-xs text-slate-700 line-clamp-2">
                  {addr.address_line_1}
                  {addr.address_line_2 ? `, ${addr.address_line_2}` : ''}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Address Trigger */}
      <button
        type="button"
        onClick={() => setShowAddModal(true)}
        className="w-full py-3 px-4 rounded-sm border border-dashed border-slate-300 bg-white hover:border-blue-600 hover:bg-blue-50/20 text-slate-600 hover:text-blue-700 font-medium text-xs transition flex items-center justify-center gap-2 font-heading uppercase tracking-wider"
      >
        <Plus className="w-3.5 h-3.5" />
        Add New Service Address
      </button>

      {/* Modal for New Address */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-md p-6 max-w-lg w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-[300] font-heading text-slate-900">Add Service Location</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-medium"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateAddress} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Address Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['HOME', 'WORK', 'OTHER'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAddressType(type)}
                      className={`py-2 px-3 text-xs font-medium rounded-sm border transition ${
                        addressType === type
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Street / Flat / House Details *
                </label>
                <input
                  type="text"
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="e.g. Flat 402, Oakwood Towers, 5th Cross, Indiranagar"
                  className="w-full text-xs font-medium p-2.5 border border-slate-300 rounded-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs font-medium p-2 border border-slate-300 rounded-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full text-xs font-medium p-2 border border-slate-300 rounded-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-xs uppercase tracking-wider rounded-sm shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2 font-heading"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Address...</span>
                  </>
                ) : (
                  <span>Save and Select Address</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

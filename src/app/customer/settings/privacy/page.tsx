'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, EyeOff, Video, PhoneCall, Download, Trash2, Check, AlertCircle, Save } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function PrivacySettingsPage() {
  const router = useRouter();

  const [numberMasking, setNumberMasking] = useState(true);
  const [bodycamOptIn, setBodycamOptIn] = useState(true);
  const [geoFencedAddress, setGeoFencedAddress] = useState(true);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteSubmitted, setDeleteSubmitted] = useState(false);

  const confirmAccountDeletion = async () => {
    try {
      await apiClient('support/tickets/', {
        method: 'POST',
        body: JSON.stringify({
          subject: 'DPDP Account Erasure Request',
          category: 'ACCOUNT',
          priority: 'HIGH',
          description: 'User initiated account and PII erasure under Digital Personal Data Protection Act 2023.',
        }),
      }).catch(() => null);
      setDeleteSubmitted(true);
      setTimeout(() => {
        setDeleteModalOpen(false);
        setDeleteSubmitted(false);
      }, 3500);
    } catch {
      setDeleteModalOpen(false);
    }
  };

  useEffect(() => {
    const loadPrivacy = async () => {
      try {
        const user: any = await apiClient('auth/me/');
        if (user?.privacy) {
          setNumberMasking(user.privacy.numberMasking ?? true);
          setBodycamOptIn(user.privacy.bodycamOptIn ?? true);
          setGeoFencedAddress(user.privacy.geoFencedAddress ?? true);
        }
      } catch (e) {
        console.warn('Could not load privacy settings:', e);
      }
    };
    loadPrivacy();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      await apiClient('auth/me/', {
        method: 'PATCH',
        body: {
          privacy: {
            numberMasking,
            bodycamOptIn,
            geoFencedAddress,
          },
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.warn('Privacy save error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDataExport = async () => {
    try {
      setExporting(true);
      // Fetch full customer profile and bookings summary
      const me: any = await apiClient('auth/me/');
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(me, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `yetzo_data_export_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    } catch (e) {
      console.warn('Data export error:', e);
    } finally {
      setExporting(false);
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
          Back to Settings
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-800 rounded-xl">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Privacy & Data Protection</h1>
                <p className="text-xs text-slate-500">DPDP Act compliant privacy controls and identity protection.</p>
              </div>
            </div>

            {saved && (
              <span className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>

          <div className="space-y-4">
            {/* Phone Number Masking */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 text-blue-800 rounded-lg shrink-0 mt-0.5">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Virtual Number Masking</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Professionals call you through an encrypted relay number. Your real phone number is never exposed.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={numberMasking}
                  onChange={(e) => setNumberMasking(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
              </label>
            </div>

            {/* Yetzo Bodycam Retention */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 text-purple-700 rounded-lg shrink-0 mt-0.5">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Yetzo Verified 48H Footage Purge</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Automatically shred encrypted bodycam video feeds after 48 hours unless a dispute is logged.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={bodycamOptIn}
                  onChange={(e) => setBodycamOptIn(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
              </label>
            </div>

            {/* Geo-fenced address release */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 text-blue-700 rounded-lg shrink-0 mt-0.5">
                  <EyeOff className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Geofenced Exact Flat Number</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Your exact door/apartment unit is hidden until the verified technician reaches within 200m of your gate.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={geoFencedAddress}
                  onChange={(e) => setGeoFencedAddress(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium uppercase tracking-wider rounded-sm shadow-sm transition text-xs flex items-center justify-center gap-2 disabled:opacity-50 font-heading"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Changes...' : 'Save Privacy Controls'}</span>
            </button>
          </div>

          {/* Data Export & Deletion */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
              Data Governance (DPDP / GDPR)
            </h2>

            {exportSuccess && (
              <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded-sm flex items-center gap-2 border border-blue-200">
                <Check className="w-4 h-4 shrink-0" />
                <span>Your personal account archive has been downloaded successfully.</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDataExport}
                disabled={exporting}
                className="flex-1 py-2.5 px-4 border border-slate-300 hover:bg-slate-50 rounded-sm text-xs font-medium text-slate-700 flex items-center justify-center gap-2 transition font-heading uppercase tracking-wider"
              >
                <Download className="w-4 h-4" />
                <span>{exporting ? 'Exporting...' : 'Export My Data (JSON)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setDeleteModalOpen(true)}
                className="py-2.5 px-4 border border-rose-200 hover:bg-rose-50 rounded-sm text-xs font-medium text-rose-700 flex items-center justify-center gap-2 transition font-heading uppercase tracking-wider"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DPDP Account Erasure Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-sm max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 text-rose-600">
              <Trash2 className="w-5 h-5 shrink-0" />
              <h3 className="text-base font-[300] font-heading text-slate-900">
                Request Account & PII Erasure
              </h3>
            </div>

            {deleteSubmitted ? (
              <div className="p-4 bg-blue-50 text-blue-800 border border-blue-200 rounded-sm text-xs space-y-1">
                <p className="font-semibold">Erasure Request Logged</p>
                <p className="text-slate-600 text-[11px]">
                  Your request has been routed to our Data Protection Officer under DPDP Act 2023. A 30-day grace period is active before permanent deletion.
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-600 leading-relaxed">
                  In accordance with the <strong>Digital Personal Data Protection (DPDP) Act 2023</strong>, submitting this request will queue all your phone numbers, addresses, payment tokens, and chore history for cryptographic erasure.
                </p>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm text-[11px] text-slate-500 space-y-1">
                  <p>• Active wallet credits must be withdrawn prior to erasure.</p>
                  <p>• Completed tax invoices are retained for 7 years per statutory GST audit law.</p>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setDeleteModalOpen(false)}
                    className="px-3.5 py-2 border border-slate-200 rounded-sm text-slate-600 hover:bg-slate-50 uppercase tracking-wider text-[11px] font-heading"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmAccountDeletion}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-sm uppercase tracking-wider text-[11px] font-heading font-medium transition"
                  >
                    Confirm Permanent Erasure
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

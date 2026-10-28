'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, ArrowLeft, UploadCloud, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface DocItem {
  id: string;
  name: string;
  required: boolean;
  status: 'PENDING' | 'UPLOADED';
  fileName?: string;
}

export default function ProfessionalDocumentsPage() {
  const router = useRouter();

  const [docs, setDocs] = useState<DocItem[]>([
    { id: 'aadhaar', name: 'Aadhaar Card (Front & Back PDF / JPG)', required: true, status: 'UPLOADED', fileName: 'aadhaar_verified.pdf' },
    { id: 'dl', name: 'Driving License / Two-Wheeler RC', required: true, status: 'PENDING' },
    { id: 'bank', name: 'Bank Passbook / Cancelled Cheque (For Payouts)', required: true, status: 'PENDING' },
    { id: 'cert', name: 'Technical Trade Diploma / ITI Certificate', required: false, status: 'PENDING' },
  ]);

  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSimulateUpload = (id: string) => {
    setUploadingId(id);
    setTimeout(() => {
      setDocs((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: 'UPLOADED', fileName: `${id}_document_scan.pdf` } : d))
      );
      setUploadingId(null);
      setSuccessMsg('Document uploaded and queued for operations verification.');
      setTimeout(() => setSuccessMsg(null), 3000);
    }, 1000);
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
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Upload Verification Documents</h1>
              <p className="text-xs text-slate-500">Attach legal documents to complete your fleet credentialing.</p>
            </div>
          </div>

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="space-y-3">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{doc.name}</span>
                    {doc.required && (
                      <span className="text-[9px] font-black uppercase bg-rose-50 text-rose-700 px-1.5 py-0.2 rounded">
                        Required
                      </span>
                    )}
                  </div>
                  {doc.fileName ? (
                    <span className="text-[11px] font-mono text-emerald-800 block mt-0.5">
                      ✓ {doc.fileName}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Max file size: 5MB (JPG, PNG, PDF)
                    </span>
                  )}
                </div>

                <div>
                  {doc.status === 'UPLOADED' ? (
                    <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-[11px] font-bold">
                      Uploaded
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSimulateUpload(doc.id)}
                      disabled={uploadingId === doc.id}
                      className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {uploadingId === doc.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Upload</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => router.push('/professional/pro/skills')}
              className="w-full py-3.5 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl shadow transition text-xs flex items-center justify-center gap-2"
            >
              <span>Continue to Trade Skills</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

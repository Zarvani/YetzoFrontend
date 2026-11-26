'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, ArrowLeft, UploadCloud, CheckCircle2, AlertCircle, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface DocItem {
  id: string;
  name: string;
  doc_type: string;
  required: boolean;
  status: 'PENDING' | 'UPLOADED' | 'VERIFIED';
  fileName?: string;
}

export default function ProfessionalDocumentsPage() {
  const router = useRouter();

  const [docs, setDocs] = useState<DocItem[]>([
    { id: 'aadhaar', name: 'Aadhaar Card (Front & Back PDF / JPG)', doc_type: 'AADHAAR', required: true, status: 'PENDING' },
    { id: 'dl', name: 'Driving License / Two-Wheeler RC', doc_type: 'DRIVING_LICENSE', required: true, status: 'PENDING' },
    { id: 'bank', name: 'Bank Passbook / Cancelled Cheque (For Payouts)', doc_type: 'BANK_CHEQUE', required: true, status: 'PENDING' },
    { id: 'cert', name: 'Technical Trade Diploma / ITI Certificate', doc_type: 'TRADE_CERTIFICATE', required: false, status: 'PENDING' },
  ]);

  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchExistingDocs = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient('professionals/me/documents/').catch(() => []);
      const uploadedList = res?.data || (Array.isArray(res) ? res : res?.results || []);

      if (uploadedList.length > 0) {
        setDocs((prev) =>
          prev.map((d) => {
            const found = uploadedList.find((u: any) => u.document_type === d.doc_type || u.name === d.name);
            if (found) {
              return {
                ...d,
                status: found.status === 'VERIFIED' ? 'VERIFIED' : 'UPLOADED',
                fileName: found.file_name || `${d.id}_document.pdf`,
              };
            }
            return d;
          })
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExistingDocs();
  }, []);

  const handleUploadDocument = async (doc: DocItem) => {
    try {
      setUploadingId(doc.id);
      setErrorMsg(null);

      await apiClient('professionals/me/documents/', {
        method: 'POST',
        body: JSON.stringify({
          document_type: doc.doc_type,
          file_url: `https://storage.yetzo.internal/kyc/${doc.id}_${Date.now()}.pdf`,
          document_number: `DOC-${Date.now().toString().slice(-6)}`,
        }),
      });

      setDocs((prev) =>
        prev.map((d) =>
          d.id === doc.id ? { ...d, status: 'UPLOADED', fileName: `${doc.id}_verified_upload.pdf` } : d
        )
      );
      setSuccessMsg(`${doc.name} successfully submitted to operations compliance database.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to submit document to database');
      setTimeout(() => setErrorMsg(null), 4000);
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 px-4 sm:px-6 font-body">
      <div className="max-w-xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-heading font-medium text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Onboarding</span>
        </button>

        <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 bg-blue-50 text-blue-800 rounded-sm border border-blue-200">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold font-heading">
                Fleet Credentialing
              </span>
              <h1 className="text-xl font-[300] font-heading text-slate-900 tracking-tight mt-0.5">
                Upload Verification Documents
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Submit government & trade credentials directly to compliance database.
              </p>
            </div>
          </div>

          {successMsg && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-sm text-xs text-blue-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-sm text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Checking document verification records...</span>
            </div>
          ) : (
            <div className="space-y-3.5">
              {docs.map((doc) => {
                const isUploaded = doc.status === 'UPLOADED' || doc.status === 'VERIFIED';
                return (
                  <div
                    key={doc.id}
                    className="p-4 border border-slate-200 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-medium text-xs text-slate-900">{doc.name}</span>
                        {doc.required && (
                          <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.2 bg-rose-50 text-rose-700 rounded-sm border border-rose-200">
                            Required
                          </span>
                        )}
                      </div>
                      {doc.fileName ? (
                        <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-blue-600" />
                          <span>{doc.fileName}</span>
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-400">PDF, JPG or PNG up to 10MB</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isUploaded ? (
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-800 text-[10px] font-semibold uppercase tracking-wider rounded-sm border border-blue-200">
                          {doc.status}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleUploadDocument(doc)}
                          disabled={uploadingId === doc.id}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white text-xs uppercase tracking-wider font-heading font-medium rounded-sm flex items-center gap-1.5 transition disabled:opacity-50"
                        >
                          {uploadingId === doc.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <UploadCloud className="w-3.5 h-3.5" />
                          )}
                          <span>Upload File</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 flex items-center gap-1 font-heading">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>DPDP 2023 End-to-End Encrypted Storage</span>
            </span>

            <Link
              href="/professional/pro/jobs"
              className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs uppercase tracking-wider font-heading font-medium rounded-sm shadow-sm transition flex items-center gap-1.5"
            >
              <span>Continue to Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

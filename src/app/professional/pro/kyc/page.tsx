'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { motion, AnimatePresence } from 'framer-motion';

export default function DocumentVerificationScreen() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [kycDocs, setKycDocs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchKyc = async () => {
      try {
        const res = await apiClient<any>('kyc/');
        setKycDocs(res?.results || res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchKyc();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('document_type', 'id_proof');
      
      await apiClient('kyc/', {
        method: 'POST',
        body: formData,
        // Let the browser set the content type with the boundary
        headers: { 'Accept': 'application/json' }
      });
      alert('Document uploaded successfully!');
      setSelectedFile(null);
      
      // Refresh docs
      const res = await apiClient<any>('kyc/');
      setKycDocs(res?.results || res || []);
    } catch (err) {
      alert('Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Header */}
      <header className="bg-slate-900 text-white px-4 py-5 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div>
           <h1 className="text-lg font-bold">Document Verification</h1>
           <p className="text-xs text-slate-400 mt-0.5">Partner Portal</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 rounded-full px-3 py-1.5 border border-slate-700">
           <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
           <span className="text-xs font-bold">{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </header>

      <main className="max-w-xl mx-auto p-4 mt-4 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
           <h3 className="font-black text-slate-900 text-xl mb-2">Upload KYC Document</h3>
           <p className="text-sm text-slate-500 mb-6 leading-relaxed">Please upload your valid ID proof (Aadhar, PAN, or Driver's License) to verify your account.</p>
           
           <div className="border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-xl p-8 text-center mb-4 transition-colors hover:bg-blue-50 cursor-pointer relative">
             <input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" accept=".jpg,.jpeg,.png,.pdf" />
             <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">📄</div>
             <p className="font-bold text-slate-700">{selectedFile ? selectedFile.name : 'Tap to select a document'}</p>
             <p className="text-xs text-slate-500 mt-1">JPG, PNG or PDF (Max 5MB)</p>
           </div>

           <button 
             onClick={handleUpload} 
             disabled={!selectedFile || isUploading}
             className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 disabled:opacity-50 transition-all"
           >
             {isUploading ? 'Uploading...' : 'Submit Document'}
           </button>
        </motion.div>

        <h3 className="font-bold text-slate-900 text-lg mb-2">Your Documents</h3>
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-20 bg-slate-200 rounded-xl w-full"></div>
            <div className="h-20 bg-slate-200 rounded-xl w-full"></div>
          </div>
        ) : kycDocs.length === 0 ? (
          <div className="text-center py-8 text-slate-500 font-medium bg-white rounded-xl border border-slate-100">
            No documents uploaded yet.
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {kycDocs.map((doc, idx) => (
                <motion.div key={doc.id || idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">📄</div>
                    <div>
                      <p className="font-bold text-slate-900 capitalize">{doc.document_type || 'ID Proof'}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{new Date(doc.created_at || Date.now()).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${doc.status === 'verified' ? 'bg-green-100 text-green-700' : doc.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {doc.status || 'Pending'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Partner Bottom Nav */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-xl mx-auto flex justify-around p-2">
          <button onClick={() => router.push('/professional/pro')} className="flex flex-col items-center p-2 text-blue-600">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            <span className="text-[10px] font-bold">Jobs</span>
          </button>
          <button onClick={() => router.push('/professional/pro/earnings')} className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-900">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span className="text-[10px] font-bold">Earnings</span>
          </button>
          <button onClick={() => router.push('/professional/pro/profile')} className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-900">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            <span className="text-[10px] font-bold">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';

function ServicesInCategoryContent() {
  const router = useRouter();
  const params = useParams();
  const categorySlug = params?.category as string;
  
  const [category, setCategory] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categorySlug) return;
    Promise.all([
      apiClient(`categories/${categorySlug}/`).catch(() => null),
      apiClient(`services/?category__slug=${categorySlug}`).catch(() => ({ results: [] })),
    ]).then(([catData, srvData]: any[]) => {
      setCategory(catData);
      setServices(srvData?.results || srvData || []);
    }).finally(() => setLoading(false));
  }, [categorySlug]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 px-4 py-4 flex items-center gap-4 sticky top-0 z-50">
        <button onClick={() => router.push('/services')} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div>
          {loading ? <div className="h-5 w-32 bg-slate-200 rounded animate-pulse"></div> : <h1 className="text-xl font-black text-slate-900">{category?.name || categorySlug}</h1>}
          <p className="text-xs text-slate-500 font-medium">{services.length} services available</p>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-4">{Array(5).fill(0).map((_,i) => <div key={i} className="bg-white h-24 rounded-2xl animate-pulse border border-slate-200"></div>)}</div>
        ) : services.map((srv: any) => (
          <div key={srv.id} onClick={() => router.push(`/service/${srv.slug}`)} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-4 flex gap-4 cursor-pointer hover:border-blue-300 transition-all">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 shrink-0 overflow-hidden">
              {srv.image_url || srv.image ? <img src={srv.image_url || srv.image} alt={srv.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🔧</div>}
            </div>
            <div className="flex-1">
              <h3 className="font-black text-slate-900 mb-1">{srv.name}</h3>
              <p className="text-sm text-slate-500 font-medium mb-2 line-clamp-2">{srv.short_description || srv.description || ''}</p>
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900">₹{srv.base_price}</span>
                <button className="bg-blue-600 text-white font-bold px-4 py-1.5 rounded-xl text-sm">Book Now</button>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default function ServicesInCategoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans text-slate-400 font-bold">Loading category...</div>}>
      <ServicesInCategoryContent />
    </Suspense>
  );
}

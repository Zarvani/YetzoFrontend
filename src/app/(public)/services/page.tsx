'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';

export default function ServicesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiClient('categories/').catch(() => ({ results: [] })),
      apiClient('services/').catch(() => ({ results: [] })),
    ]).then(([catData, srvData]: any[]) => {
      const cats = catData?.results || catData || [];
      const srvs = srvData?.results || srvData || [];
      setCategories(cats);
      setServices(srvs);
      if (cats.length > 0) setActiveCategory(cats[0].id);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory ? services.filter((s: any) => s.category?.id === activeCategory || s.category === activeCategory) : services;

  return (
    <div className="bg-slate-50 font-sans min-h-screen">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <h1 className="text-4xl font-black text-slate-900 mb-2">All Services</h1>
        <p className="text-slate-500 font-medium mb-8">Expert home services, delivered at your doorstep</p>

        {/* Category Filter */}
        {!loading && categories.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-8">
            {categories.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all shrink-0 ${activeCategory === cat.id ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_,i) => <div key={i} className="bg-white h-56 rounded-3xl animate-pulse border border-slate-200"></div>)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-black text-slate-900">No services found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((srv: any) => (
              <div
                key={srv.id}
                onClick={() => router.push(`/service/${srv.slug}`)}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="h-36 bg-slate-100 overflow-hidden">
                  {srv.image_url || srv.image ? (
                    <img src={srv.image_url || srv.image} alt={srv.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🔧</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-black text-slate-900 text-sm leading-tight mb-1">{srv.name}</h3>
                  <p className="text-blue-600 font-black text-base">₹{srv.base_price}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    <span className="text-xs font-bold text-slate-600">{srv.rating || '4.8'} ({srv.total_reviews || '0'})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

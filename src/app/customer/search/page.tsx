'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, ArrowLeft, ArrowRight, Star, Clock, Tag } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

function CustomerSearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const [srvRes, catRes]: any = await Promise.all([
        apiClient('services/'),
        apiClient('categories/'),
      ]);
      setServices(srvRes?.data || (Array.isArray(srvRes) ? srvRes : []));
      setCategories(catRes?.data || (Array.isArray(catRes) ? catRes : []));
    } catch (e) {
      console.warn('Catalog fetch note:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((srv) => {
    const matchesQuery = (srv.name || '').toLowerCase().includes(query.toLowerCase()) ||
      (srv.description || '').toLowerCase().includes(query.toLowerCase());
    const matchesCat = selectedCat === 'ALL' || srv.category?.slug === selectedCat || srv.category?.name === selectedCat;
    return matchesQuery && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Search Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search AC repair, bathroom cleaning, maid service..."
              className="w-full text-xs pl-10 pr-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-[#059669] text-slate-900 bg-white shadow-sm"
              autoFocus
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCat('ALL')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition ${
              selectedCat === 'ALL'
                ? 'bg-[#059669] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Services
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.slug || cat.name)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition ${
                selectedCat === (cat.slug || cat.name)
                  ? 'bg-[#059669] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filteredServices.length} home services</span>
            <span>Pronto & Urban Company Standards</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">Loading services catalog...</div>
          ) : filteredServices.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white space-y-2">
              <Search className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700 text-sm">No matching services found</h3>
              <p className="text-xs text-slate-400">Try searching for AC, cleaning, or plumbing.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredServices.map((srv) => (
                <Link
                  key={srv.id}
                  href={`/customer/booking?serviceId=${srv.id}`}
                  className="bg-white border border-slate-200 hover:border-[#059669] p-4 rounded-2xl shadow-sm transition flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-extrabold text-sm text-slate-900 group-hover:text-[#059669] transition">
                        {srv.name}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                        ₹{srv.pricing_rules?.[0]?.base_price || 499}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {srv.category?.name || 'Home Care'}
                    </span>
                    <span className="font-bold text-[#059669] flex items-center gap-1 group-hover:translate-x-1 transition">
                      Book Now <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CustomerSearchPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-slate-400 font-bold">Loading search...</div>}>
      <CustomerSearchPageContent />
    </React.Suspense>
  );
}

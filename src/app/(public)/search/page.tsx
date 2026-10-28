'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data: any = await apiClient(`services/?search=${encodeURIComponent(q)}`);
      setResults(data?.results || data || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => { if (query.length > 2) handleSearch(query); }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  const popular = ['AC Service', 'Deep Cleaning', 'Plumbing', 'Electrical', 'Pest Control', 'Painting'];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <title>Search Services — Yetzo</title>
      <header className="bg-white border-b border-slate-200 px-4 py-4 flex items-center gap-4 sticky top-0 z-50">
        <button onClick={() => router.back()} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div className="flex-1 relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input
            autoFocus
            type="text"
            placeholder="Search for a service..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-slate-100 border-none rounded-2xl pl-12 pr-4 py-3.5 font-medium text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4">
        {!searched && (
          <div>
            <p className="text-sm font-black text-slate-500 uppercase tracking-wider mb-4">Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {popular.map((p, i) => (
                <button key={i} onClick={() => { setQuery(p); handleSearch(p); }} className="bg-white border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm hover:border-blue-400 hover:text-blue-600 transition-colors">
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="space-y-3 mt-4">{Array(4).fill(0).map((_,i) => <div key={i} className="bg-white h-20 rounded-2xl animate-pulse border border-slate-200"></div>)}</div>
        )}

        {searched && !loading && results.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-black text-slate-900">No results for "{query}"</h3>
            <p className="text-slate-500 font-medium mt-2">Try a different keyword</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-4 space-y-3">
            <p className="text-sm font-bold text-slate-500">{results.length} results for "{query}"</p>
            {results.map((srv: any) => (
              <div key={srv.id} onClick={() => router.push(`/service/${srv.slug}`)} className="bg-white p-4 rounded-2xl border border-slate-200 flex gap-4 cursor-pointer hover:border-blue-300 transition-all">
                <div className="w-16 h-16 rounded-xl bg-slate-100 shrink-0 overflow-hidden">
                  {srv.image_url || srv.image ? <img src={srv.image_url || srv.image} alt={srv.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🔧</div>}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-slate-900">{srv.name}</h3>
                  <p className="text-sm text-slate-500 font-medium mt-0.5">{srv.category?.name}</p>
                  <p className="font-black text-blue-600 mt-1">₹{srv.base_price}</p>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

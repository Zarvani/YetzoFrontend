'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';

function FallbackScreenInner() {
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Deriving the API endpoint from the pathname
  // e.g. /professional/pro/earnings -> earnings/
  // e.g. /operations/ops/refunds -> refunds/
  const getEndpointFromPath = (path: string) => {
    let clean = path.replace(/^\//, ''); // remove leading slash
    
    // Map known prefixes
    if (clean.startsWith('professional/pro/')) {
      return clean.replace('professional/pro/', '');
    }
    if (clean.startsWith('operations/ops/')) {
      return clean.replace('operations/ops/', '');
    }
    if (clean.startsWith('admin/')) {
      return clean.replace('admin/', 'admin-core/');
    }
    if (clean.startsWith('customer/')) {
      return clean.replace('customer/', '');
    }
    
    return clean;
  };

  useEffect(() => {
    const endpoint = getEndpointFromPath(pathname);
    const fetchData = async () => {
      try {
        const response = await apiClient(`${endpoint}/`);
        setData(response);
      } catch (e: any) {
        if (e.message.includes('401')) {
          router.push('/login');
        } else {
          setData({ _error: 'Failed to fetch', details: e.message }); 
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pathname, router]);

  const renderValue = (val: any): React.ReactNode => {
    if (val === null || val === undefined) return <span className="text-slate-400">null</span>;
    if (typeof val === 'boolean') return <span className={`px-2 py-0.5 rounded text-xs font-bold ${val ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{val ? 'True' : 'False'}</span>;
    if (typeof val === 'object') {
      if (Array.isArray(val)) {
        if (val.length === 0) return <span className="text-slate-400">[]</span>;
        return (
          <div className="space-y-2">
            {val.map((item, i) => (
              <div key={i} className="bg-slate-50 p-2 rounded border border-slate-100">{renderValue(item)}</div>
            ))}
          </div>
        );
      }
      return (
        <div className="space-y-1">
          {Object.entries(val).map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase">{k}:</span>
              <div className="text-sm">{renderValue(v)}</div>
            </div>
          ))}
        </div>
      );
    }
    return <span>{String(val)}</span>;
  };

  const title = pathname.split('/').pop() || 'Dashboard';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <h1 className="text-xl font-black text-slate-900 capitalize">{title}</h1>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        <div className="mb-6 flex justify-between items-end border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2 capitalize">{title}</h2>
            <p className="text-slate-500 font-medium flex items-center gap-2 text-sm">
              Endpoint: <code className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">{getEndpointFromPath(pathname)}/</code>
            </p>
          </div>
        </div>
        
        {loading ? (
          <div className="w-full h-64 bg-white rounded-3xl animate-pulse border border-slate-200"></div>
        ) : data?._error ? (
          <div className="bg-red-50 p-6 rounded-3xl border border-red-100 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-red-800 font-black mb-2">Could not load data</h3>
            <p className="text-red-600 text-sm">{data.details}</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <h3 className="font-black text-slate-900 mb-4 border-b border-slate-100 pb-2">Live API Data</h3>
            <div className="text-sm text-slate-700">
              {renderValue(data?.data || data?.results || data)}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function FallbackScreen() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans text-slate-400 font-bold">Loading...</div>}>
      <FallbackScreenInner />
    </Suspense>
  );
}


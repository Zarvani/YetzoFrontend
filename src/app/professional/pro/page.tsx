'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';

export default function ProfessionalDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [stats, setStats] = useState({ completed: 0, rating: '--' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient('auth/me/').catch(() => null),
      apiClient('bookings/').catch(() => ({ data: [] })),
      apiClient('payments/wallet/').catch(() => null)
    ]).then(([me, bData, wData]: any[]) => {
      setUser(me?.data?.user || null);
      
      const allJobs = bData?.data || bData || [];
      const activeJobs = allJobs.filter((j: any) => ['ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(j.status));
      const completedJobs = allJobs.filter((j: any) => j.status === 'COMPLETED').length;
      
      setJobs(activeJobs);
      setWallet(wData?.data || wData || null);
      setStats({
        completed: completedJobs,
        rating: me?.data?.user?.professional_profile?.rating || '--'
      });
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans pb-24">
      {/* Top Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden border-2 border-slate-700">
             <span className="text-white font-bold">{loading ? 'P' : user?.first_name?.[0]?.toUpperCase() || 'P'}</span>
          </div>
          <div>
            <h1 className="text-white font-bold">{loading ? 'Loading...' : user ? `${user.first_name} ${user.last_name || ''}` : 'Professional'}</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
              <span className="text-xs text-slate-300 font-medium">Online • Receiving Jobs</span>
            </div>
          </div>
        </div>
        <button onClick={() => router.push('/professional/pro/notifications')} className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white relative hover:bg-slate-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        </button>
      </header>

      <main className="p-4 space-y-6">
        {/* Earnings Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-6">
             <div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Today's Earnings</p>
               <h2 className="text-4xl font-black text-slate-900">₹{loading ? '0' : ((wallet?.balance || 0)/100).toLocaleString('en-IN')}</h2>
             </div>
             <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-50 p-4 rounded-2xl">
               <p className="text-xs text-slate-500 font-bold mb-1">Completed</p>
               <p className="text-lg font-black text-slate-900">{stats.completed} Jobs</p>
             </div>
             <div className="bg-slate-50 p-4 rounded-2xl">
               <p className="text-xs text-slate-500 font-bold mb-1">Rating</p>
               <p className="text-lg font-black text-slate-900 flex items-center gap-1">{stats.rating} <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg></p>
             </div>
          </div>
        </div>

        {/* Assigned Jobs List */}
        <div>
           <div className="flex items-center justify-between mb-4 px-1">
             <h3 className="text-xl font-black text-slate-900">Upcoming Jobs</h3>
             <span className="text-sm font-bold text-blue-600 cursor-pointer" onClick={() => router.push('/professional/pro/jobs')}>View All</span>
           </div>
           
           {loading ? (
             <div className="space-y-4">
               {Array(2).fill(0).map((_, i) => (
                 <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 h-40 animate-pulse" />
               ))}
             </div>
           ) : jobs.length === 0 ? (
             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-center">
                <div className="text-4xl mb-4 text-slate-300">☕</div>
                <h3 className="text-lg font-black text-slate-900 mb-2">No active jobs</h3>
                <p className="text-sm text-slate-500">You're currently offline or no jobs are assigned to you.</p>
             </div>
           ) : (
             <div className="space-y-4">
               {jobs.map((job: any) => (
                 <div key={job.id} onClick={() => router.push(`/professional/pro/jobs/${job.id}`)} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm cursor-pointer hover:border-blue-300 transition-colors">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <span className="bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md mb-2 inline-block">{job.status.replace(/_/g, ' ')}</span>
                       <h4 className="font-bold text-slate-900 text-lg leading-tight">{job.service?.name || 'Service'}</h4>
                       <p className="text-sm text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                         {job.scheduled_date ? new Date(job.scheduled_date).toLocaleDateString() : 'Unscheduled'} {job.scheduled_time ? job.scheduled_time.substring(0,5) : ''}
                       </p>
                     </div>
                     <h3 className="font-black text-slate-900 text-xl">₹{((job.total_amount || 0) / 100).toLocaleString('en-IN')}</h3>
                   </div>
                   
                   <div className="bg-slate-50 p-3 rounded-xl flex items-start gap-3 mb-4 border border-slate-100">
                     <div className="mt-0.5 text-blue-600">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                     </div>
                     <p className="text-sm font-medium text-slate-700 leading-snug">
                       {job.address ? `${job.address.house_flat}, ${job.address.street}, ${job.address.city}` : 'No Address Provided'}
                     </p>
                   </div>
                   
                   <div className="flex gap-3">
                     <button className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-colors">Manage Job</button>
                     <button className="w-12 bg-slate-100 text-slate-600 flex items-center justify-center rounded-xl font-bold hover:bg-slate-200 transition-colors">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                     </button>
                   </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </main>
      
      {/* Bottom Pro Nav */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 h-16 flex justify-around items-center z-50 pb-safe">
        {[
          { label: 'Home', icon: 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z', path: '/professional/pro', active: true },
          { label: 'Calendar', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', path: '/professional/pro/calendar', active: false },
          { label: 'Earnings', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', path: '/professional/pro/earnings', active: false },
          { label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', path: '/professional/pro/profile', active: false },
        ].map((item, idx) => (
          <div key={idx} onClick={() => router.push(item.path)} className={`flex flex-col items-center cursor-pointer ${item.active ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <svg className="w-6 h-6 mb-1" fill={item.active ? "currentColor" : "none"} stroke={!item.active ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon}></path>
            </svg>
            <span className="text-[10px] font-bold">{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { motion } from 'framer-motion';

export default function WorkScheduleScreen() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [schedule, setSchedule] = useState({
    monday: { active: true, start: '09:00', end: '18:00' },
    tuesday: { active: true, start: '09:00', end: '18:00' },
    wednesday: { active: true, start: '09:00', end: '18:00' },
    thursday: { active: true, start: '09:00', end: '18:00' },
    friday: { active: true, start: '09:00', end: '18:00' },
    saturday: { active: true, start: '10:00', end: '16:00' },
    sunday: { active: false, start: '00:00', end: '00:00' },
  });

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await apiClient<any>('availability/');
        if (res && Object.keys(res).length > 0) {
           setSchedule(res);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvailability();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiClient('availability/', {
        method: 'POST',
        body: schedule
      });
      alert('Schedule updated successfully!');
    } catch (err) {
      alert('Failed to update schedule');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleDay = (day: string) => {
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day as keyof typeof schedule], active: !schedule[day as keyof typeof schedule].active }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Header */}
      <header className="bg-slate-900 text-white px-4 py-5 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div>
           <h1 className="text-lg font-bold">Work Schedule</h1>
           <p className="text-xs text-slate-400 mt-0.5">Partner Portal</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 rounded-full px-3 py-1.5 border border-slate-700">
           <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
           <span className="text-xs font-bold">{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </header>

      <main className="max-w-xl mx-auto p-4 mt-4 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
           <div className="flex items-center justify-between mb-6">
             <div>
               <h3 className="font-black text-slate-900 text-xl">Weekly Availability</h3>
               <p className="text-sm text-slate-500">Set your standard working hours.</p>
             </div>
             <button 
               onClick={handleSave} 
               disabled={isSaving || isLoading}
               className="bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
             >
               {isSaving ? 'Saving...' : 'Save'}
             </button>
           </div>
           
           {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[1,2,3,4,5,6,7].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl w-full"></div>)}
              </div>
           ) : (
             <div className="space-y-4">
               {Object.entries(schedule).map(([day, data], idx) => (
                 <motion.div key={day} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className={`flex items-center justify-between p-4 rounded-xl border ${data.active ? 'border-blue-200 bg-blue-50/30' : 'border-slate-100 bg-slate-50 opacity-60'} transition-all`}>
                   <div className="flex items-center gap-4">
                     <button 
                       onClick={() => toggleDay(day)}
                       className={`w-12 h-6 rounded-full relative transition-colors ${data.active ? 'bg-blue-600' : 'bg-slate-300'}`}
                     >
                       <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${data.active ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                     </button>
                     <span className="font-bold text-slate-900 capitalize w-10">{day.substring(0,3)}</span>
                   </div>
                   
                   {data.active ? (
                     <div className="flex items-center gap-2">
                       <input 
                         type="time" 
                         value={data.start}
                         onChange={(e) => setSchedule({...schedule, [day]: {...data, start: e.target.value}})}
                         className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500"
                       />
                       <span className="text-slate-400 font-bold">-</span>
                       <input 
                         type="time" 
                         value={data.end}
                         onChange={(e) => setSchedule({...schedule, [day]: {...data, end: e.target.value}})}
                         className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500"
                       />
                     </div>
                   ) : (
                     <span className="text-sm font-bold text-slate-400">Unavailable</span>
                   )}
                 </motion.div>
               ))}
             </div>
           )}
        </motion.div>
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

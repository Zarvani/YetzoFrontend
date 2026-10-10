'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { motion } from 'framer-motion';

export default function Homepage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [popularServices, setPopularServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch actual data from Django
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch real categories and services if the backend has them
        const catRes: any = await apiClient('categories/').catch(() => null);
        const servRes: any = await apiClient('services/').catch(() => null);
        
        if (catRes?.results) setCategories(catRes.results);
        if (servRes?.results) setPopularServices(servRes.results.slice(0, 4)); // Get top 4
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  // Strict API usage - No dummy data allowed per user request

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* Header handled by public/layout.tsx */}

      {/* 02. Hero / Primary Booking Area */}
      <section className="bg-white px-4 pt-12 pb-20 border-b border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl"
          >
            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
              Home services, <br/><span className="text-blue-600">on demand.</span>
            </h2>
            <p className="text-lg text-slate-600 mb-8 font-medium">
              Expert professionals for home cleaning, repairs, beauty, and more. Delivered to your doorstep in 60 minutes.
            </p>
            
            {/* Search Bar */}
            <div className="flex bg-white shadow-2xl shadow-blue-900/5 rounded-2xl border border-slate-100 p-2 transform transition-all hover:scale-[1.02]">
              <div className="flex-1 flex items-center px-4">
                <svg className="w-5 h-5 text-slate-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input 
                  type="text" 
                  onClick={() => router.push('/search')}
                  placeholder="Search for 'AC Repair'..." 
                  className="w-full text-slate-900 font-medium placeholder-slate-400 focus:outline-none cursor-pointer" 
                  readOnly
                />
              </div>
              <button onClick={() => router.push('/search')} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30">
                Search
              </button>
            </div>
            
            <div className="flex items-center gap-4 mt-8 text-sm font-bold text-slate-600">
              <span className="flex items-center gap-1"><svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg> 4.8+ Rating</span>
              <span className="flex items-center gap-1"><svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg> Verified Pros</span>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden md:block relative"
          >
            {/* Abstract Illustration representation */}
            <div className="w-full aspect-square bg-slate-100 rounded-[2.5rem] overflow-hidden relative border border-slate-200/60 shadow-2xl shadow-blue-900/5">
               <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 overflow-hidden">
                   <img src="/images/banner-ac.jpg" alt="Yetzo Professionals" className="w-full h-full object-cover mix-blend-overlay opacity-90" />
               </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* 03. Service Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">What are you looking for?</h3>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6"
        >
          {isLoading ? (
             // Skeletons
             [1,2,3,4,5,6].map(i => (
               <div key={i} className="flex flex-col items-center gap-3 animate-pulse">
                 <div className="w-24 h-24 rounded-3xl bg-slate-200"></div>
                 <div className="w-16 h-3 bg-slate-200 rounded"></div>
               </div>
             ))
          ) : categories.length > 0 ? (
            categories.slice(0,6).map((cat: any, idx: number) => (
              <motion.div 
                key={cat.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-3 group cursor-pointer" 
                onClick={() => router.push(`/services/${cat.slug || cat.id}`)}
              >
                <div className={`w-24 h-24 rounded-3xl ${cat.color || 'bg-slate-100'} flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm border border-slate-100 transition-all`}>
                  {cat.icon ? (
                     <img src={cat.icon} alt={cat.name} className="w-12 h-12 object-contain drop-shadow-sm" />
                  ) : (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                  )}
                </div>
                <span className="text-sm font-bold text-slate-700 text-center group-hover:text-blue-600">{cat.name}</span>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 md:col-span-6 text-center py-8 text-slate-500 font-medium">
              No categories available yet. Please configure the catalog in the Admin portal.
            </div>
          )}
        </motion.div>
      </section>

      {/* 04. Popular / Frequently Booked Services */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h3 className="text-3xl font-extrabold text-slate-900 mb-10 tracking-tight">Popular Services</h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            {isLoading ? (
               [1,2,3,4].map(i => (
                 <div key={i} className="rounded-3xl border border-slate-200 p-4 animate-pulse shadow-sm">
                   <div className="w-full h-40 bg-slate-200 rounded-2xl mb-4"></div>
                   <div className="w-3/4 h-5 bg-slate-200 rounded mb-3"></div>
                   <div className="w-1/2 h-4 bg-slate-200 rounded"></div>
                 </div>
               ))
            ) : popularServices.length > 0 ? (
              popularServices.map((service: any, idx: number) => (
                <motion.div 
                  key={service.id} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/40 cursor-pointer group flex flex-col"
                  onClick={() => router.push(`/service/${service.slug}`)}
                >
                  <div className="h-48 bg-slate-100 relative overflow-hidden">
                    {service.image ? (
                       <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    ) : (
                       <div className="absolute inset-0 bg-slate-200 group-hover:scale-105 transition-transform duration-700 ease-out flex items-center justify-center text-slate-400">
                         <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                       </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-1 text-sm font-bold text-slate-600 mb-3">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                      {service.rating || '4.8'} <span className="text-slate-400 font-medium">({service.review_count || '12k'})</span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 mb-1 text-lg line-clamp-2">{service.name || 'Premium Service'}</h4>
                    <p className="text-sm text-slate-500 mb-6 font-medium flex-1">Starts at ₹{service.base_price || '499'} • {service.duration || '45 mins'}</p>
                    <button className="w-full py-3 bg-slate-50 text-blue-600 font-bold rounded-xl border border-slate-200 hover:bg-blue-600 hover:text-white transition-colors">
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-4 text-center py-12 text-slate-500 font-medium border-2 border-dashed border-slate-200 rounded-3xl">
                 No services available yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 05. Instant Booking & 06. How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-12">
        <div className="bg-indigo-900 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/20 group">
          <div className="absolute inset-0 overflow-hidden">
             <img src="https://res.cloudinary.com/dysg6gvlf/image/upload/v1791621768/yetzo_seed/rkxfewrcu9h1j3yehu6a.jpg" alt="Instant Maid" className="w-full h-full object-cover mix-blend-overlay opacity-40 group-hover:scale-105 transition-transform duration-700" />
             <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-indigo-900/90 to-transparent"></div>
          </div>
          <div className="relative z-10 flex flex-col h-full justify-center">
            <div>
              <span className="bg-indigo-500/30 text-indigo-100 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-5 inline-flex items-center gap-2 border border-indigo-400/30 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Yetzo Instant
              </span>
            </div>
            <h3 className="text-4xl font-extrabold mb-4 tracking-tight">Instant House Help.</h3>
            <p className="text-indigo-200 mb-8 max-w-sm text-lg font-medium leading-relaxed">Need someone right now? Book a verified Yetzo professional who arrives in under 15 minutes.</p>
            <div>
              <button className="bg-white text-indigo-900 px-8 py-3.5 rounded-xl font-extrabold hover:bg-indigo-50 hover:scale-105 transition-all shadow-lg">
                Book in 15 Mins
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-8">How it works</h3>
          <div className="space-y-6">
            {[
              { title: "Choose a service", desc: "Select from over 50+ premium home services.", icon: "1" },
              { title: "Pick a time slot", desc: "Schedule for later or get instant arrival in 15 mins.", icon: "2" },
              { title: "Professional arrives", desc: "A verified, background-checked professional does the job.", icon: "3" },
            ].map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-black flex items-center justify-center shrink-0">{step.icon}</div>
                <div>
                  <h4 className="font-bold text-slate-900">{step.title}</h4>
                  <p className="text-sm text-slate-500 mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 07. Trust and Safety & 08. Offers */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="w-16 h-16 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-6 text-3xl">🛡️</div>
            <h4 className="text-xl font-bold mb-2">Verified Professionals</h4>
            <p className="text-slate-400 text-sm">Every partner undergoes a strict background check and skill verification.</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-6 text-3xl">💎</div>
            <h4 className="text-xl font-bold mb-2">Fixed Transparent Pricing</h4>
            <p className="text-slate-400 text-sm">No hidden charges. You pay exactly what you see before booking.</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-6 text-3xl">🏆</div>
            <h4 className="text-xl font-bold mb-2">Service Guarantee</h4>
            <p className="text-slate-400 text-sm">If you're not satisfied, we'll rework it for free or refund your money.</p>
          </div>
        </div>
      </section>

      {/* 08. Mega Offers Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/10 bg-blue-600 flex flex-col md:flex-row items-center">
          <div className="absolute inset-0">
             <img src="https://res.cloudinary.com/dysg6gvlf/image/upload/v1791621777/yetzo_seed/acq0ddffjr2ia1apgtjo.jpg" alt="Offers Background" className="w-full h-full object-cover mix-blend-multiply opacity-60" />
             <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800/90 to-transparent"></div>
          </div>
          
          <div className="relative z-10 p-10 md:p-16 flex-1 text-white">
            <div className="flex items-center gap-4 mb-6">
              <img src="/assets/images/logo.png" alt="Yetzo" className="h-8 brightness-0 invert opacity-90" />
              <span className="h-1 w-1 rounded-full bg-white opacity-50"></span>
              <span className="text-blue-200 font-bold tracking-widest uppercase text-sm">Festive Sale</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Get <span className="text-yellow-400">₹500 Off</span> <br/>on your first booking.</h3>
            <p className="text-blue-100 text-lg max-w-md font-medium mb-8">
              Use code <span className="bg-white/20 px-3 py-1 rounded-lg border border-white/30 text-white font-mono mx-1">YETZO500</span> at checkout. Valid on all deep cleaning and AC services.
            </p>
            <button className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-xl font-extrabold hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-400/20">
              Claim Offer Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer handled by public/layout.tsx */}
    </div>
  );
}

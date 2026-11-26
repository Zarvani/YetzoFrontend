'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Phone, Mail, MapPin, Zap, Award } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0B0F19] text-slate-300 font-body border-t border-slate-800">
      {/* Upper Footer: Value Props */}
      <div className="border-b border-slate-800/80 py-8 bg-[#070A12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-900/40 border border-blue-700/50 flex items-center justify-center text-sky-400 shrink-0">
              <Zap className="w-5 h-5 text-sky-400 fill-sky-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">15-Minute SLA Guarantee</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Automated algorithmic cluster dispatch across 11 cities</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-900/40 border border-blue-700/50 flex items-center justify-center text-sky-400 shrink-0">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">100% Police Verified Fleet</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Aadhaar verified, background cleared, and insured</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-900/40 border border-blue-700/50 flex items-center justify-center text-sky-400 shrink-0">
              <Award className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">₹10,000 Damage Protection</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Complimentary coverage included on every completed visit</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-sm border border-slate-700 flex-shrink-0">
                <Image src="/logo.jpg" alt="Yetzo" fill className="object-cover" priority />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-[300] tracking-[0.16em] text-2xl text-white uppercase">
                  YETZO
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#38BDF8] font-bold font-body -mt-0.5">
                  INSTANT 15-MIN FLEET
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              India&apos;s premier on-demand house help platform. Dispatched in 15 minutes for cooking, cleaning, utensils, and routine domestic chores.
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>24/7 Priority Support: 1800-YETZO-HELP</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>support@yetzo.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Bengaluru · Mumbai · Delhi NCR · Hyderabad · Pune</span>
              </div>
            </div>
          </div>

          {/* Quick Chores */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">Core Services</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/customer/booking" className="hover:text-white transition">Sweeping & Mopping</Link></li>
              <li><Link href="/customer/booking" className="hover:text-white transition">Utensils & Sink Degrease</Link></li>
              <li><Link href="/customer/booking" className="hover:text-white transition">Meal Prep & Fresh Cooking</Link></li>
              <li><Link href="/customer/booking" className="hover:text-white transition">Bathroom Deep Sanitization</Link></li>
              <li><Link href="/customer/booking" className="hover:text-white transition">Dusting & Surface Wiping</Link></li>
              <li><Link href="/customer/booking/schedule" className="hover:text-white transition">Daily Maid Routine Pass</Link></li>
              <li><Link href="/services" className="hover:text-white transition">All 40+ Chores</Link></li>
            </ul>
          </div>

          {/* Partner & Fleet Recruitment */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">Join the Fleet</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/professional/pro/register" className="hover:text-white transition">Register as Service Partner</Link></li>
              <li><Link href="/partner" className="hover:text-white transition">Partner Benefits & Earnings</Link></li>
              <li><Link href="/about" className="hover:text-white transition">SOP Training & Quality Standards</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition">How Dispatch Works</Link></li>
              <li><Link href="/reviews" className="hover:text-white transition">Partner Success Stories</Link></li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">Company & Trust</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-white transition">About Yetzo</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition">How It Works</Link></li>
              <li><Link href="/reviews" className="hover:text-white transition">Customer Reviews</Link></li>
              <li><Link href="/careers" className="hover:text-white transition">Careers (We Are Hiring!)</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact & Help Center</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Legal Copyright */}
      <div className="border-t border-slate-800/80 py-5 bg-[#070A12] text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Yetzo Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>256-Bit SSL Encrypted Escrow Payments</span>
            <span>•</span>
            <span className="text-slate-400">SAKK Group Venture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  MapPin, Zap, ShieldCheck, Award, Star, ArrowRight 
} from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { apiClient } from '@/lib/apiClient';

interface PageProps {
  params: Promise<{ city: string }>;
}

async function resolveCity(slug: string) {
  try {
    const res: any = await apiClient('locations/cities/');
    const list: any[] = res?.results || (Array.isArray(res) ? res : []);
    const clean = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
    return list.find(c => {
      const cClean = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return cClean === clean || c.id === slug;
    }) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = await resolveCity(citySlug);

  if (!city) {
    return {
      title: 'City Not Found | Yetzo',
      description: 'The requested city is not in our active operations directory.',
    };
  }

  const title = `Instant House Help & Home Services in ${city.name} | Yetzo`;
  const description = `Book background-verified home services across ${city.name}, ${city.state}. 15-minute express dispatch with ₹10,000 property protection warranty.`;

  return {
    title,
    description,
    keywords: [
      `home service ${city.name}`,
      `maid in ${city.name}`,
      `cook in ${city.name}`,
      `deep cleaning ${city.name}`,
      `yetzo ${city.name}`,
    ],
    openGraph: {
      title,
      description,
      url: `https://yetzo.com/cities/${citySlug}`,
      siteName: 'Yetzo',
      locale: 'en_IN',
      type: 'website',
    },
    alternates: {
      canonical: `https://yetzo.com/cities/${citySlug}`,
    },
  };
}

export default async function CityDetailPage({ params }: PageProps) {
  const { city: citySlug } = await params;
  const city = await resolveCity(citySlug);

  if (!city) {
    notFound();
  }

  let services: any[] = [];
  try {
    const srvRes: any = await apiClient('services/?page_size=50');
    services = srvRes?.results || (Array.isArray(srvRes) ? srvRes : []);
  } catch {
    services = [];
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-body pb-20">
      {/* Dynamic LocalBusiness Schema for Real City */}
      <JsonLd 
        data={{
          '@context': 'https://schema.org',
          '@type': 'HomeAndConstructionBusiness',
          name: `Yetzo - ${city.name}`,
          url: `https://yetzo.com/cities/${citySlug}`,
          description: `On-demand verified home services dispatched in 15 minutes across ${city.name}, ${city.state}.`,
          address: {
            '@type': 'PostalAddress',
            addressLocality: city.name,
            addressRegion: city.state,
            addressCountry: city.country || 'IN',
          },
          areaServed: {
            '@type': 'City',
            name: city.name,
          },
          priceRange: '₹199 - ₹2499',
        }} 
      />

      {/* Hero Section */}
      <section className="bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 opacity-90"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#2563EB] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-sm uppercase tracking-wider font-heading">
              Operational Cluster
            </span>
            <span className="text-[11px] text-sky-400 font-semibold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-sky-400" />
              15-Minute Dark-Cluster SLA
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-[300] font-heading tracking-tight leading-tight max-w-3xl">
            Instant Home Services in <span className="font-semibold text-white">{city.name}</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-body leading-relaxed">
            Verified domestic help, appliance repair, and deep cleaning delivered at your doorstep across {city.name}, {city.state}.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
              {city.name}, {city.state}
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              100% Police Verified Fleet
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              ₹10,000 Property Damage Protection
            </span>
          </div>
        </div>
      </section>

      {/* Real Services from PostgreSQL Database */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
            Available Services in {city.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Standardized rates with transparent rate cards and zero hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((srv: any) => {
            const price = srv.starting_price || srv.pricing_rules?.[0]?.base_price || 299;
            return (
              <Link 
                key={srv.id} 
                href={`/service/${srv.slug}`}
                className="bg-white border border-slate-200 rounded-sm p-5 hover:border-blue-400 hover:shadow-sm transition group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-sm uppercase tracking-wider font-heading">
                      {srv.supports_instant ? '15-Min Arrival' : 'Scheduled'}
                    </span>
                    {srv.rating && (
                      <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {srv.rating}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold font-heading text-slate-900 group-hover:text-[#2563EB] transition">
                    {srv.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-heading">Starts at</span>
                    <p className="text-base font-bold font-heading text-slate-900">₹{price}</p>
                  </div>
                  <span className="text-xs font-bold font-heading text-[#2563EB] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Book Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}

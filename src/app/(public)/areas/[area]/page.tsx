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
  params: Promise<{ area: string }>;
}

async function resolveZone(slug: string) {
  try {
    const res: any = await apiClient('locations/zones/');
    const list: any[] = res?.results || (Array.isArray(res) ? res : []);
    const clean = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
    return list.find(z => {
      const zClean = z.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return zClean === clean || z.id === slug;
    }) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { area: areaSlug } = await params;
  const zone = await resolveZone(areaSlug);

  if (!zone) {
    return {
      title: 'Area Not Found | Yetzo',
      description: 'The requested zone is not in our active database.',
    };
  }

  const title = `Instant House Help & Chores in ${zone.name} | Yetzo 15-Min SLA`;
  const description = `Book verified doorstep home services dispatched from ${zone.name} dark-cluster. Dispatched in 15 minutes with ₹10,000 damage warranty.`;

  return {
    title,
    description,
    keywords: [
      `home service ${zone.name}`,
      `maid in ${zone.name}`,
      `cleaning ${zone.name}`,
      'yetzo 15 minutes',
    ],
    openGraph: {
      title,
      description,
      url: `https://yetzo.com/areas/${areaSlug}`,
      siteName: 'Yetzo',
      locale: 'en_IN',
      type: 'website',
    },
    alternates: {
      canonical: `https://yetzo.com/areas/${areaSlug}`,
    },
  };
}

export default async function AreaDetailPage({ params }: PageProps) {
  const { area: areaSlug } = await params;
  const zone = await resolveZone(areaSlug);

  if (!zone) {
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
      <JsonLd 
        data={{
          '@context': 'https://schema.org',
          '@type': 'HomeAndConstructionBusiness',
          name: `Yetzo - ${zone.name}`,
          url: `https://yetzo.com/areas/${areaSlug}`,
          description: `Instant doorstep home help and service dispatch in ${zone.name}.`,
          areaServed: {
            '@type': 'AdministrativeArea',
            name: zone.name,
          },
          priceRange: '₹199 - ₹2499',
        }} 
      />

      <section className="bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden py-14 sm:py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 opacity-90"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#2563EB] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-sm uppercase tracking-wider font-heading">
              Hyperlocal Hub
            </span>
            <span className="text-[11px] text-sky-400 font-semibold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-sky-400" />
              15-Min Express Arrival
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-[300] font-heading tracking-tight leading-tight max-w-3xl">
            Instant Home Services in <span className="font-semibold text-white">{zone.name}</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-body leading-relaxed">
            Dark-cluster dispatched verified specialists right at your locality in {zone.name}.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
              {zone.name}
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              100% Police Verified
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              ₹10,000 Property Damage Protection
            </span>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <h2 className="text-xl font-bold font-heading text-slate-900">
          Available Services in {zone.name}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((srv: any) => {
            const price = srv.starting_price || srv.pricing_rules?.[0]?.base_price || 299;
            return (
              <Link 
                key={srv.id} 
                href={`/service/${srv.slug}`}
                className="bg-white border border-slate-200 rounded-sm p-5 hover:border-blue-400 transition group flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-2">
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

                <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-heading">Starts at</span>
                    <p className="text-base font-bold font-heading text-slate-900">₹{price}</p>
                  </div>
                  <span className="text-xs font-bold font-heading text-[#2563EB] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Book Instant</span>
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

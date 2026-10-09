import * as React from "react"
import { Header } from "@/components/layout/Header"
import { ServiceCard } from "@/components/service/ServiceCard"
import { apiClient } from "@/lib/apiClient"

// Define the Service interface matching Django serializer output
interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  starting_price: number;
  rating: number;
  reviews_count: number;
  supports_instant: boolean;
  supports_scheduled: boolean;
  category: {
    name: string;
    slug: string;
  };
}
import { Search, MapPin, CheckCircle2, Zap } from "lucide-react"

export default async function PublicHomepage() {
  let services: Service[] = [];
  try {
    services = await apiClient<Service[]>('v1/services/', { next: { revalidate: 60 } });
  } catch (err) {
    console.error("Failed to fetch services", err);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-[#0B2D8F] via-[#2563EB] to-[#06B6D4] text-white pt-20 pb-28 px-4">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <h1 className="text-[40px] md:text-[48px] font-bold leading-[1.15] tracking-tight mb-6">
              Trusted services.<br />Right when you need them.
            </h1>
            <p className="text-[18px] text-blue-50 leading-relaxed mb-10 font-light">
              Book verified professionals for your home, vehicle and everyday needs in minutes.
            </p>

            <div className="bg-white p-2 rounded-[16px] shadow-xl flex flex-col md:flex-row gap-2">
              <div className="flex items-center px-4 py-3 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200">
                <MapPin className="h-5 w-5 text-slate-400 mr-3" />
                <div className="flex-1">
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Location</p>
                  <p className="text-[15px] font-semibold text-slate-900 truncate">Agra, Uttar Pradesh</p>
                </div>
              </div>
              <div className="flex items-center px-4 py-3 md:flex-1">
                <Search className="h-5 w-5 text-slate-400 mr-3" />
                <div className="flex-1">
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Service</p>
                  <input type="text" placeholder="Search for AC, Cleaning, Plumbing..." className="w-full text-[15px] font-medium text-slate-900 placeholder:text-slate-400 outline-none bg-transparent" />
                </div>
              </div>
              <button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-[12px] px-8 py-4 font-bold text-[15px] transition-colors md:w-auto w-full mt-2 md:mt-0">
                Search
              </button>
            </div>
            
            <div className="mt-8 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-cyan-300" />
                <span className="text-sm font-medium">Verified Experts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-cyan-300" />
                <span className="text-sm font-medium">Transparent Pricing</span>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block relative">
            {/* The absolute paths provided by the generated artifacts. If we don't have them in public/, we can use API URLs or external */}
            <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden shadow-2xl border-4 border-white/10">
              <img src="/assets/images/ac-service.jpg" alt="AC Service Professional" className="object-cover w-full h-full" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop' }} />
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-[16px] shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Professional Arriving</p>
                  <p className="text-[16px] font-bold text-slate-900">Rahul K. • AC Technician</p>
                </div>
                <div className="bg-cyan-100 text-cyan-700 px-3 py-1.5 rounded-full text-[13px] font-bold flex items-center gap-1.5">
                  <Zap className="h-4 w-4" /> 12 Min
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR SERVICES SECTION */}
      <section className="py-20 px-4 max-w-[1280px] mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-[32px] font-bold text-slate-900 tracking-tight">Popular Services</h2>
            <p className="text-[16px] text-slate-500 mt-2">Most booked services in your area right now.</p>
          </div>
          <button className="hidden sm:block text-[#2563EB] font-bold hover:text-[#1D4ED8] transition-colors">
            View All Services →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              title={service.name}
              image={service.image_url || "/assets/images/ac-service.jpg"}
              rating={service.rating || 0}
              reviewsCount={`${service.reviews_count || 0}+`}
              price={service.starting_price || 0}
              isInstantAvailable={service.supports_instant}
              isScheduledAvailable={service.supports_scheduled}
              slug={service.slug}
            />
          ))}
        </div>
      </section>

      {/* WHY YETZO SECTION */}
      <section className="bg-white border-y border-slate-200 py-20 px-4">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[32px] font-bold text-slate-900 tracking-tight">Why choose Yetzo?</h2>
            <p className="text-[16px] text-slate-500 mt-2">The most trusted platform for your home services.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8 text-[#2563EB]" />
              </div>
              <h3 className="text-[18px] font-bold text-slate-900 mb-2">Verified Professionals</h3>
              <p className="text-[14px] text-slate-500 leading-relaxed">Every professional goes through rigorous background checks and skill verification.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-[#2563EB]" />
              </div>
              <h3 className="text-[18px] font-bold text-slate-900 mb-2">Instant Booking</h3>
              <p className="text-[14px] text-slate-500 leading-relaxed">Need it now? Our instant dispatch algorithm connects you to nearby pros in seconds.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-[18px] font-bold text-slate-900 mb-2">Transparent Pricing</h3>
              <p className="text-[14px] text-slate-500 leading-relaxed">No hidden fees or surprise charges. See the price upfront before you book.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-[18px] font-bold text-slate-900 mb-2">Service Guarantee</h3>
              <p className="text-[14px] text-slate-500 leading-relaxed">Not satisfied? We'll re-do the service for free or offer a refund with our 7-day warranty.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

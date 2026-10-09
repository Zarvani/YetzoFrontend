import * as React from "react"
import { SearchBar } from "@/components/ui/SearchBar"
import { Card, CardContent } from "@/components/ui/Card"
import Link from "next/link"

export default function ServicesCatalogPage() {
  const categories = [
    { name: "Appliance Repair", services: ["AC Service & Repair", "Washing Machine", "Refrigerator", "Microwave"] },
    { name: "Cleaning", services: ["Full Home Cleaning", "Sofa Cleaning", "Bathroom Cleaning"] },
    { name: "Plumbing", services: ["Leak Fix", "Tap Replacement", "Drain Blockage"] },
    { name: "Electrical", services: ["Switch/Socket Repair", "Fan Installation", "Wiring Check"] },
  ]

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-[32px] font-bold text-[#0F172A] tracking-tight">All Services</h1>
          <p className="text-[16px] text-[#475569] mt-2">Find exactly what you need.</p>
        </div>
        <SearchBar className="max-w-md w-full" placeholder="Search for AC repair, plumbing..." />
      </div>

      <div className="flex flex-col gap-12">
        {categories.map((category, idx) => (
          <div key={idx}>
            <h2 className="text-[24px] font-bold text-[#0F172A] mb-6 border-b border-slate-200 pb-2">{category.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {category.services.map((service, i) => (
                <Link href={`/service/${service.toLowerCase().replace(/ /g, '-')}`} key={i}>
                  <Card className="hover:border-[#2563EB] transition-colors cursor-pointer group">
                    <CardContent className="p-4 flex items-center justify-between">
                      <span className="font-semibold text-[15px] text-[#0F172A] group-hover:text-[#2563EB]">{service}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

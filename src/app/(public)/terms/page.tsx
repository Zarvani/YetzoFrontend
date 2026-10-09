export default function TermsPage() {
  return (
    <div className="max-w-[800px] mx-auto px-6 py-16">
      <h1 className="text-[32px] font-bold text-[#0F172A] tracking-tight mb-8">Terms of Service</h1>
      
      <div className="prose prose-slate max-w-none text-[#475569]">
        <p className="mb-4">Last updated: October 8, 2026</p>
        
        <h2 className="text-[20px] font-bold text-[#0F172A] mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing and using the Yetzo platform, you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2 className="text-[20px] font-bold text-[#0F172A] mt-8 mb-4">2. Description of Service</h2>
        <p className="mb-4">
          Yetzo provides an online marketplace connecting customers with verified independent professionals for home services, repairs, and other tasks.
        </p>

        <h2 className="text-[20px] font-bold text-[#0F172A] mt-8 mb-4">3. User Obligations</h2>
        <ul className="list-disc pl-5 mb-4 space-y-2">
          <li>You must provide accurate information when registering.</li>
          <li>You are responsible for maintaining the confidentiality of your account.</li>
          <li>You agree not to use the service for any illegal purposes.</li>
        </ul>
      </div>
    </div>
  )
}

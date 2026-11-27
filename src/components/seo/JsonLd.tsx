import React from 'react';

interface JsonLdProps {
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// 1. Root Local Business & GEO Schema
export const yetzoOrganizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: 'Yetzo',
  alternateName: ['Yetzo Technologies', 'Yetzo Home Services', 'Yetzo Chores in 15 Minutes'],
  url: 'https://yetzo.com',
  logo: 'https://yetzo.com/logo.png',
  image: 'https://yetzo.com/yetzo_app_mockup.png',
  description: "India's premier on-demand house help platform. Verified maids, cooks, cleaning, and domestic chores dispatched in 15 minutes.",
  priceRange: '₹149 - ₹1999',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, Credit Card, Debit Card, UPI, Net Banking',
  telephone: '+91-11-49202020',
  email: 'support@yetzo.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Priyadarshini Vihar',
    addressLocality: 'Delhi',
    addressRegion: 'Delhi',
    postalCode: '110092',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 28.6328,
    longitude: 77.2995,
  },
  areaServed: [
    { '@type': 'City', name: 'Delhi', containedInPlace: { '@type': 'State', name: 'Delhi' } },
    { '@type': 'City', name: 'Noida', containedInPlace: { '@type': 'State', name: 'Uttar Pradesh' } },
    { '@type': 'City', name: 'Gurgaon', containedInPlace: { '@type': 'State', name: 'Haryana' } },
    { '@type': 'City', name: 'Bengaluru', containedInPlace: { '@type': 'State', name: 'Karnataka' } },
    { '@type': 'City', name: 'Mumbai', containedInPlace: { '@type': 'State', name: 'Maharashtra' } },
    { '@type': 'City', name: 'Pune', containedInPlace: { '@type': 'State', name: 'Maharashtra' } },
    { '@type': 'City', name: 'Hyderabad', containedInPlace: { '@type': 'State', name: 'Telangana' } },
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '06:00',
      closes: '23:00',
    },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Instant House Chores & Domestic Help Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Sweeping & Mopping',
          description: 'Microfiber floor scrub, brooming & skirting sanitization dispatched in 15 mins.',
        },
        price: '199',
        priceCurrency: 'INR',
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Utensils & Sink Scrub',
          description: 'Dishwashing, grease removal & drying rack stacking dispatched in 15 mins.',
        },
        price: '179',
        priceCurrency: 'INR',
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Kitchen Meal Prep & Cooking',
          description: 'Veggie chopping, dough kneading & 2-dish home cooking dispatched in 15 mins.',
        },
        price: '299',
        priceCurrency: 'INR',
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Bathroom Deep Sanitization',
          description: 'Tiles scrub, commode disinfection & mirror polish dispatched in 15 mins.',
        },
        price: '249',
        priceCurrency: 'INR',
      },
    ],
  },
  sameAs: [
    'https://twitter.com/yetzo_in',
    'https://www.instagram.com/yetzo_in',
    'https://www.linkedin.com/company/yetzo',
    'https://www.facebook.com/yetzo.in',
  ],
};

// 2. AEO (Answer Engine Optimization) & GEO FAQ Schema
export const yetzoFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How quickly does Yetzo dispatch domestic house help?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yetzo dispatches verified domestic helpers, cooks, and cleaning professionals to your doorstep within 15 minutes of booking in supported metro areas.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Task Stacking on Yetzo and how does it save money?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Task Stacking allows households to combine two or more chores (such as sweeping, dishwashing, and meal prep) into a single continuous service session, automatically unlocking an instant 15% discount.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are Yetzo domestic workers background verified and safe?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. 100% of Yetzo partners undergo strict police record verification, government ID authentication (Aadhaar/PAN), and in-person professional trade skill testing prior to onboarding.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does Yetzo guarantee service security and fair billing at the doorstep?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yetzo enforces two-factor digital verification: a 4-digit Start OTP before work can begin, and a 4-digit Completion OTP before the partner can complete the job and initiate payment, preventing unverified charges.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which cities in India does Yetzo currently operate in?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yetzo operates across major Indian metropolitan hubs including Bengaluru, Delhi NCR, Gurgaon, Noida, Mumbai, and Pune, with ongoing rollouts across Hyderabad, Chennai, and Kolkata.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I book single services directly without subscribing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Yetzo offers on-demand instant single-chore bookings with zero mandatory subscriptions. Customers simply choose their chore, select their time or choose instant 15-minute dispatch, and pay upon completion.',
      },
    },
  ],
};

// 3. WebSite SearchAction Schema for Google Sitelinks Search Box
export const yetzoWebSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Yetzo',
  url: 'https://yetzo.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://yetzo.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

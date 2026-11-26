import type { Metadata, Viewport } from "next";
import { Montserrat, Sarabun } from "next/font/google";
import "./globals.css";
import { JsonLd, yetzoOrganizationSchema, yetzoFaqSchema, yetzoWebSiteSchema } from "@/components/seo/JsonLd";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  display: "swap",
});

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://yetzo.com"),
  title: {
    default: "Yetzo | Instant House Help in 15 Minutes",
    template: "%s | Yetzo",
  },
  description: "India's premier on-demand house help platform. Verified maids, cooks, cleaning, and domestic chores dispatched in 15 minutes.",
  keywords: [
    "house help in 15 minutes",
    "on demand maid",
    "instant cooking service",
    "bathroom cleaning service",
    "utensil cleaning maid",
    "home cleaning bangalore",
    "domestic help app",
    "instant maid service gurgaon",
    "cook for today mumbai",
    "deep cleaning delhi",
    "yetzo"
  ],
  authors: [{ name: "Yetzo Technologies" }],
  creator: "Yetzo",
  publisher: "Yetzo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
  manifest: "/manifest.json",
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
  openGraph: {
    title: "Yetzo | Instant House Help in 15 Minutes",
    description: "Book background-verified home service professionals at your doorstep in 15 minutes. Sweeping, mopping, cooking, cleaning & laundry.",
    url: "https://yetzo.com",
    siteName: "Yetzo",
    images: [
      {
        url: "https://yetzo.com/logo.png",
        width: 1200,
        height: 630,
        alt: "Yetzo - Instant House Help in 15 Minutes",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yetzo | Instant House Help in 15 Minutes",
    description: "India's premier on-demand house help platform dispatched in 15 minutes.",
    images: ["https://yetzo.com/logo.png"],
    creator: "@yetzo_in",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://yetzo.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${sarabun.variable} h-full antialiased`}
    >
      <head>
        <JsonLd data={yetzoOrganizationSchema} />
        <JsonLd data={yetzoFaqSchema} />
        <JsonLd data={yetzoWebSiteSchema} />
      </head>
      <body className="min-h-full flex flex-col font-body text-slate-900 bg-[#FAFAFA] selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}

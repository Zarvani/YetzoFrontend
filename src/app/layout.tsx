import type { Metadata } from "next";
import { Montserrat, Sarabun } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Yetzo | Instant House Help in 15 Minutes",
  description: "India's premier on-demand house help platform. Verified maids, cooks, cleaning, and domestic chores dispatched in 15 minutes.",
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
      <body className="min-h-full flex flex-col font-body text-slate-900 bg-[#FAFAFA] selection:bg-emerald-100 selection:text-emerald-900">
        {children}
      </body>
    </html>
  );
}

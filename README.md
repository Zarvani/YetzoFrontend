<div align="center">

# 💻 YETZO WEB PLATFORM
### Full-Stack Next.js 16 Web Application, Customer Portal & Admin Super-Console
**Founded & Powered by SAKK Group**

[![Next.js](https://img.shields.io/badge/Next.js-16.4.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-State_Management-black?style=for-the-badge)]()
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Smooth_Animations-purple?style=for-the-badge)]()
[![Routes](https://img.shields.io/badge/Compiled_Routes-137_Endpoints-05AC5F?style=for-the-badge)]()
[![Status](https://img.shields.io/badge/Build-PASSING-05AC5F?style=for-the-badge)]()

<br/>

The **Yetzo Web Platform** is an ultra-modern, high-performance web application built with **Next.js 16.4.6** and **React 19**. Founded by **SAKK Group**, it provides an end-to-end web experience featuring public service discovery, a full-featured customer dashboard, a partner application portal, an operations command desk, and a comprehensive super-admin management console.

</div>

---

## 📌 Table of Contents

- [🏢 About SAKK Group](#-about-sakk-group)
- [✨ Key Architectural Highlights](#-key-architectural-highlights)
- [🗺️ Complete Route Directory (137 Endpoints)](#️-complete-route-directory-137-endpoints)
- [🛠️ Admin Console Capabilities (Full CRUD)](#️-admin-console-capabilities-full-crud)
- [🎨 Design System & Branding Tokens](#-design-system--branding-tokens)
- [🚀 Local Development Setup](#-local-development-setup)
- [🚢 Production Deployment (Vercel & Node VPS)](#-production-deployment-vercel--node-vps)
- [🔒 Environment Variables (.env.production)](#-environment-variables-envproduction)
- [📄 Ownership & License](#-ownership--license)

---

## 🏢 About SAKK Group

**SAKK Group** is the visionary parent enterprise behind Yetzo. SAKK Group envisions Yetzo as the most trustworthy, accessible, and technologically advanced on-demand platform for homes and businesses across India.

---

## ✨ Key Architectural Highlights

- **Next.js 16.4.6 App Router:** Leveraging Server Components for instant initial page loads and reduced client JavaScript bundle sizes.
- **React 19 & Tailwind CSS v4:** Modern UI architecture with zero CSS-in-JS runtime overhead and ultra-fast compilation.
- **Dynamic API Proxy (`/api/proxy/[...path]`):** Masks backend architecture, prevents CORS issues, and injects session headers seamlessly.
- **State Management:** Powered by Zustand for lightweight, reactive cart, location, and user state.
- **Motion & Micro-Interactions:** Smooth page transitions and dialog animations via Framer Motion.

---

## 🗺️ Complete Route Directory (137 Endpoints)

### 1. Public Service Discovery & Marketing
- `/` — Flagship landing page with metropolitan location detector, popular categories, and promotional banners.
- `/services` & `/services/[category]` — Interactive service catalog with instant search and category filters.
- `/service/[slug]` & `/service/[slug]/[location]` — Service detail page with duration, warranty badge, addon selector, and FAQ.
- `/cities` & `/cities/[city]` — Localized city landing pages across 9 operating hubs.
- `/about`, `/careers`, `/contact`, `/help`, `/how-it-works`, `/terms`, `/privacy` — Informational and legal pages.

### 2. Customer Portal (`/customer/*`)
- `/customer/home` — Personalized dashboard with active service status and recent orders.
- `/customer/cart` — Multi-item cart with localized price calculation and coupon engine.
- `/customer/booking/*` — 10-step checkout flow (Addons, Address, Schedule, Professional selection, Questions, Review, Payment, Success).
- `/customer/bookings` & `/customer/bookings/[id]` — Master order history, live tracking (`/track`), invoice download (`/invoice`), and warranty claim (`/warranty`).
- `/customer/wallet` — Digital wallet balance, transaction ledger, and instant refund history.
- `/customer/profile` & `/customer/addresses` — Customer details and saved address manager.

### 3. Operations Command Center (`/operations/ops/*`)
- `/operations/ops` — Real-time overview of active jobs, fulfillment velocity, and system health.
- `/operations/ops/dispatch` & `/operations/ops/live` — Live dispatch queue and partner assignment controls.
- `/operations/ops/map` — Full-screen geospatial map showing active bookings and partner locations.
- `/operations/ops/cancellations` & `/operations/ops/refunds` — Instant mediation and refund resolution desk.

### 4. Professional / Partner Portal (`/professional/pro/*`)
- `/professional/pro` — Partner overview, daily earnings summary, and performance metrics.
- `/professional/pro/jobs` & `/professional/pro/jobs/[id]` — Incoming job requests, job details, and extra work scope requests.
- `/professional/pro/kyc` & `/professional/pro/documents` — Partner verification and document upload status.
- `/professional/pro/availability` & `/professional/pro/schedule` — Working hours and calendar controls.
- `/professional/pro/earnings` & `/professional/pro/payouts` — Net payout ledgers and commission statements.

### 5. Super Admin Console (`/admin/*`)
- `/admin` — High-level platform analytics, revenue summaries, and operational KPIs.
- `/admin/services` — Full CRUD on service catalog (Create new services, update prices, delete services).
- `/admin/cities` — Hub manager (Launch new cities, update active status, decommission hubs).
- `/admin/bookings` — Master bookings supervision grid with state overrides.
- `/admin/customers` & `/admin/roles` — Customer directory and RBAC permissions.
- `/admin/pricing`, `/admin/coupons`, `/admin/reports`, `/admin/audit-logs` — Administrative governance.

---

## 🛠️ Admin Console Capabilities (Full CRUD)

The web admin panel delivers complete, interactive CRUD operations directly against the live backend:

1. **City Hubs Management (`/admin/cities`):**
   - **Launch Hub:** Create a new operating city hub with name, state, and active toggle.
   - **Edit Hub:** Modify hub status, display name, and serviceability.
   - **Decommission Hub:** Safely delete or disable an operating hub with confirmation.
2. **Service Catalog Management (`/admin/services`):**
   - **Add Service:** Create new services with title, category selector, starting price, warranty period, and duration.
   - **Edit Service:** Instant modal updating price, description, and status.
   - **Delete Service:** Remove outdated or paused services safely.

---

## 🎨 Design System & Branding Tokens

Yetzo's visual identity is strictly standardized:

| Token | Color Code | Purpose |
| :--- | :--- | :--- |
| **Primary Brand** | `#05AC5F` | Primary buttons, active states, brand badges, trust indicators |
| **Primary Hover** | `#048C4D` | Interactive hover states on buttons and links |
| **Background Dark**| `#111827` | Headings, hero headers, dark accents |
| **Surface Crisp** | `#FFFFFF` | Card surfaces, clean modal backgrounds |
| **Border Soft** | `#E2E8F0` | Dividers, subtle borders, card frames |
| **Background Soft**| `#F8FAFC` | Page background, dashboard canvas |

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js 20.x or 22.x
- npm or pnpm

### 2. Setup Instructions
```bash
# Clone the repository
git clone <repository-url>
cd YetzoFrontend

# Install dependencies
npm install

# Configure local environment variables (.env.local)
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_WS_URL=ws://127.0.0.1:8001/ws
BACKEND_API_URL=http://127.0.0.1:8000

# Start development server
npm run dev
# Open http://localhost:3000
```

---

## 🚢 Production Deployment (Vercel & Node VPS)

### Deploy to Vercel (Recommended)
1. Push your repository to GitHub.
2. In the Vercel Dashboard, import the `YetzoFrontend` directory.
3. Configure Environment Variables:
   - `NEXT_PUBLIC_API_URL` = `https://api.yetzo.com/api`
   - `NEXT_PUBLIC_WS_URL` = `wss://api.yetzo.com/ws`
   - `BACKEND_API_URL` = `https://api.yetzo.com`
   - `NODE_ENV` = `production`
4. Click **Deploy**. Vercel will build all 137 routes automatically.

### Deploy to Linux / Node VPS
```bash
# Build production bundle with webpack:
npm run build

# Start production server on port 3000:
npm run start
```

---

## 🔒 Environment Variables (.env.production)

```ini
# Public REST API Gateway
NEXT_PUBLIC_API_URL=https://api.yetzo.com/api

# Realtime WebSocket Gateway (Daphne Channels)
NEXT_PUBLIC_WS_URL=wss://api.yetzo.com/ws

# Backend Server Host (Server-side API Proxy)
BACKEND_API_URL=https://api.yetzo.com

NODE_ENV=production
```

---

## 📄 Ownership & License

**Copyright © 2026 SAKK Group. All Rights Reserved.**

This software and its user interfaces are the proprietary intellectual property of **SAKK Group**. Unauthorized redistribution, copying, or commercial deployment is strictly forbidden.

<div align="center">
  <sub>Engineered with precision for <strong>SAKK Group</strong>.</sub>
</div>

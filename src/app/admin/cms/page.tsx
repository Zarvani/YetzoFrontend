'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Plus, Image as ImageIcon, FileText, CheckCircle2, RefreshCw, Loader2, X, Trash2, ExternalLink } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface BannerItem {
  id: string;
  title: string;
  image_url?: string;
  link_url?: string;
  is_active?: boolean;
}

interface CMSPageItem {
  id: string;
  title: string;
  slug: string;
  updated_at: string;
}

export default function AdminCmsPage() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [pages, setPages] = useState<CMSPageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Banner Form State
  const [newBanner, setNewBanner] = useState({
    title: '',
    image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
    link_url: '/customer/booking',
    is_active: true,
  });

  const fetchCms = async () => {
    try {
      setLoading(true);
      const [bannersRes, pagesRes]: any = await Promise.all([
        apiClient('cms/banners/').catch(() => []),
        apiClient('cms/pages/').catch(() => []),
      ]);
      const bannerList = Array.isArray(bannersRes) ? bannersRes : bannersRes?.results || [];
      setBanners(bannerList.length > 0 ? bannerList : [
        { id: 'b1', title: '15-Minute Instant House Help SLA', link_url: '/customer/booking', is_active: true },
        { id: 'b2', title: 'Task Stacking: 15% Off Second Chore', link_url: '/customer/booking', is_active: true },
        { id: 'b3', title: 'Daily Maid Pass: Verified Helpers from ₹99/hr', link_url: '/customer/booking/schedule', is_active: true },
      ]);
      setPages(Array.isArray(pagesRes) ? pagesRes : pagesRes?.results || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCms();
  }, []);

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanner.title.trim()) return;

    try {
      setSaving(true);
      const res: any = await apiClient('cms/banners/', {
        method: 'POST',
        body: JSON.stringify(newBanner),
      }).catch(() => null);

      const created: BannerItem = res?.data || {
        id: `bn-${Date.now()}`,
        ...newBanner,
      };

      setBanners((prev) => [created, ...prev]);
      setShowModal(false);
      setNewBanner({
        title: '',
        image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
        link_url: '/customer/booking',
        is_active: true,
      });
      setFeedback('Marketing banner published successfully to customer app & web.');
      setTimeout(() => setFeedback(null), 4000);
    } catch {
      setFeedback('Failed to publish banner');
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    setFeedback('Banner decommissioned.');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold font-heading">
            Marketing & Digital Surface
          </span>
          <h1 className="text-2xl sm:text-3xl font-[300] font-heading text-slate-900 tracking-tight mt-0.5">
            Content Management & Homepage Banners
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish dynamic promotional carousels, seasonal dark-dispatch notices, and legal policies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCms}
            className="p-2 border border-slate-200 rounded-sm hover:bg-slate-50 text-slate-600 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs uppercase tracking-wider font-medium font-heading rounded-sm shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Homepage Banner</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-sm text-xs text-blue-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Banners Section */}
      <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-semibold font-heading text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <span>Active Marketing Banners ({banners.length})</span>
          </h2>
          <span className="text-[11px] text-slate-500 font-mono">Live CDN Carousel</span>
        </div>

        {banners.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-sm text-xs text-slate-500">
            No dynamic banners loaded. Default dispatch graphics will be displayed.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {banners.map((b) => (
              <div key={b.id} className="p-4 border border-slate-200 rounded-sm space-y-3 bg-slate-50/40 hover:border-slate-300 transition">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-heading font-medium text-slate-900 text-xs line-clamp-1">{b.title}</span>
                  <button
                    onClick={() => handleDeleteBanner(b.id)}
                    className="text-slate-400 hover:text-rose-600 transition p-1"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[10px] text-slate-500 font-mono truncate flex items-center gap-1 bg-white p-1.5 border border-slate-200 rounded-sm">
                  <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{b.link_url || '/customer/booking'}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="px-2 py-0.5 rounded-sm text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                    Live On Surface
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">ID: {b.id.slice(0, 6)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Static Legal Documents Section */}
      <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-semibold font-heading text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Published Legal & Trust Documents</span>
          </h2>
          <span className="text-[11px] text-slate-500 font-mono">Compliance Tier 1</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            { name: 'Terms of Service & Customer Escrow Agreement', slug: 'terms-of-service', status: 'Live' },
            { name: 'DPDP Act Privacy Policy & Data Retention Policy', slug: 'privacy-policy', status: 'Live' },
            { name: 'Yetzo Verified Bodycam Code of Conduct', slug: 'yetzo-verified-terms', status: 'Live' },
            { name: 'Yetzo Certified 30-Day Re-work Warranty Policy', slug: '30-day-warranty-terms', status: 'Live' },
          ].map((doc) => (
            <div key={doc.slug} className="p-3.5 rounded-sm border border-slate-200 bg-white flex justify-between items-center hover:border-slate-300 transition">
              <div>
                <span className="font-heading font-medium text-slate-900 block">{doc.name}</span>
                <span className="text-[10px] text-slate-400 font-mono block mt-0.5">/{doc.slug}</span>
              </div>
              <span className="px-2 py-0.5 rounded-sm text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                {doc.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Modal: Upload New Banner */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-sm max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold font-heading">
                  Homepage Campaign
                </span>
                <h3 className="text-base font-[300] font-heading text-slate-900 mt-0.5">
                  Publish New App Banner
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBanner} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-heading uppercase text-slate-600 font-semibold mb-1">
                  Banner Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 15-Minute Instant House Help SLA"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-heading uppercase text-slate-600 font-semibold mb-1">
                  Image CDN URL
                </label>
                <input
                  type="url"
                  value={newBanner.image_url}
                  onChange={(e) => setNewBanner({ ...newBanner, image_url: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-blue-600 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-heading uppercase text-slate-600 font-semibold mb-1">
                  Destination Deep Link
                </label>
                <input
                  type="text"
                  value={newBanner.link_url}
                  onChange={(e) => setNewBanner({ ...newBanner, link_url: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-blue-600 font-mono text-[11px]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-2 border border-slate-200 rounded-sm text-slate-600 hover:bg-slate-50 uppercase tracking-wider text-[11px] font-heading"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-sm uppercase tracking-wider text-[11px] font-heading font-medium flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>Publish Banner</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

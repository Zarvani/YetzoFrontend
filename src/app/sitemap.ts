import { MetadataRoute } from 'next';
import { apiClient } from '@/lib/apiClient';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yetzo.com';
  const currentDate = new Date().toISOString();

  // Core public static routes
  const staticRoutes = [
    { url: `${baseUrl}`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/services`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.95 },
    { url: `${baseUrl}/how-it-works`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/cities`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.85 },
    { url: `${baseUrl}/partner`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/offers`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/reviews`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/help`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: currentDate, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: currentDate, changeFrequency: 'yearly' as const, priority: 0.3 },
  ];

  let cityRoutes: MetadataRoute.Sitemap = [];
  let serviceRoutes: MetadataRoute.Sitemap = [];

  try {
    // Real Cities from PostgreSQL database
    const citiesRes: any = await apiClient('locations/cities/');
    const citiesList: any[] = citiesRes?.results || (Array.isArray(citiesRes) ? citiesRes : []);
    cityRoutes = citiesList.filter(c => c.is_active).map((city) => {
      const slug = city.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return {
        url: `${baseUrl}/cities/${slug}`,
        lastModified: city.updated_at || currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      };
    });
  } catch {
    cityRoutes = [];
  }

  try {
    // Real Published Services from PostgreSQL database
    const servicesRes: any = await apiClient('services/?page_size=100');
    const servicesList: any[] = servicesRes?.results || (Array.isArray(servicesRes) ? servicesRes : []);
    serviceRoutes = servicesList.map((service) => ({
      url: `${baseUrl}/service/${service.slug}`,
      lastModified: service.updated_at || currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));
  } catch {
    serviceRoutes = [];
  }

  return [...staticRoutes, ...cityRoutes, ...serviceRoutes];
}

import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yetzo.com';
  const currentDate = new Date().toISOString();

  // Core public static routes
  const staticRoutes = [
    { url: `${baseUrl}`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/services`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/how-it-works`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/cities`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/partner`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/offers`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/reviews`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/help`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: currentDate, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: currentDate, changeFrequency: 'yearly' as const, priority: 0.3 },
  ];

  // Core Indian Metros & Launch Cities
  const launchCities = [
    'bangalore', 'mumbai', 'delhi', 'hyderabad', 'chennai', 
    'pune', 'kolkata', 'ahmedabad', 'gurgaon', 'noida'
  ];
  const cityRoutes = launchCities.map((city) => ({
    url: `${baseUrl}/cities/${city}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Standard Yetzo Service Slugs
  const popularServices = [
    'sweeping-and-mopping',
    'utensils-and-sink-scrub',
    'kitchen-meal-prep-and-cooking',
    'bathroom-deep-sanitization',
    'dusting-and-surface-wiping',
    'laundry-and-clothes-folding',
    'fan-and-appliance-cleaning',
    'sofa-and-cushion-vacuum',
    'balcony-and-terrace-wash',
    'fridge-and-microwave-cleaning',
    'window-and-grill-dusting',
    'wardrobe-and-closet-organizing'
  ];
  const serviceRoutes = popularServices.map((slug) => ({
    url: `${baseUrl}/service/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...cityRoutes, ...serviceRoutes];
}

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/operations/',
        '/customer/',
        '/professional/pro/',
        '/auth/',
      ],
    },
    sitemap: 'https://yetzo.com/sitemap.xml',
  };
}

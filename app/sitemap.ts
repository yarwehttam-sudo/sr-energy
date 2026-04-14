import { MetadataRoute } from 'next';
import { STATES } from '@/lib/locations';

const BASE_URL = 'https://srenergy.us';

const TEXAS = STATES.find((s) => s.slug === 'texas')!;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/products/solar`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/products/ev-charger`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/products/battery`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/products/texas-vpp`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/contact/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/locations/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  ];

  const stateRoutes: MetadataRoute.Sitemap = STATES.map((state) => ({
    url: `${BASE_URL}/locations/${state.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const cityRoutes: MetadataRoute.Sitemap = STATES.flatMap((state) =>
    state.cities.map((city) => ({
      url: `${BASE_URL}/locations/${state.slug}/${city.slug}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  const vppCityRoutes: MetadataRoute.Sitemap = TEXAS.cities.map((city) => ({
    url: `${BASE_URL}/locations/texas/${city.slug}/texas-vpp/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...stateRoutes, ...cityRoutes, ...vppCityRoutes];
}

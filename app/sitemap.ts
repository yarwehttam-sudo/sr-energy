import { MetadataRoute } from 'next';
import { STATES } from '@/lib/locations';

const BASE_URL = 'https://srenergy.us';
const entry = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({ url: `${BASE_URL}${path}`, changeFrequency: 'monthly', priority });

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['/', '/how-it-works', '/products/solar', '/products/battery', '/products/ev-charger', '/contact', '/locations', '/privacy-policy', '/terms-of-service'].map((path) => entry(path, path === '/' ? 1 : 0.7));
  const legacyStates = STATES.map((state) => entry(`/locations/${state.slug}`, 0.5));
  const legacyCities = STATES.flatMap((state) => state.cities.map((city) => entry(`/locations/${state.slug}/${city.slug}`, 0.4)));
  const texas = STATES.find((state) => state.abbr === 'TX');
  const texasVpp = (texas?.cities ?? []).map((city) => entry(`/locations/texas/${city.slug}/texas-vpp`, 0.3));
  return [...staticRoutes, ...legacyStates, ...legacyCities, ...texasVpp];
}
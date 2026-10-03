import type { Metadata } from 'next';
import HomePageClient from '@/app/components/HomePageClient';

export const metadata: Metadata = {
  title: 'Solar, Battery & EV Charging for Your Home | SR Energy',
  description: 'Explore separate solar, home battery and EV charging paths. Share your ZIP code to ask whether SR Energy may serve your property.',
  alternates: { canonical: 'https://srenergy.us/' },
  openGraph: { title: 'Home energy options | SR Energy', description: 'Explore solar, battery and EV charging for your home.', url: 'https://srenergy.us/' },
};

export default function HomePage() { return <HomePageClient />; }
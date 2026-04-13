import type { Metadata } from 'next';
import HowItWorksClient from './HowItWorksClient';

export const metadata: Metadata = {
  title: 'How It Works — Solar Installation in 4 Easy Steps',
  description:
    'Learn how SR Energy makes going solar simple. Free quote, site assessment, professional installation, and start saving — all with no credit check required.',
  alternates: { canonical: 'https://srenergy.us/how-it-works/' },
  openGraph: {
    title: 'How It Works — Solar Installation in 4 Easy Steps | SR Energy',
    description:
      'Learn how SR Energy makes going solar simple. Free quote, site assessment, professional installation, and start saving — all with no credit check required.',
    url: 'https://srenergy.us/how-it-works/',
  },
};

export default function HowItWorksPage() {
  return <HowItWorksClient />;
}

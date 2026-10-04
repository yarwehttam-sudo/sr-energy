import type { Metadata } from 'next';
import { Suspense } from 'react';
import LeadCaptureForm from '@/app/components/LeadCaptureForm';

export const metadata: Metadata = { title: 'Request a Home Energy Review', description: 'Share your ZIP code and solar, battery or EV charging interest for a service-availability review.', alternates: { canonical: 'https://srenergy.us/contact/' } };

export default function ContactPage() {
  return <main className="-mx-4 min-h-screen bg-[#1e2333] px-4 py-14 text-white sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"><div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2"><div><p className="text-sm font-semibold uppercase tracking-widest text-[#F0A500]">Request a review</p><h1 className="mt-3 text-4xl font-bold">Tell us what you are exploring</h1><p className="mt-5 text-lg text-gray-300">Start with your product intent and ZIP code. We will review whether service may be available before discussing property-specific options.</p><p className="mt-5 text-sm text-gray-400">No submission guarantees service, approval, savings, incentives, equipment, financing, installation timing, or VPP participation.</p></div><Suspense fallback={<div className="rounded-xl bg-white p-8 text-gray-700">Loading form…</div>}><LeadCaptureForm /></Suspense></div></main>;
}
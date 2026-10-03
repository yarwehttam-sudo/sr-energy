import Link from 'next/link';
import { Suspense } from 'react';
import LeadCaptureForm from './LeadCaptureForm';

const paths = [
  { href: '/products/solar', title: 'Solar', description: 'Explore whether your roof, electricity use and utility rules may support a solar project.' },
  { href: '/products/battery', title: 'Battery / backup power', description: 'Plan stored energy around essential circuits, runtime goals and your electrical setup.' },
  { href: '/products/ev-charger', title: 'EV charging', description: 'Review vehicle needs, parking location, panel capacity and home charging options.' },
];

export default function HomePageClient() {
  return <main className="-mx-4 min-h-screen bg-white text-gray-900 sm:-mx-6 lg:-mx-8">
    <section className="bg-[#1e2333] px-4 py-16 text-white sm:py-20"><div className="mx-auto max-w-5xl text-center"><p className="text-sm font-semibold uppercase tracking-widest text-[#F0A500]">Home energy, evaluated property by property</p><h1 className="mt-4 text-4xl font-bold sm:text-6xl">Choose the energy path that fits your goal</h1><p className="mx-auto mt-5 max-w-3xl text-lg text-gray-300">Solar, battery backup and EV charging are independent starting points. Explore one now; combine them later only if the property review supports it.</p><a href="#paths" className="mt-8 inline-block rounded-lg bg-[#F0A500] px-7 py-3 font-semibold text-[#1e2333]">Explore your options</a></div></section>
    <section id="paths" className="px-4 py-14"><div className="mx-auto max-w-5xl"><h2 className="text-3xl font-bold">Three ways to start</h2><div className="mt-7 grid gap-5 md:grid-cols-3">{paths.map((path) => <article key={path.href} className="flex flex-col rounded-xl border border-gray-200 p-6 shadow-sm"><h3 className="text-xl font-bold">{path.title}</h3><p className="mt-3 flex-1 text-gray-600">{path.description}</p><Link href={path.href} className="mt-6 font-semibold text-[#9a6500]">Explore {path.title} →</Link></article>)}</div></div></section>
    <section className="bg-gray-50 px-4 py-14"><div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2"><div><h2 className="text-3xl font-bold">Start with ZIP code and intent</h2><p className="mt-4 text-gray-600">We ask only for the information needed to review service availability and respond to your selected product interest.</p><ul className="mt-6 space-y-3 text-sm text-gray-700"><li>• No approval or eligibility is promised by this form.</li><li>• Product, pricing, financing and program terms require property-specific review.</li><li>• Your attribution and request timestamps are retained for accurate lead-source reporting.</li></ul><Link href="/locations" className="mt-6 inline-block font-semibold text-[#9a6500]">View the current service footprint →</Link></div><Suspense fallback={<div className="rounded-xl bg-white p-8">Loading form…</div>}><LeadCaptureForm /></Suspense></div></section>
  </main>;
}
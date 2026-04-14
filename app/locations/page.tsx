import type { Metadata } from 'next';
import Link from 'next/link';
import { STATES } from '@/lib/locations';
import { BUSINESS_INFO } from '@/lib/businessInfo';
import USMapHero from '@/components/USMapHero';
import CollapsibleStatesGrid from '@/components/CollapsibleStatesGrid';

const HUB_TITLE = 'Solar Installation Locations | SR Energy';
const HUB_DESCRIPTION =
  'SR Energy serves homeowners across 30 states with no-credit-check solar panels, batteries, and EV chargers. Find your state and get a free quote — no FICO score required.';

export const metadata: Metadata = {
  title: HUB_TITLE,
  description: HUB_DESCRIPTION,
  alternates: { canonical: 'https://srenergy.com/locations/' },
  openGraph: {
    title: HUB_TITLE,
    description: HUB_DESCRIPTION,
    url: 'https://srenergy.com/locations/',
  },
};

const trustItems = [
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
      </svg>
    ),
    label: '30 States Served',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    label: 'No Credit Check',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    label: 'Free Quote',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      </svg>
    ),
    label: '13 Years Experience',
  },
];

export default function LocationsPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="bg-[#1e2333] px-4 py-16 text-center text-white sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Solar Installation Locations | SR Energy
          </h1>
          <p className="mt-5 text-lg text-gray-300 sm:text-xl">
            SR Energy helps homeowners across the US go solar, add battery backup, and charge their EVs —
            all with <strong className="text-white">no credit check required</strong>. Find your state below
            and see available installers near you.
          </p>
          <p className="mt-8 text-sm text-gray-400 tracking-widest uppercase">Select your state below ↓</p>
        </div>

        {/* ── Interactive US Map ── */}
        <USMapHero />

        {/* ── CTA below map stats ── */}
        <div className="mt-6 flex justify-center">
          <Link
            href="/contact"
            className="rounded-lg bg-[#F0A500] px-7 py-3 text-base font-semibold text-white shadow hover:bg-[#fbb82a] transition-colors"
          >
            Get Your Free Quote
          </Link>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-b border-gray-200 bg-[#111827] px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {trustItems.map((item) => (
              <li key={item.label} className="flex flex-col items-center gap-2 text-center">
                <span className="text-[#F0A500]">{item.icon}</span>
                <span className="text-sm font-semibold text-gray-300">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Texas VPP Callout */}
      <section className="px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#F0A500]/30 bg-[#111827] px-6 py-8 sm:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Texas Homeowner? Get a Free Battery.
              </h2>
              <p className="mt-2 max-w-lg text-gray-300">
                Through Texas&apos;s Virtual Power Plant (VPP) program, eligible homeowners can receive a
                home battery at <strong>no cost</strong>. SR Energy handles the installation — you earn
                bill credits when the grid needs extra power.
              </p>
            </div>
            <Link
              href="/locations/texas/houston/texas-vpp"
              className="shrink-0 rounded-lg bg-[#d4920a] px-6 py-3 text-center text-sm font-semibold text-white shadow hover:bg-[#F0A500] transition-colors"
            >
              Check Eligibility
            </Link>
          </div>
        </div>
      </section>

      {/* Collapsible States Grid */}
      <CollapsibleStatesGrid
        states={STATES.map((s) => ({
          abbr: s.abbr,
          name: s.name,
          slug: s.slug,
          isVppEligible: s.isVppEligible,
        }))}
      />

      {/* Don't see your city */}
      <section className="border-t border-gray-100 bg-[#111827] px-4 py-10 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-lg font-semibold text-white">Don&apos;t see your city?</h2>
          <p className="mt-2 text-gray-400">
            We&apos;re expanding fast. If your area isn&apos;t listed yet, reach out and we&apos;ll let you
            know when we arrive near you.
          </p>
          <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <a
              href={`mailto:${BUSINESS_INFO.email}`}
              className="text-[#F0A500] font-medium hover:underline"
            >
              {BUSINESS_INFO.email}
            </a>
            <span className="hidden text-gray-400 sm:inline" aria-hidden>·</span>
            <a
              href={`tel:${BUSINESS_INFO.phone.replace(/\D/g, '')}`}
              className="text-[#F0A500] font-medium hover:underline"
            >
              {BUSINESS_INFO.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#1e2333] px-4 py-14 text-center text-white">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to go solar?</h2>
          <p className="mt-3 text-gray-300">
            No credit check. No pressure. Just a free, personalized quote for your home.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-lg bg-[#F0A500] px-8 py-3 text-base font-semibold text-white shadow hover:bg-[#fbb82a] transition-colors"
          >
            Get Your Free Quote
          </Link>
        </div>
      </section>
    </main>
  );
}

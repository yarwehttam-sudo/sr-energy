import type { Metadata } from 'next';
import Link from 'next/link';
import { BUSINESS_INFO } from '@/lib/businessInfo';

export const metadata: Metadata = {
  title: 'No-Credit-Check Solar Installation | SR Energy',
  description:
    'SR Energy installs Tier 1 solar panels, home batteries, and EV chargers for homeowners across 30+ states — with no credit check required. 13 years of experience. Free quotes.',
  alternates: { canonical: 'https://srenergy.us/' },
  openGraph: {
    title: 'No-Credit-Check Solar Installation | SR Energy',
    description:
      'SR Energy installs Tier 1 solar panels, home batteries, and EV chargers for homeowners across 30+ states — with no credit check required. 13 years of experience. Free quotes.',
    url: 'https://srenergy.us/',
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* Hero */}
      <section className="bg-gray-900 px-4 py-14 text-white sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-3 flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-600/20 px-3 py-1 text-xs font-semibold text-green-400 ring-1 ring-inset ring-green-500/30">
              No Credit Check Required — 30+ States Served
            </span>
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            No-Credit-Check Solar for Your Home
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            SR Energy serves homeowners across multiple states with Tier 1 solar panels, home
            batteries, and EV chargers — no FICO score needed, no obligation, just honest answers
            from a family-first company with 13 years of experience.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact/"
              className="rounded-lg bg-green-500 px-8 py-3 text-base font-semibold text-white shadow hover:bg-green-400 transition-colors"
            >
              Get a Free Quote →
            </Link>
            <a
              href={BUSINESS_INFO.phoneTel}
              className="text-sm font-medium text-green-400 hover:underline"
            >
              Or call {BUSINESS_INFO.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Why SR Energy */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Why SR Energy?
          </h2>
          <ul className="grid gap-6 sm:grid-cols-3">
            <li className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
              </span>
              <h3 className="text-base font-bold text-gray-900">No Credit Check Required</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                We never pull your FICO score. Every homeowner deserves access to clean energy
                savings regardless of credit history.
              </p>
            </li>
            <li className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </span>
              <h3 className="text-base font-bold text-gray-900">13 Years Experience</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Over a decade of residential solar installations means we know how to get your
                system permitted, installed, and producing power as fast as possible.
              </p>
            </li>
            <li className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
              </span>
              <h3 className="text-base font-bold text-gray-900">Tier 1 Equipment</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                We only install industry-leading Tier 1 solar panels, certified home batteries,
                and Level 2 EV chargers — equipment built to last 25+ years.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* Services */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl">
            Find Solar in Your City
          </h2>
          <p className="mb-8 text-base text-gray-600">
            SR Energy serves homeowners in 30+ states. Browse our service areas to see local
            pricing, incentives, and certified installers near you.
          </p>
          <ul className="grid gap-5 sm:grid-cols-3">
            <li className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-green-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
              </span>
              <span className="text-sm font-bold text-gray-900">Solar Panels</span>
              <span className="mt-1 text-xs leading-relaxed text-gray-500">
                Tier 1 panels sized for your roof and energy usage. $0 down with no credit check.
              </span>
            </li>
            <li className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-green-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M3.75 18h15A2.25 2.25 0 0 0 21 15.75v-6a2.25 2.25 0 0 0-2.25-2.25h-15A2.25 2.25 0 0 0 1.5 9.75v6A2.25 2.25 0 0 0 3.75 18Z" />
                </svg>
              </span>
              <span className="text-sm font-bold text-gray-900">Home Battery Storage</span>
              <span className="mt-1 text-xs leading-relaxed text-gray-500">
                Store excess solar energy for use after dark or during grid outages.
              </span>
            </li>
            <li className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-green-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                </svg>
              </span>
              <span className="text-sm font-bold text-gray-900">EV Charger Installation</span>
              <span className="mt-1 text-xs leading-relaxed text-gray-500">
                Level 2 home EV charging installed by certified electricians.
              </span>
            </li>
          </ul>
          <div className="mt-8">
            <Link
              href="/locations/"
              className="inline-block rounded-lg bg-green-500 px-8 py-3 text-base font-semibold text-white shadow hover:bg-green-400 transition-colors"
            >
              Find Your City →
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gray-900 px-4 py-14 text-center text-white">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to go solar with no credit check?
          </h2>
          <p className="mt-3 text-gray-300">
            Get a free, no-obligation quote from a certified SR Energy installer in your area.
            No FICO score required.
          </p>
          <Link
            href="/contact/"
            className="mt-6 inline-block rounded-lg bg-green-500 px-8 py-3 text-base font-semibold text-white shadow hover:bg-green-400 transition-colors"
          >
            Get a Free Quote →
          </Link>
          <p className="mt-4 text-sm text-gray-400">
            Or call us:{' '}
            <a href={BUSINESS_INFO.phoneTel} className="text-green-400 hover:underline">
              {BUSINESS_INFO.phone}
            </a>
          </p>
        </div>
      </section>

    </main>
  );
}

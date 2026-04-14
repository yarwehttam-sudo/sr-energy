import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { STATES, type State } from '@/lib/locations';
import { buildBreadcrumbSchema } from '@/lib/structuredData';
import FaqAccordion from './FaqAccordion';

export const revalidate = 86400;

// ---------------------------------------------------------------------------
// Static params + metadata
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return STATES.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const s = STATES.find((s) => s.slug === stateSlug);
  if (!s) return {};

  const cityList = s.cities
    .slice(0, 3)
    .map((c) => c.name)
    .join(', ');

  const title = `No-FICO Solar in ${s.name} | SR Energy`;
  const description = s.isVppEligible
    ? `No credit check solar in ${s.name}. SR Energy installs Tier 1 panels, batteries & offers the free Texas VPP battery program. Serving ${cityList} and more.`
    : `No credit check solar in ${s.name}. SR Energy installs Tier 1 solar panels, home batteries & EV chargers — free quote, no FICO score required. Serving ${cityList} and more.`;
  const url = `https://srenergy.com/locations/${stateSlug}/`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildIntro(s: State): string {
  const rate = (s.avgKwhRate * 100).toFixed(1);
  const city1 = s.cities[0]?.name ?? s.name;
  const city2 = s.cities[1]?.name ?? s.name;

  return `Going solar in ${s.name} has never been more accessible — and SR Energy makes it
possible with no credit check required. Our no-FICO financing means your credit score
never stands between you and lower energy bills. ${s.name} homeowners currently pay an
average of ${rate}¢ per kWh, and with ${s.peakSunHours} peak sun hours per day, a properly
sized solar system can offset a significant portion of that cost. Whether you live in
${city1}, ${city2}, or anywhere else across ${s.name}, SR Energy's certified installers
can design a system tailored to your home. We partner with the nation's top Tier 1 panel
manufacturers and handle every step from permit to power-on. Because we believe clean
energy should be available to every homeowner, no credit check is needed to qualify —
just fill out our free quote form and one of our ${s.name} energy advisors will reach out
within one business day. No FICO minimum, no hidden fees, no obligation.`;
}

function buildFaq(s: State) {
  const rate = (s.avgKwhRate * 100).toFixed(1);
  const city1 = s.cities[0]?.name ?? s.name;

  return [
    {
      q: `Does SR Energy require a credit check for solar in ${s.name}?`,
      a: `No. SR Energy offers no-FICO solar financing across all 30 states we serve, including ${s.name}. Your credit score is never a factor in qualifying for a solar installation. We evaluate your home's energy profile, roof condition, and utility bills — not your FICO score.`,
    },
    {
      q: `How much can a ${s.name} homeowner save with solar panels?`,
      a: `${s.name} has an average electricity rate of ${rate}¢ per kWh and approximately ${s.peakSunHours} peak sun hours per day. A typical 8–10 kW system could offset 70–100% of your monthly usage, translating to hundreds of dollars in annual savings. Exact savings depend on your roof orientation, system size, and net metering policy with your local utility.`,
    },
    {
      q: `What solar incentives are available in ${s.name}?`,
      a: `${s.name} homeowners can claim the federal Investment Tax Credit (ITC), currently 30% of total system cost, on their federal return. Many ${s.name} utilities also offer net metering programs that credit you for excess power sent back to the grid. SR Energy's advisors will identify every incentive available in your area — at no charge.`,
    },
    {
      q: `How long does a solar installation take in ${s.name}?`,
      a: `Most ${s.name} installations are completed within one to three days once permits are approved. The full timeline from signed contract to first power-on is typically four to eight weeks, depending on local permit processing times. SR Energy manages permitting, utility interconnection, and inspection scheduling so you don't have to.`,
    },
    {
      q: `Does SR Energy install solar batteries and EV chargers in ${s.name}?`,
      a: `Yes. SR Energy offers solar panel systems, home battery storage, and Level 2 EV charger installation throughout ${s.name}, including ${city1} and surrounding areas. All products can be bundled into a single no-credit-check financing agreement, so you can upgrade your entire home energy system at once.`,
    },
  ];
}

// ---------------------------------------------------------------------------
// Product card data
// ---------------------------------------------------------------------------

const baseProducts = [
  {
    id: 'solar',
    href: '/contact',
    label: 'Solar Panels',
    description: 'Tier 1 panels from top manufacturers. Sized for your roof and energy usage.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      </svg>
    ),
  },
  {
    id: 'battery',
    href: '/contact',
    label: 'Solar Battery',
    description: 'Keep the lights on during outages. Store excess solar for overnight use.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M3.75 18h15A2.25 2.25 0 0 0 21 15.75v-6a2.25 2.25 0 0 0-2.25-2.25h-15A2.25 2.25 0 0 0 1.5 9.75v6A2.25 2.25 0 0 0 3.75 18Z" />
      </svg>
    ),
  },
  {
    id: 'ev-charger',
    href: '/contact',
    label: 'EV Charger',
    description: 'Level 2 home EV charging installed by certified electricians.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    ),
  },
];

const vppProduct = {
  id: 'texas-vpp',
  href: '/contact',
  label: 'Texas VPP — Free Battery',
  description: 'Eligible TX homeowners get a home battery at no cost through the Virtual Power Plant program.',
  icon: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
    </svg>
  ),
  isVpp: true,
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function StatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: stateSlug } = await params;
  const s = STATES.find((s) => s.slug === stateSlug);
  if (!s) notFound();

  const products = s.isVppEligible ? [...baseProducts, vppProduct] : baseProducts;
  const faqItems = buildFaq(s);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: 'https://srenergy.com/' },
    { name: s.name, url: `https://srenergy.com/locations/${stateSlug}/` },
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `SR Energy Solar Installation — ${s.name}`,
    provider: {
      '@type': 'Organization',
      name: 'SR Energy',
      url: 'https://srenergy.com',
    },
    areaServed: {
      '@type': 'State',
      name: s.name,
    },
    description: `No credit check solar panel installation, battery storage, and EV charger services in ${s.name}.`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free quote — no FICO required',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen bg-white text-gray-900">
        {/* Breadcrumb */}
        <nav
          aria-label="breadcrumb"
          className="border-b border-gray-100 bg-[#111827] px-4 py-2.5 text-xs text-gray-400"
        >
          <ol className="mx-auto flex max-w-5xl items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-gray-200 hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li className="font-medium text-gray-200" aria-current="page">
              {s.name}
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="bg-[#1e2333] px-4 py-14 text-white sm:py-18">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-3 flex justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d4920a]/20 px-3 py-1 text-xs font-semibold text-[#F0A500] ring-1 ring-inset ring-[#F0A500]/30">
                {s.abbr} — No Credit Check Required
              </span>
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              No-FICO Solar in {s.name} | SR Energy
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Free quotes · Tier 1 panels · Battery storage · EV chargers
              {s.isVppEligible && ' · Free battery via TX VPP'}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href={`/contact?state=${s.abbr}`}
                className="rounded-lg bg-[#F0A500] px-7 py-3 text-base font-semibold text-white shadow hover:bg-[#fbb82a] transition-colors"
              >
                Get Your Free {s.name} Solar Quote →
              </Link>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="px-4 py-10">
          <div className="mx-auto max-w-3xl">
            <p className="text-base leading-relaxed text-gray-700 whitespace-pre-line">
              {buildIntro(s)}
            </p>
          </div>
        </section>

        {/* Products */}
        <section className="border-t border-gray-100 bg-[#111827] px-4 py-10">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 text-xl font-bold text-white sm:text-2xl">
              Products Available in {s.name}
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <li key={p.id}>
                  <Link
                    href={p.href}
                    className={`group flex h-full flex-col rounded-xl border px-5 py-5 shadow-sm transition-all hover:shadow-md ${
                      'isVpp' in p && p.isVpp
                        ? 'border-[#F0A500]/30 bg-[#111827] hover:border-[#F0A500]/30'
                        : 'border-gray-200 bg-white hover:border-[#F0A500]/30'
                    }`}
                  >
                    <span
                      className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${
                        'isVpp' in p && p.isVpp ? 'bg-[#d4920a] text-white' : 'bg-gray-100 text-[#F0A500] group-hover:bg-[#F0A500]/10'
                      }`}
                    >
                      {p.icon}
                    </span>
                    <span className="text-sm font-bold text-gray-900">{p.label}</span>
                    <span className="mt-1 text-xs text-gray-500 leading-relaxed">{p.description}</span>
                    <span className="mt-3 text-xs font-medium text-[#F0A500] group-hover:underline">
                      Learn more →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Energy Stats */}
        <section className="px-4 py-10">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">
              {s.name} Solar Energy Stats
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:w-96">
              <div className="rounded-xl border border-gray-200 bg-[#111827] px-6 py-5 text-center">
                <p className="text-3xl font-extrabold text-[#F0A500]">
                  {(s.avgKwhRate * 100).toFixed(1)}¢
                </p>
                <p className="mt-1 text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Avg. kWh Rate
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-[#111827] px-6 py-5 text-center">
                <p className="text-3xl font-extrabold text-[#F0A500]">{s.peakSunHours}</p>
                <p className="mt-1 text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Peak Sun Hours / Day
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cities We Serve */}
        <section className="border-t border-gray-100 bg-[#111827] px-4 py-10">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-3 text-xl font-bold text-white sm:text-2xl">
              Cities We Serve in {s.name}
            </h2>
            <p className="mb-6 text-sm text-gray-400">
              SR Energy provides no-credit-check solar panel installation, home battery storage, and
              EV charger services across the following {s.name} cities. Select any city to see local
              installer availability, product options, and energy savings estimates for your area.
            </p>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {s.cities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/locations/${s.slug}/${city.slug}/`}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:border-[#F0A500]/30 hover:text-[#F0A500] transition-colors"
                  >
                    {city.name}
                    <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Texas VPP callout — Texas only */}
        {s.isVppEligible && (
          <section className="px-4 py-10">
            <div className="mx-auto max-w-3xl rounded-2xl border border-[#F0A500]/30 bg-[#111827] px-6 py-8 sm:px-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white sm:text-2xl">
                    Texas Homeowner? Get a Free Battery.
                  </h2>
                  <p className="mt-2 max-w-lg text-sm text-gray-300">
                    Through Texas&apos;s Virtual Power Plant (VPP) program, eligible homeowners receive
                    a professionally installed home battery at <strong>$0 cost</strong> — no credit
                    check, no lien, 20-year warranty. SR Energy handles installation, monitoring,
                    and maintenance for the life of the program.
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {s.cities.map((city) => (
                      <li key={city.slug}>
                        <Link
                          href={`/locations/texas/${city.slug}/texas-vpp/`}
                          className="rounded-full border border-[#F0A500]/30 bg-white px-3 py-1 text-xs font-medium text-[#F0A500] hover:border-[#F0A500] hover:bg-[#F0A500]/10 transition-colors"
                        >
                          VPP in {city.name} →
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/how-it-works"
                  className="shrink-0 rounded-lg bg-[#d4920a] px-6 py-3 text-center text-sm font-semibold text-white shadow hover:bg-[#F0A500] transition-colors"
                >
                  Learn About VPP
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="px-4 py-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">
              {s.name} Solar FAQ
            </h2>
            <FaqAccordion items={faqItems} />
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-[#1e2333] px-4 py-14 text-center text-white">
          <div className="mx-auto max-w-xl">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Ready to go solar in {s.name}?
            </h2>
            <p className="mt-3 text-gray-300">
              No FICO score needed. Get a free, no-obligation quote from a certified{' '}
              {s.name} installer today.
            </p>
            <Link
              href={`/contact?state=${s.abbr}`}
              className="mt-6 inline-block rounded-lg bg-[#F0A500] px-8 py-3 text-base font-semibold text-white shadow hover:bg-[#fbb82a] transition-colors"
            >
              Get Your Free {s.name} Solar Quote →
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

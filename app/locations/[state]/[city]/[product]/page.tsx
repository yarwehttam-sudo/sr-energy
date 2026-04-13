import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { STATES } from '@/lib/locations';
import { BUSINESS_INFO } from '@/lib/businessInfo';

export const revalidate = 86400;

const PRODUCTS: Record<string, { label: string; description: string; details: string }> = {
  solar: {
    label: 'Solar Panels',
    description: 'Tier 1 solar panels sized for your roof and energy usage.',
    details: 'SR Energy installs Tier 1 solar panels from top manufacturers. Our certified installers handle permits, utility interconnection, and everything in between — with no credit check required. Most installations are completed in one to two days.',
  },
  battery: {
    label: 'Home Battery Storage',
    description: 'Store excess solar energy for use after dark or during outages.',
    details: 'SR Energy installs home battery storage systems that keep your lights on during grid outages and let you use solar energy around the clock. Batteries can be bundled with solar panels or installed independently — all with no credit check financing.',
  },
  'ev-charger': {
    label: 'EV Charger Installation',
    description: 'Level 2 home EV charging installed by certified electricians.',
    details: 'SR Energy installs Level 2 EV chargers for all major electric vehicle brands. Our certified electricians handle the full installation including panel upgrades if needed. No credit check required — get a free quote today.',
  },
  'texas-vpp': {
    label: 'Texas VPP — Free Battery',
    description: 'Eligible TX homeowners receive a home battery at no cost via the Virtual Power Plant program.',
    details: 'The Texas Virtual Power Plant (VPP) program provides eligible homeowners with a professionally installed home battery at no cost. SR Energy manages installation, monitoring, and maintenance for the full program term. The battery is yours to keep at the end.',
  },
};

export function generateStaticParams() {
  const productSlugs = Object.keys(PRODUCTS);
  return STATES.flatMap((s) =>
    s.cities.flatMap((c) =>
      productSlugs.map((product) => ({
        state: s.slug,
        city: c.slug,
        product,
      }))
    )
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string; product: string }>;
}): Promise<Metadata> {
  const { state: stateSlug, city: citySlug, product: productSlug } = await params;
  const s = STATES.find((s) => s.slug === stateSlug);
  const c = s?.cities.find((c) => c.slug === citySlug);
  const p = PRODUCTS[productSlug];
  if (!s || !c || !p) return {};

  const title = `${p.label} in ${c.name}, ${s.abbr} | SR Energy`;
  const description = `${p.description} No credit check required. Free quote for ${c.name}, ${s.name} homeowners.`;

  return {
    title,
    description,
    alternates: { canonical: `https://srenergy.us/locations/${stateSlug}/${citySlug}/${productSlug}/` },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ state: string; city: string; product: string }>;
}) {
  const { state: stateSlug, city: citySlug, product: productSlug } = await params;

  const s = STATES.find((s) => s.slug === stateSlug);
  const c = s?.cities.find((c) => c.slug === citySlug);
  const p = PRODUCTS[productSlug];
  if (!s || !c || !p) notFound();

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="border-b border-gray-100 bg-[#111827] px-4 py-2.5 text-xs text-gray-400">
        <ol className="mx-auto flex max-w-5xl flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-gray-200 hover:underline">Home</Link></li>
          <li aria-hidden>›</li>
          <li><Link href={`/locations/${stateSlug}/`} className="hover:text-gray-200 hover:underline">{s.name}</Link></li>
          <li aria-hidden>›</li>
          <li><Link href={`/locations/${stateSlug}/${citySlug}/`} className="hover:text-gray-200 hover:underline">{c.name}</Link></li>
          <li aria-hidden>›</li>
          <li className="font-medium text-gray-200" aria-current="page">{p.label}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="bg-[#1e2333] px-4 py-14 text-white sm:py-18">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-3 flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d4920a]/20 px-3 py-1 text-xs font-semibold text-[#F0A500] ring-1 ring-inset ring-[#F0A500]/30">
              {c.name}, {s.abbr} — No Credit Check Required
            </span>
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {p.label} in {c.name}, {s.abbr}
          </h1>
          <p className="mt-4 text-lg text-gray-300">{p.description}</p>
          <div className="mt-8">
            <Link
              href={`/contact?city=${citySlug}&state=${s.abbr}&product=${productSlug}`}
              className="rounded-lg bg-[#F0A500] px-7 py-3 text-base font-semibold text-white shadow hover:bg-[#fbb82a] transition-colors"
            >
              Get Your Free {c.name} Quote →
            </Link>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">
            {p.label} for {c.name} Homeowners
          </h2>
          <p className="text-base leading-relaxed text-gray-700">{p.details}</p>
        </div>
      </section>

      {/* Back + CTA */}
      <section className="bg-[#1e2333] px-4 py-14 text-center text-white">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to get started in {c.name}?</h2>
          <p className="mt-3 text-gray-300">No FICO score needed. Free, no-obligation quote.</p>
          <Link
            href={`/contact?city=${citySlug}&state=${s.abbr}&product=${productSlug}`}
            className="mt-6 inline-block rounded-lg bg-[#F0A500] px-8 py-3 text-base font-semibold text-white shadow hover:bg-[#fbb82a] transition-colors"
          >
            Get Your Free Quote →
          </Link>
          <p className="mt-4 text-sm text-gray-400">
            Or call us:{' '}
            <a href={`tel:${BUSINESS_INFO.phone.replace(/\D/g, '')}`} className="text-[#F0A500] hover:underline">
              {BUSINESS_INFO.phone}
            </a>
          </p>
          <div className="mt-6">
            <Link href={`/locations/${stateSlug}/${citySlug}/`} className="text-sm text-gray-400 hover:text-white underline">
              ← Back to {c.name} Solar
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
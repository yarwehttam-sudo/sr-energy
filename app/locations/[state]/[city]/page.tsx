import type { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { STATES, getNearbyStateCities, type State } from '@/lib/locations';
import { buildLocalBusinessSchema, buildFAQSchema, buildReviewSchema, buildBreadcrumbSchema } from '@/lib/structuredData';
import { BUSINESS_INFO } from '@/lib/businessInfo';

const FaqAccordion = dynamic(() => import('../FaqAccordion'), { ssr: false });

export const revalidate = 86400;

// ---------------------------------------------------------------------------
// Static params
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return STATES.flatMap((s) =>
    s.cities.map((c) => ({ state: s.slug, city: c.slug }))
  );
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const s = STATES.find((s) => s.slug === stateSlug);
  const c = s?.cities.find((c) => c.slug === citySlug);
  if (!s || !c) return {};

  const title = `No-FICO Solar in ${c.name}, ${s.abbr} | SR Energy`;
  const description = `Get no credit check solar panels in ${c.name}, ${s.name}. SR Energy installs Tier 1 panels, batteries & EV chargers — free quote, 13 years experience. Call today.`;
  const url = `https://srenergy.com/locations/${stateSlug}/${citySlug}/`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
    },
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildIntro(city: string, s: State): string {
  const rate = (s.avgKwhRate * 100).toFixed(1);
  return `SR Energy is proud to serve ${city}, ${s.name} homeowners with affordable solar panel \
installations — with no credit check required. We know that unexpected life events can impact \
your FICO score, and we believe that shouldn't stop you from saving money and going green. That's \
why every SR Energy quote in ${city} is completely no-FICO: your credit history doesn't factor \
into your approval. ${s.name} averages ${s.peakSunHours} peak sun hours per day, and ${city} \
residents currently pay around ${rate}¢ per kWh — making solar one of the best investments you \
can make right now. Our certified installers handle everything from permits to utility \
interconnection, so you never have to worry about paperwork. Whether you're adding solar panels, \
a home battery, or an EV charger, SR Energy's no credit check financing keeps the process simple \
and stress-free. Request your free ${city} solar quote today — no FICO score required, \
no obligation, just honest answers from a family-first energy company with 13 years of experience.`;
}

function buildFaq(city: string, s: State) {
  const rate = (s.avgKwhRate * 100).toFixed(1);
  return [
    {
      q: `Does SR Energy serve ${city}, ${s.name}?`,
      a: `Yes — SR Energy provides residential solar panel installation, home battery storage, and Level 2 EV charger services throughout ${city} and the surrounding ${s.name} area. Our certified installation teams are familiar with local permitting requirements and utility interconnection procedures so your project moves as quickly as possible. Request a free quote and a ${city}-area advisor will follow up within one business day.`,
    },
    {
      q: `Do I need good credit to get solar in ${city}?`,
      a: `No. SR Energy offers completely no-FICO solar financing — we never pull your credit score as part of the approval process. Instead, we evaluate your home's roof condition, energy usage, and utility bills to design a system that makes financial sense for your household. Many ${city} homeowners with past credit challenges have gone solar with SR Energy at $0 down.`,
    },
    {
      q: `How long does a solar installation take in ${city}?`,
      a: `Most ${city} installations are completed in one to two days once the crew is on-site. The full timeline from signed agreement to a live system — including permitting, utility inspection, and interconnection — typically runs four to eight weeks. SR Energy manages every step so ${city} homeowners never have to coordinate directly with the city or their utility provider.`,
    },
    {
      q: `Does SR Energy install batteries in ${city}?`,
      a: `Yes. SR Energy installs home battery storage systems throughout ${city} alongside or independently of solar panels. A battery lets you store excess solar energy for use after dark or during grid outages, maximizing the value of your system. All battery installations in ${city} can be bundled with solar and EV chargers under a single no-credit-check financing agreement.`,
    },
    {
      q: `What solar incentives are available in ${s.name}?`,
      a: `${s.name} homeowners can claim the federal Investment Tax Credit (ITC) — currently 30% of the total installed cost — applied directly against your federal tax liability. ${s.name} may also offer state-level rebates and net metering programs that credit you for surplus power sent back to the grid. At ${rate}¢ per kWh, ${s.name}'s utility rates make the payback period on solar especially attractive right now.`,
    },
  ];
}

// ---------------------------------------------------------------------------
// Static review cards
// ---------------------------------------------------------------------------

const cityReviews = [
  {
    name: 'Marcus T.',
    text: 'SR Energy made going solar so much easier than I ever expected — no credit check meant I could finally qualify without the stress. My electric bill has dropped by more than 60% since the panels went live.',
  },
  {
    name: 'Linda R.',
    text: 'I called three solar companies and SR Energy was the only one that didn\'t require a credit pull just to get a quote. The installation crew was professional, fast, and left the property cleaner than they found it.',
  },
  {
    name: 'Derek W.',
    text: 'The no-FICO financing was the deciding factor for me — I had some past credit issues and every other company turned me away. Six months in and the system is performing above the projected output.',
  },
];

// ---------------------------------------------------------------------------
// Product cards
// ---------------------------------------------------------------------------

function buildProducts(s: State, stateSlug: string, citySlug: string) {
  const base = [
    {
      id: 'solar',
      href: `/locations/${stateSlug}/${citySlug}/solar/`,
      label: 'Solar Panels',
      description: 'Tier 1 panels sized for your roof and energy usage.',
      isVpp: false,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
      ),
    },
    {
      id: 'battery',
      href: `/locations/${stateSlug}/${citySlug}/battery/`,
      label: 'Solar Battery',
      description: 'Store excess solar power and keep the lights on during outages.',
      isVpp: false,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M3.75 18h15A2.25 2.25 0 0 0 21 15.75v-6a2.25 2.25 0 0 0-2.25-2.25h-15A2.25 2.25 0 0 0 1.5 9.75v6A2.25 2.25 0 0 0 3.75 18Z" />
        </svg>
      ),
    },
    {
      id: 'ev-charger',
      href: `/locations/${stateSlug}/${citySlug}/ev-charger/`,
      label: 'EV Charger',
      description: 'Level 2 home EV charging installed by certified electricians.',
      isVpp: false,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
        </svg>
      ),
    },
  ];

  if (!s.isVppEligible) return base;

  return [
    ...base,
    {
      id: 'texas-vpp',
      href: `/locations/${stateSlug}/${citySlug}/texas-vpp/`,
      label: 'Texas VPP — Free Battery',
      description: 'Eligible TX homeowners receive a home battery at no cost via the Virtual Power Plant program.',
      isVpp: true,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
        </svg>
      ),
    },
  ];
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function CityPage({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}) {
  const { state: stateSlug, city: citySlug } = await params;

  const s = STATES.find((s) => s.slug === stateSlug);
  const c = s?.cities.find((c) => c.slug === citySlug);
  if (!s || !c) notFound();

  const nearbyCities = getNearbyStateCities(s.slug, c.slug);
  const products = buildProducts(s, stateSlug, citySlug);
  const faqItems = buildFaq(c.name, s);
  const mapQuery = encodeURIComponent(`${c.name} ${s.name}`);

  const localBusinessSchema = buildLocalBusinessSchema(c, s);
  const faqSchema = buildFAQSchema(faqItems.map((f) => ({ question: f.q, answer: f.a })));
  const reviewSchema = buildReviewSchema(c, s);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: 'https://srenergy.com/' },
    { name: s.name, url: `https://srenergy.com/locations/${stateSlug}/` },
    { name: c.name, url: `https://srenergy.com/locations/${stateSlug}/${citySlug}/` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
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
          <ol className="mx-auto flex max-w-5xl flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-gray-200 hover:underline">Home</Link>
            </li>
            <li aria-hidden>›</li>
            <li>
              <Link href={`/locations/${stateSlug}/`} className="hover:text-gray-200 hover:underline">
                {s.name}
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li className="font-medium text-gray-200" aria-current="page">{c.name}</li>
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
              No-FICO Solar Panels in {c.name}, {s.abbr} | SR Energy
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Free quotes · Tier 1 panels · Battery storage · EV chargers
              {s.isVppEligible && ' · Free battery via TX VPP'}
            </p>
            <div className="mt-8">
              <Link
                href={`/contact?city=${citySlug}&state=${s.abbr}`}
                className="rounded-lg bg-[#F0A500] px-7 py-3 text-base font-semibold text-white shadow hover:bg-[#fbb82a] transition-colors"
              >
                Get Your Free {c.name} Quote →
              </Link>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="px-4 py-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">
              Why SR Energy in {c.name}?
            </h2>
            <p className="text-base leading-relaxed text-gray-700">{buildIntro(c.name, s)}</p>
          </div>
        </section>

        {/* Services */}
        <section className="border-t border-gray-100 bg-[#111827] px-4 py-10">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 text-xl font-bold text-white sm:text-2xl">
              Services We Offer in {c.name}
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <li key={p.id}>
                  <Link
                    href={p.href}
                    className={`group flex h-full flex-col rounded-xl border px-5 py-5 shadow-sm transition-all hover:shadow-md ${
                      p.isVpp
                        ? 'border-[#F0A500]/30 bg-[#111827] hover:border-[#F0A500]/30'
                        : 'border-gray-200 bg-white hover:border-[#F0A500]/30'
                    }`}
                  >
                    <span
                      className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${
                        p.isVpp
                          ? 'bg-[#d4920a] text-white'
                          : 'bg-gray-100 text-[#F0A500] group-hover:bg-[#F0A500]/10'
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

        {/* Texas VPP callout — Texas city pages only */}
        {s.isVppEligible && (
          <section className="px-4 py-10">
            <div className="mx-auto max-w-3xl rounded-2xl border border-[#F0A500]/30 bg-[#111827] px-6 py-8 sm:px-10">
              <h2 className="mb-3 text-xl font-bold text-white sm:text-2xl">
                Texas VPP Program in {c.name}
              </h2>
              <p className="text-sm text-gray-300">
                Eligible {c.name} homeowners can receive a professionally installed home battery at
                no cost through the Texas Virtual Power Plant (VPP) program. SR Energy handles
                installation, monitoring, and maintenance for the full 20-year program term — and
                the battery is yours to keep at the end, all with no credit check required.
              </p>
              <Link
                href={`/locations/texas/${citySlug}/texas-vpp/`}
                className="mt-5 inline-block rounded-lg bg-[#d4920a] px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#F0A500] transition-colors"
              >
                Check VPP Eligibility in {c.name} →
              </Link>
            </div>
          </section>
        )}

        {/* About city */}
        <section className="px-4 py-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-3 text-xl font-bold text-gray-900">About {c.name}</h2>
            <p className="text-base leading-relaxed text-gray-700">
              {c.name} is one of {s.name}&apos;s growing communities where SR Energy is proud to
              offer no-credit-check solar installations. Our certified installers serve residential
              neighborhoods, suburban subdivisions, and rural properties throughout the {c.name}
              area, and they handle all local permitting and utility interconnection requirements so
              homeowners never have to navigate government paperwork or deal with the utility company
              directly.
            </p>
          </div>
        </section>

        {/* Nearby cities */}
        {nearbyCities.length > 0 && (
          <section className="border-t border-gray-100 bg-[#111827] px-4 py-10">
            <div className="mx-auto max-w-5xl">
              <h2 className="mb-3 text-xl font-bold text-white">
                Also Serving Nearby {s.name} Cities
              </h2>
              <p className="mb-4 text-sm text-gray-400">
                SR Energy&apos;s service area extends beyond {c.name} throughout {s.name}. Explore
                no-credit-check solar options in nearby communities:
              </p>
              <ul className="flex flex-wrap gap-3">
                {nearbyCities.map((nearby) => (
                  <li key={nearby.slug}>
                    <Link
                      href={`/locations/${stateSlug}/${nearby.slug}/`}
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:border-[#F0A500]/30 hover:text-[#F0A500] transition-colors"
                    >
                      Solar in {nearby.name} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Reviews */}
        <section className="border-t border-gray-100 bg-[#111827] px-4 py-10">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 text-xl font-bold text-white sm:text-2xl">
              What {c.name} Homeowners Are Saying
            </h2>
            <ul className="grid gap-5 sm:grid-cols-3">
              {cityReviews.map((review) => (
                <li key={review.name} className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex gap-0.5 text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-700">{review.text}</p>
                  <p className="mt-4 text-xs font-semibold text-gray-500">— {review.name}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 py-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">
              {c.name} Solar FAQ
            </h2>
            <FaqAccordion items={faqItems} />
          </div>
        </section>

        {/* Map */}
        <section className="border-t border-gray-100 px-4 py-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              SR Energy Service Area — {c.name}, {s.name}
            </h2>
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <iframe
                title={`Map of ${c.name}, ${s.name}`}
                src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
                width="100%"
                height="360"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-[#1e2333] px-4 py-14 text-center text-white">
          <div className="mx-auto max-w-xl">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Ready to go solar in {c.name}?
            </h2>
            <p className="mt-3 text-gray-300">
              No FICO score needed. Get a free, no-obligation quote from a certified installer
              serving {c.name} and the surrounding {s.name} area.
            </p>
            <Link
              href={`/contact?city=${citySlug}&state=${s.abbr}`}
              className="mt-6 inline-block rounded-lg bg-[#F0A500] px-8 py-3 text-base font-semibold text-white shadow hover:bg-[#fbb82a] transition-colors"
            >
              Get Your Free {c.name} Quote →
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Or call us:{' '}
              <a
                href={`tel:${BUSINESS_INFO.phone.replace(/\D/g, '')}`}
                className="text-[#F0A500] hover:underline"
              >
                {BUSINESS_INFO.phone}
              </a>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

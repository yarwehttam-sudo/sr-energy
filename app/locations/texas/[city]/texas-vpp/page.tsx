import type { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { STATES } from '@/lib/locations';
import { buildLocalBusinessSchema, buildServiceSchema, buildFAQSchema, buildReviewSchema, buildBreadcrumbSchema } from '@/lib/structuredData';
import { BUSINESS_INFO } from '@/lib/businessInfo';
import VppZipChecker from '@/components/VppZipChecker';

const FaqAccordion = dynamic(() => import('../../../[state]/FaqAccordion'), { ssr: false });

export const revalidate = 86400;

const TEXAS = STATES.find((s) => s.slug === 'texas')!;

// ---------------------------------------------------------------------------
// Static params — Texas cities only
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return TEXAS.cities.map((c) => ({ city: c.slug }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: citySlug } = await params;
  const c = TEXAS.cities.find((c) => c.slug === citySlug);
  if (!c) return {};

  const title = `Texas VPP Program in ${c.name} | Free Battery | SR Energy`;
  const description = `${c.name} homeowners: get a free home battery through the Texas VPP program. $0 cost, 20-year warranty, no credit check. SR Energy installs & monitors it all.`;
  const url = `https://srenergy.com/locations/texas/${citySlug}/texas-vpp/`;

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
// Static content helpers
// ---------------------------------------------------------------------------

function buildIntro(city: string): string {
  return `Texas homeowners in ${city} know better than most how quickly an ERCOT grid event can \
leave a neighborhood without power. Since Winter Storm Uri in 2021, energy reliability has been a \
top concern for families across the state — and the Texas Virtual Power Plant (VPP) program is the \
state's answer. Through this program, eligible ${city} homeowners receive a professionally \
installed home battery at absolutely no cost. In exchange, SR Energy enrolls your battery in a \
voluntary grid-support network: during high-demand events, ERCOT can draw a small amount of stored \
energy from participating homes to stabilize the grid. You keep backup power priority for your own \
home, and you keep the battery permanently after the 20-year program term. For ${city} residents \
still paying AEP, Oncor, CenterPoint, or TNMP rates, the VPP program is one of the only ways to \
add energy independence to your home with zero upfront cost and no credit check required.`;
}

const programDetails = [
  {
    q: 'Battery Installation',
    a: 'SR Energy handles the full installation — equipment, labor, permitting, and utility interconnection. A certified electrician will mount the battery at your electrical panel, connect it to your home circuit, and commission it for both backup and VPP grid-support operation. Most installations are completed in a single day with no disruption to your home power during the process.',
  },
  {
    q: 'Grid-Tied Connection',
    a: 'Your battery is registered as a Distributed Energy Resource (DER) with ERCOT through your utility provider. When the grid is stressed, the SR Energy VPP platform can dispatch up to a pre-agreed percentage of your stored energy back to the local distribution network. You always retain enough capacity for whole-home backup during a grid outage — your household needs come first.',
  },
  {
    q: 'Warranty — 50% Capacity Over 20 Years',
    a: "Your battery carries a 20-year performance warranty guaranteeing it retains at least 50% of its original capacity at the end of the program term. If the battery degrades below that threshold at any point, SR Energy will repair or replace it at no cost to you. After the 20-year term, the battery is yours outright — fully paid off, no strings attached.",
  },
  {
    q: 'Customer Cost',
    a: "Homeowners who remain with their approved VPP utility provider (AEP, Oncor, CenterPoint, or TNMP) pay $0 per month for the entire 20-year program — the battery, installation, monitoring, and maintenance are all covered. If you choose to switch to a non-participating retail electric provider during the program term, a fee of $150/month per battery applies until you return to an approved provider or the term concludes.",
  },
];

const benefits = [
  {
    label: 'No Solar Required',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      </svg>
    ),
  },
  {
    label: 'No Lien on Home',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12 11.204 3.045c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    label: '$0 Monthly',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    label: 'Fully Automated',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
  {
    label: 'No Credit Check',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    label: 'Works with Existing Utility',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5 10.5 21l.75-4.5L18 9l-7.5 3-3.75-3.75L3.75 13.5ZM10.5 21 21 3" />
      </svg>
    ),
  },
  {
    label: 'Professional Install Included',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
      </svg>
    ),
  },
];

function buildVppFaq(city: string) {
  return [
    {
      q: `What is the Texas VPP program in ${city}?`,
      a: `The Texas Virtual Power Plant (VPP) program provides eligible ${city} homeowners with a professionally installed home battery at absolutely no cost. In exchange, SR Energy enrolls your battery in a voluntary grid-support network where ERCOT can draw a small amount of stored energy during high-demand events to stabilize the grid. You keep backup power priority for your own home, and the battery becomes yours permanently after the 20-year program term.`,
    },
    {
      q: `Is the battery really free for ${city} homeowners?`,
      a: `Yes — ${city} homeowners who remain with an approved utility provider (AEP Texas, Oncor, CenterPoint Energy, or TNMP) pay $0 for the battery, installation, monitoring, and maintenance for the entire 20-year program. There is no upfront cost, no monthly fee, and no credit check required. The only scenario where a charge applies is if you voluntarily switch to a non-participating retail electric provider during the program term.`,
    },
    {
      q: `Do I need solar panels already to qualify in ${city}?`,
      a: `No. The Texas VPP program is open to ${city} homeowners regardless of whether they have solar panels installed. The battery charges from the grid at off-peak rates and discharges during outages or high-demand grid events. Adding solar can increase your energy savings, but it is not a requirement for VPP enrollment.`,
    },
    {
      q: `How does SR Energy monitor my battery in ${city}?`,
      a: `SR Energy connects your ${city} battery to its remote monitoring platform from the day of installation. The platform tracks charge levels, dispatch events, and battery health around the clock — and SR Energy's operations team responds automatically if any issue is detected. ${city} homeowners can also view their battery's status, charge history, and grid-dispatch activity through SR Energy's homeowner dashboard at any time.`,
    },
    {
      q: `How long does the VPP battery installation take in ${city}?`,
      a: `Most ${city} VPP battery installations are completed in a single day. SR Energy handles the full process — equipment delivery, mounting, electrical panel connection, utility interconnection paperwork, and final commissioning — so you never need to coordinate with a contractor or your utility company. From signing your program agreement to a fully operational battery typically takes two to four weeks.`,
    },
  ];
}

// ---------------------------------------------------------------------------
// Static VPP review cards
// ---------------------------------------------------------------------------

const vppReviews = [
  {
    name: 'Carla M.',
    text: 'I honestly could not believe the battery was truly free until SR Energy showed up and installed it — no catch, no hidden fees, nothing. When the grid went down last summer, our house was the only one on the block with power.',
  },
  {
    name: 'James P.',
    text: 'The VPP installation took less than a day and SR Energy handled all the paperwork with our utility company directly. Knowing we have reliable backup power while also helping stabilize the Texas grid makes the whole program feel even better.',
  },
  {
    name: 'Tanya S.',
    text: 'We were skeptical about a free battery program but everything SR Energy promised was delivered exactly as described — zero cost, no lien on the house, and a 20-year warranty. The homeowner dashboard makes it easy to track every charge cycle.',
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function TexasVppCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const c = TEXAS.cities.find((c) => c.slug === citySlug);
  if (!c) notFound();

  const otherTexasCities = TEXAS.cities.filter((other) => other.slug !== c.slug);
  const faqItems = buildVppFaq(c.name);

  const localBusinessSchema = buildLocalBusinessSchema(c, TEXAS);
  const serviceSchema = buildServiceSchema('Texas Virtual Power Plant (VPP) Program', c, TEXAS);
  const faqSchema = buildFAQSchema(faqItems.map((f) => ({ question: f.q, answer: f.a })));
  const reviewSchema = buildReviewSchema(c, TEXAS);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: 'https://srenergy.com/' },
    { name: 'Texas', url: 'https://srenergy.com/locations/texas/' },
    { name: c.name, url: `https://srenergy.com/locations/texas/${citySlug}/` },
    { name: 'Texas VPP Program', url: `https://srenergy.com/locations/texas/${citySlug}/texas-vpp/` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
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
            <li><Link href="/" className="hover:text-gray-200 hover:underline">Home</Link></li>
            <li aria-hidden>›</li>
            <li><Link href="/locations/texas/" className="hover:text-gray-200 hover:underline">Texas</Link></li>
            <li aria-hidden>›</li>
            <li>
              <Link href={`/locations/texas/${citySlug}/`} className="hover:text-gray-200 hover:underline">
                {c.name}
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li className="font-medium text-gray-200" aria-current="page">Texas VPP Program</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="bg-[#1e2333] px-4 py-14 text-white sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-3 flex justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white ring-1 ring-inset ring-white/30">
                Texas VPP Program — {c.name}, TX
              </span>
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Texas VPP Program in {c.name}, TX<br className="hidden sm:block" /> — Free Home Battery
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              SR Energy installs your battery at $0 cost. You get backup power.
              ERCOT gets grid stability. Everyone wins.
            </p>

            {/* Benefit pills */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {['$0 Cost', '20-Year Warranty', 'Backup Power', 'You Keep It After 20 Years'].map(
                (pill) => (
                  <span
                    key={pill}
                    className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white ring-1 ring-inset ring-white/25"
                  >
                    {pill}
                  </span>
                )
              )}
            </div>

            <div className="mt-8">
              <Link
                href={`/get-quote?product=texas-vpp&state=TX&city=${citySlug}`}
                className="rounded-lg bg-[#F0A500] px-7 py-3 text-base font-semibold text-white shadow hover:bg-[#fbb82a] transition-colors"
              >
                Check My {c.name} VPP Eligibility →
              </Link>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="px-4 py-10">
          <div className="mx-auto max-w-3xl">
            <p className="text-base leading-relaxed text-gray-700">{buildIntro(c.name)}</p>
          </div>
        </section>

        {/* ZIP Checker */}
        <section className="border-t border-gray-100 px-4 py-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-5 text-xl font-bold text-gray-900 sm:text-2xl">
              Check If Your ZIP Code Qualifies
            </h2>
            <VppZipChecker citySlug={citySlug} />
          </div>
        </section>

        {/* Program Details */}
        <section className="border-t border-gray-100 bg-[#111827] px-4 py-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-xl font-bold text-white sm:text-2xl">
              Program Details
            </h2>
            <FaqAccordion items={programDetails} />
          </div>
        </section>

        {/* 7 Benefit Icons */}
        <section className="px-4 py-10">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">
              Why {c.name} Homeowners Choose the VPP Program
            </h2>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {benefits.map((b) => (
                <li
                  key={b.label}
                  className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-5 text-center shadow-sm"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#F0A500]/10 text-[#F0A500]">
                    {b.icon}
                  </span>
                  <span className="text-xs font-semibold text-gray-700">{b.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Eligibility Checklist */}
        <section className="border-t border-gray-100 bg-[#111827] px-4 py-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-xl font-bold text-white sm:text-2xl">
              Am I Eligible? — {c.name} Checklist
            </h2>
            <ul className="space-y-3">
              {[
                `You own your home in ${c.name} or the surrounding service area`,
                'Your home is served by one of the four approved Texas utilities: AEP, Oncor, CenterPoint, or TNMP',
                'Your property is a single-family residence (manufactured homes also qualify)',
                'Your electrical panel has available breaker space for battery interconnection',
                `Your ${c.name} property address is registered as an ERCOT-connected service point`,
                'You are not currently enrolled in a conflicting whole-home battery VPP program with another provider',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d4920a] text-white">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </span>
                  <span className="text-sm text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Reviews */}
        <section className="border-t border-gray-100 bg-[#111827] px-4 py-10">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 text-xl font-bold text-white sm:text-2xl">
              What {c.name} Homeowners Say About the VPP Program
            </h2>
            <ul className="grid gap-5 sm:grid-cols-3">
              {vppReviews.map((review) => (
                <li key={review.name} className="flex flex-col rounded-xl border border-[#F0A500]/30 bg-white p-5 shadow-sm">
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
              {c.name} Texas VPP FAQ
            </h2>
            <FaqAccordion items={faqItems} />
          </div>
        </section>

        {/* Nearby Texas VPP cities */}
        {otherTexasCities.length > 0 && (
          <section className="border-t border-gray-100 bg-[#111827] px-4 py-10">
            <div className="mx-auto max-w-5xl">
              <h2 className="mb-4 text-xl font-bold text-white">
                Texas VPP Program in Other Cities
              </h2>
              <ul className="flex flex-wrap gap-3">
                {otherTexasCities.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/locations/texas/${other.slug}/texas-vpp/`}
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:border-[#F0A500]/30 hover:text-[#F0A500] transition-colors"
                    >
                      VPP in {other.name} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="bg-[#1e2333] px-4 py-14 text-center text-white">
          <div className="mx-auto max-w-xl">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Get your free battery in {c.name} today.
            </h2>
            <p className="mt-3 text-gray-300">
              $0 cost · 20-year warranty · No credit check · Keep it forever.
            </p>
            <Link
              href={`/get-quote?product=texas-vpp&state=TX&city=${citySlug}`}
              className="mt-6 inline-block rounded-lg bg-[#F0A500] px-8 py-3 text-base font-semibold text-white shadow hover:bg-[#fbb82a] transition-colors"
            >
              Check My {c.name} VPP Eligibility →
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Or call us:{' '}
              <a
                href={`tel:${BUSINESS_INFO.phone.replace(/\D/g, '')}`}
                className="text-white hover:underline"
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

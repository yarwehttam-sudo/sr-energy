'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BUSINESS_INFO } from '@/lib/businessInfo';
import SavingsCalculator from '@/app/components/SavingsCalculator';
import HoneycombHero from '@/app/components/HoneycombHero';
import ProductCards from '@/app/components/ProductCards';
import HowItWorks from '@/app/components/HowItWorks';

// Build: force-redeploy-v2

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardFadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

// ---------------------------------------------------------------------------
// Testimonials strip data (duplicated for seamless CSS loop)
// ---------------------------------------------------------------------------

const testimonials = [
  { name: 'Marcus T.', text: 'My bill dropped by over 60% — and no credit check meant I could actually qualify.' },
  { name: 'Linda R.', text: 'SR Energy was the only company that didn\'t pull my credit just to give me a quote.' },
  { name: 'Derek W.', text: 'Six months in and the system is performing above the projected output. Incredible.' },
  { name: 'Priya S.', text: 'Installation was done in a single day. The crew was professional and left everything spotless.' },
  { name: 'James O.', text: 'The no-FICO financing was the deciding factor. Other companies turned me away.' },
  { name: 'Rachel M.', text: '13 years of experience shows — every step from permit to flip-the-switch was seamless.' },
];

// Double the array so the CSS translation of -50% creates a perfect loop
const tickerItems = [...testimonials, ...testimonials];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function HomePageClient() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* ── Hero ── */}
      <section
        className="relative px-4 py-14 text-white sm:py-20"
        style={{ backgroundColor: '#1e2333' }}
      >
        {/* Animated honeycomb background */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
          <HoneycombHero />
        </div>

        <div className="relative mx-auto max-w-3xl text-center" style={{ position: 'relative', zIndex: 10 }}>
          <motion.div
            className="mb-3 flex justify-center"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0A500]/20 px-3 py-1 text-xs font-semibold text-[#F0A500] ring-1 ring-inset ring-[#F0A500]/30">
              No Credit Check Required — 30+ States Served
            </span>
          </motion.div>

          <motion.h1
            className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0, duration: 0.6, ease: 'easeOut' }}
          >
            Discover What a Home Energy Upgrade Can Do
          </motion.h1>

          <motion.p
            className="mt-4 text-lg text-gray-300"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          >
            SR Energy helps homeowners upgrade to solar panels, home batteries, and EV chargers.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
          >
            <Link
              href="/contact/"
              className="rounded-lg bg-[#F0A500] px-8 py-3 text-base font-semibold text-white shadow hover:bg-[#fbb82a] transition-colors"
            >
              Get a Free Quote →
            </Link>
            <a href={BUSINESS_INFO.phoneTel} className="text-sm font-medium text-[#F0A500] hover:underline">
              Or call {BUSINESS_INFO.phone}
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Savings Calculator ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <SavingsCalculator />
      </motion.div>

      {/* ── Product Cards ── */}
      <ProductCards />

      {/* ── How It Works ── */}
      <HowItWorks />

      {/* ── Why SR Energy ── */}
      <section className="bg-[#1e2333] px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            className="mb-3 text-center text-2xl font-bold text-white sm:text-3xl"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Why SR Energy?
          </motion.h2>
          <motion.p
            className="mb-8 text-center text-base text-gray-400"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            No shortcuts. No gimmicks. Just honest work and equipment that lasts.
          </motion.p>

          <motion.div
            className="grid gap-6 sm:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={cardFadeUp} className="flex flex-col rounded-xl border border-[#F0A500]/20 bg-[#111827] p-6 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#F0A500]/10 text-[#F0A500]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
              </span>
              <h3 className="text-base font-bold text-white">No Credit Check Required</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                We never pull your FICO score. Every homeowner deserves access to clean energy
                savings regardless of credit history.
              </p>
            </motion.div>

            <motion.div variants={cardFadeUp} className="flex flex-col rounded-xl border border-[#F0A500]/20 bg-[#111827] p-6 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#F0A500]/10 text-[#F0A500]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </span>
              <h3 className="text-base font-bold text-white">13 Years Experience</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                Over a decade of residential solar installations means we know how to get your
                system permitted, installed, and producing power as fast as possible.
              </p>
            </motion.div>

            <motion.div variants={cardFadeUp} className="flex flex-col rounded-xl border border-[#F0A500]/20 bg-[#111827] p-6 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#F0A500]/10 text-[#F0A500]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
              </span>
              <h3 className="text-base font-bold text-white">Tier 1 Equipment</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                We only install industry-leading Tier 1 solar panels, certified home batteries,
                and Level 2 EV chargers — equipment built to last 25+ years.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Testimonial ticker strip ── */}
      <div className="overflow-hidden border-y border-[#F0A500]/20 bg-[#1e2333] py-4">
        <div className="ticker-track" aria-hidden="true">
          {tickerItems.map((t, i) => (
            <div
              key={i}
              className="mx-6 flex shrink-0 items-center gap-3 whitespace-nowrap"
            >
              <span className="text-[#F0A500]">★</span>
              <span className="text-sm font-medium text-white">{t.name}:</span>
              <span className="text-sm text-gray-300">{t.text}</span>
              <span className="ml-6 text-[#F0A500]/30">|</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Services ── */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Find Energy Upgrades in Your City
          </motion.h2>
          <motion.p
            className="mb-8 text-base text-gray-600"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            See local pricing, incentives, and certified installers in your area.
          </motion.p>

          <motion.ul
            className="grid gap-5 sm:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.li variants={fadeUp} className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-[#F0A500]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
              </span>
              <span className="text-sm font-bold text-gray-900">Solar Panels</span>
              <span className="mt-1 text-xs leading-relaxed text-gray-500">
                Tier 1 panels sized for your roof and energy usage. $0 down with no credit check.
              </span>
            </motion.li>

            <motion.li variants={fadeUp} className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-[#F0A500]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M3.75 18h15A2.25 2.25 0 0 0 21 15.75v-6a2.25 2.25 0 0 0-2.25-2.25h-15A2.25 2.25 0 0 0 1.5 9.75v6A2.25 2.25 0 0 0 3.75 18Z" />
                </svg>
              </span>
              <span className="text-sm font-bold text-gray-900">Home Battery Storage</span>
              <span className="mt-1 text-xs leading-relaxed text-gray-500">
                Store excess solar energy for use after dark or during grid outages.
              </span>
            </motion.li>

            <motion.li variants={fadeUp} className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-[#F0A500]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                </svg>
              </span>
              <span className="text-sm font-bold text-gray-900">EV Charger Installation</span>
              <span className="mt-1 text-xs leading-relaxed text-gray-500">
                Level 2 home EV charging installed by certified electricians.
              </span>
            </motion.li>
          </motion.ul>

          <motion.div
            className="mt-8"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Link
              href="/locations/"
              className="inline-block rounded-lg bg-[#F0A500] px-8 py-3 text-base font-semibold text-white shadow hover:bg-[#fbb82a] transition-colors"
            >
              Find Your City →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <motion.section
        className="bg-[#1e2333] px-4 py-14 text-center text-white"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to upgrade your home?
          </h2>
          <p className="mt-3 text-gray-300">
            Get a free, no-obligation quote from a certified SR Energy installer in your area.
            No FICO score required.
          </p>
          <Link
            href="/contact/"
            className="mt-6 inline-block rounded-lg bg-[#F0A500] px-8 py-3 text-base font-semibold text-white shadow hover:bg-[#fbb82a] transition-colors"
          >
            Get a Free Quote →
          </Link>
          <p className="mt-4 text-sm text-gray-400">
            Or call us:{' '}
            <a href={BUSINESS_INFO.phoneTel} className="text-[#F0A500] hover:underline">
              {BUSINESS_INFO.phone}
            </a>
          </p>
        </div>
      </motion.section>

    </main>
  );
}

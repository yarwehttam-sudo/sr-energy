'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// ── Data ──────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    title: 'Electrical Panel Evaluation',
    description:
      'A licensed SR Energy electrician inspects your electrical panel to confirm available capacity for a dedicated 240V circuit. Most panels qualify without an upgrade.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
      </svg>
    ),
  },
  {
    title: 'Certified Installation',
    description:
      'Your electrician runs a dedicated 240V circuit, mounts the Level 2 charger in your garage or driveway, and completes all necessary wiring and weatherproofing.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
      </svg>
    ),
  },
  {
    title: 'Plug In & Charge',
    description:
      'Connect your EV using the standard J1772 connector (or Tesla adapter) and charge at up to 7× the speed of a standard household outlet.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    ),
  },
  {
    title: 'Schedule Off-Peak Charging',
    description:
      'Set charging times through your EV\'s companion app or the charger itself. Charge during the cheapest rate window — most customers pay under 5¢ per mile.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
];

const BENEFITS = [
  {
    title: '7× Faster Than a Wall Outlet',
    description:
      'A Level 2 charger adds 20–30 miles of range per hour — compared to 3–5 miles per hour from a standard 120V outlet. A full charge overnight, every night.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    ),
  },
  {
    title: 'Works with Any EV',
    description:
      'All EVs sold in the US use the J1772 Level 2 standard. Tesla owners use an included adapter. SR Energy installs brand-agnostic hardware.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
      </svg>
    ),
  },
  {
    title: 'Lower Cost Per Mile',
    description:
      'Charging at home costs around 4–5¢ per mile compared to 14¢+ per mile for gasoline. Most EV owners save $1,000–$1,500 per year on fuel.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    title: 'Increases Home Value',
    description:
      'A pre-installed Level 2 charger is increasingly expected by buyers — and can be a differentiating factor in a competitive real estate market.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12 11.204 3.045c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
];

const STATS = [
  { value: '7×', label: 'Faster than standard outlet' },
  { value: '~$1,200', label: 'Avg annual fuel savings' },
  { value: '4–5¢', label: 'Per mile charging cost' },
  { value: '2–4 hrs', label: 'Typical install time' },
];

const FAQS = [
  {
    q: 'What Level is a home EV charger, and why does it matter?',
    a: 'SR Energy installs Level 2 chargers, which operate at 240V — the same voltage as a clothes dryer. Level 2 adds 20–30 miles of range per hour versus 3–5 miles per hour on a standard Level 1 (120V) outlet. For most EV owners, Level 2 means a full charge every morning with a simple overnight plug-in.',
  },
  {
    q: 'Will it work with my electric vehicle?',
    a: 'Yes. Every EV sold in the United States uses the SAE J1772 standard for Level 2 charging, including vehicles from Ford, GM, Hyundai, Kia, Rivian, Volkswagen, and BMW. Tesla vehicles include a J1772 adapter. SR Energy installs brand-agnostic hardware that will continue working even if you switch vehicles.',
  },
  {
    q: 'How long does EV charger installation take?',
    a: 'For most homes, the installation is completed in 2–4 hours. Your electrician will run a dedicated 240V circuit from your panel to the charger location, mount the unit, and test the full system before leaving.',
  },
  {
    q: 'Does my electrical panel need to be upgraded?',
    a: 'Most residential panels have sufficient capacity. During the site visit, your SR Energy electrician will assess available breaker space and panel amperage. An upgrade is sometimes needed for older homes with 100A panels, but the majority of installations proceed without one. We\'ll tell you upfront if an upgrade is required and what it costs.',
  },
];

// ── Shared sub-components ─────────────────────────────────────────────────────

function StepFlow({ steps }: { steps: typeof STEPS }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="relative">
      <div className="absolute top-6 left-[6.25%] right-[6.25%] h-[2px] hidden md:block bg-gray-700" />
      <motion.div
        className="absolute top-6 left-[6.25%] right-[6.25%] h-[2px] hidden md:block origin-left bg-[#F0A500]"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
      />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className="flex flex-col"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.12 }}
          >
            <div className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold"
              style={{ background: '#F0A500', color: '#1e2333' }}>
              {i + 1}
            </div>
            <div className="mb-3 text-[#F0A500]">{step.icon}</div>
            <h3 className="mb-2 text-base font-bold text-white">{step.title}</h3>
            <p className="text-sm leading-relaxed text-gray-400">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function BenefitCard({ benefit, index }: { benefit: (typeof BENEFITS)[0]; index: number }) {
  return (
    <motion.div
      className="rounded-xl border border-gray-700 bg-[#1e2333] p-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0A500]/10 text-[#F0A500]">
        {benefit.icon}
      </div>
      <h3 className="mb-2 text-base font-bold text-white">{benefit.title}</h3>
      <p className="text-sm leading-relaxed text-gray-400">{benefit.description}</p>
    </motion.div>
  );
}

function FaqItem({ faq, index }: { faq: (typeof FAQS)[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      className="border-b border-gray-200"
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="group flex w-full items-center justify-between py-5 text-left"
      >
        <span className="pr-4 text-base font-medium text-gray-900 group-hover:text-[#F0A500] transition-colors">
          {faq.q}
        </span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="h-5 w-5 shrink-0 text-gray-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-gray-600">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EvChargerClient() {
  return (
    <main className="min-h-screen bg-[#1e2333] text-white -mx-4 sm:-mx-6 lg:-mx-8">

      {/* Hero */}
      <section className="px-4 pt-20 pb-16 text-center">
        <motion.div
          className="mx-auto max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span
            className="mb-5 inline-block rounded-full px-4 py-1.5 text-xs font-semibold"
            style={{ background: 'rgba(240,165,0,0.15)', color: '#F0A500' }}
          >
            Level 2 · All EVs · Licensed Electricians
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Home EV Charger
          </h1>
          <p className="mt-5 text-lg text-gray-300 sm:text-xl">
            Charge your EV 7× faster than a standard outlet — at home, overnight, for pennies
            per mile. Certified installation, permits handled.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-lg bg-[#F0A500] px-8 py-3.5 text-base font-semibold text-white shadow hover:bg-[#fbb82a] transition-colors"
            >
              Get a Free Charger Quote
            </Link>
            <Link
              href="/how-it-works"
              className="rounded-lg border border-gray-600 px-8 py-3.5 text-base font-semibold text-gray-200 hover:border-gray-400 hover:text-white transition-colors"
            >
              How It Works
            </Link>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="bg-[#111827] px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold sm:text-4xl">How EV Charger Installation Works</h2>
            <p className="mt-3 text-gray-400">
              From panel check to first charge — usually completed in a single visit.
            </p>
          </motion.div>
          <StepFlow steps={STEPS} />
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Why Home Charging</h2>
            <p className="mt-3 text-gray-500">
              Faster, cheaper, and more convenient than relying on public chargers.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b, i) => (
              <BenefitCard key={b.title} benefit={b} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#1e2333] px-4 py-14">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="text-3xl font-bold sm:text-4xl" style={{ color: '#F0A500' }}>
                  {s.value}
                </div>
                <div className="mt-1.5 text-sm text-gray-400">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <motion.div
            className="mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">EV Charger FAQ</h2>
            <p className="mt-3 text-gray-500">Common questions before booking an installation.</p>
          </motion.div>
          <div className="divide-y divide-gray-200">
            {FAQS.map((faq, i) => (
              <FaqItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#111827] px-4 py-20 text-center">
        <motion.div
          className="mx-auto max-w-xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to install your EV charger?</h2>
          <p className="mt-4 text-lg text-gray-300">
            No credit check. Licensed electricians. Most installations completed same-day.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-lg bg-[#F0A500] px-8 py-3.5 text-base font-semibold text-white shadow hover:bg-[#fbb82a] transition-colors"
            >
              Get My Free Quote
            </Link>
            <Link
              href="/locations"
              className="rounded-lg border border-gray-600 px-8 py-3.5 text-base font-semibold text-gray-200 hover:border-gray-400 hover:text-white transition-colors"
            >
              Find My Location
            </Link>
          </div>
        </motion.div>
      </section>

    </main>
  );
}

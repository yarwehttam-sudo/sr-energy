'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// ── Data ──────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    title: 'Sunlight Hits Your Panels',
    description:
      'Solar cells in each panel absorb photons from sunlight. This excites electrons and generates direct current (DC) electricity — even on overcast days.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      </svg>
    ),
  },
  {
    title: 'Inverter Converts DC to AC',
    description:
      'A solar inverter transforms the DC electricity from your panels into AC electricity — the same type your appliances, lights, and outlets already use.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
      </svg>
    ),
  },
  {
    title: 'Power Flows to Your Home First',
    description:
      'AC electricity flows directly to your electrical panel and powers whatever is running in your home in real time — reducing what you draw from the grid, dollar for dollar.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    title: 'Excess Energy Is Stored or Exported',
    description:
      'When your panels produce more than your home needs, the surplus charges your battery for use at night — or flows back to the grid, earning you credits on your utility bill.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M3.75 18h15A2.25 2.25 0 0 0 21 15.75v-6a2.25 2.25 0 0 0-2.25-2.25h-15A2.25 2.25 0 0 0 1.5 9.75v6A2.25 2.25 0 0 0 3.75 18Z" />
      </svg>
    ),
  },
];

const BENEFITS = [
  {
    title: 'Reduce Your Energy Bill',
    description:
      'Most SR Energy customers see average annual savings of $1,400 or more — starting the first month after activation.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    title: 'Increase Your Home Value',
    description:
      'Studies show solar-equipped homes sell for up to 4% more than comparable homes without panels.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12 11.204 3.045c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    title: 'Energy Independence',
    description:
      'Produce your own electricity and reduce reliance on the grid — especially valuable during rate increases or supply disruptions.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    title: '25-Year Panel Warranty',
    description:
      'Every system SR Energy installs comes with an industry-leading 25-year performance warranty on the panels.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
      </svg>
    ),
  },
];

const STATS = [
  { value: '$1,400+', label: 'Average annual savings' },
  { value: '6–8 yrs', label: 'Typical payback period' },
  { value: '+4%', label: 'Home value increase' },
  { value: '25 yrs', label: 'Panel warranty' },
];

const FAQS = [
  {
    q: 'How long does solar installation take?',
    a: 'For most homes, the physical installation is completed in a single day. From your first call to a live system typically takes 2–4 weeks — SR Energy handles all permitting, utility applications, and inspections in that window.',
  },
  {
    q: 'What if my roof needs repairs before installation?',
    a: 'During the free site assessment, our technician evaluates your roof\'s age and condition. If repairs are needed first, we\'ll tell you upfront and can help coordinate the work before scheduling installation.',
  },
  {
    q: 'Does solar still work on cloudy days?',
    a: 'Yes. Solar panels produce electricity from daylight, not direct sunlight. On overcast days, panels typically generate 10–25% of their peak output. Annual production estimates account for your local weather patterns.',
  },
  {
    q: 'Do I need a battery with my solar panels?',
    a: 'No — panels work fine without a battery by feeding excess power back to the grid via net metering. A battery is highly recommended if you want backup power during outages, or if your utility has time-of-use pricing.',
  },
];

// ── Shared sub-components ─────────────────────────────────────────────────────

function StepFlow({ steps }: { steps: typeof STEPS }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="relative">
      {/* Horizontal connector line — desktop only */}
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
            {/* Number circle */}
            <div className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold"
              style={{ background: '#F0A500', color: '#1e2333' }}>
              {i + 1}
            </div>
            {/* Icon */}
            <div className="mb-3 text-[#F0A500]">{step.icon}</div>
            <h3 className="mb-2 text-base font-bold text-white">{step.title}</h3>
            <p className="text-sm leading-relaxed text-gray-400">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function BenefitCard({
  benefit,
  index,
}: {
  benefit: (typeof BENEFITS)[0];
  index: number;
}) {
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

export default function SolarClient() {
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
            Tier 1 Panels · No Credit Check · Permits Included
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Solar Panels
          </h1>
          <p className="mt-5 text-lg text-gray-300 sm:text-xl">
            Clean energy for your home — installed in as little as one day. SR Energy handles everything from assessment to activation.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-lg bg-[#F0A500] px-8 py-3.5 text-base font-semibold text-white shadow hover:bg-[#fbb82a] transition-colors"
            >
              Get a Free Solar Quote
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
            <h2 className="text-3xl font-bold sm:text-4xl">How Solar Works</h2>
            <p className="mt-3 text-gray-400">From sunlight to savings — the physics in plain language.</p>
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
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Why Go Solar</h2>
            <p className="mt-3 text-gray-500">
              Long-term savings, real estate value, and a smaller footprint.
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
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Common Solar Questions
            </h2>
            <p className="mt-3 text-gray-500">Straight answers to what customers ask most.</p>
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
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to go solar?</h2>
          <p className="mt-4 text-lg text-gray-300">
            No credit check. No pressure. A free quote tailored to your home and energy usage.
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

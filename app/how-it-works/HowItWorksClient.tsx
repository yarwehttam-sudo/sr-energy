'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

// ── Step data ───────────────────────────────────────────────────────
const STEPS = [
  {
    number: 1,
    title: 'Get a Free Quote',
    subtitle: 'No credit check. No obligation.',
    description:
      'Call us or fill out our quick online form. We\'ll ask about your home, energy usage, and goals to prepare a custom quote — completely free. No FICO score needed, no hard inquiry on your credit.',
    highlights: ['2-minute form', 'No credit check', 'Same-day response'],
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    number: 2,
    title: 'Site Assessment',
    subtitle: 'We come to you.',
    description:
      'One of our certified technicians visits your home to assess your roof, electrical panel, and energy needs. We\'ll determine the perfect system size and placement for maximum savings. Usually takes about an hour.',
    highlights: ['Certified technicians', 'Roof & panel evaluation', '~1 hour visit'],
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    number: 3,
    title: 'Professional Installation',
    subtitle: 'As little as one day.',
    description:
      'Our licensed team installs your system — solar panels, battery, and EV charger all set up, wired, and tested before we leave. We handle all permits and inspections so you don\'t have to.',
    highlights: ['Licensed installers', 'Permits handled', 'Full system testing'],
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
      </svg>
    ),
  },
  {
    number: 4,
    title: 'Start Saving',
    subtitle: 'Day one.',
    description:
      'Your system goes live and you start saving immediately. Monitor your production and savings anytime through our customer app. Enjoy lower bills, energy independence, and a smaller carbon footprint.',
    highlights: ['Immediate savings', 'Monitoring app', 'Energy independence'],
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      </svg>
    ),
  },
];

const FAQS = [
  {
    q: 'How long does the entire process take?',
    a: 'From your initial quote to a fully installed system, most projects are completed within 2–4 weeks. The actual installation typically takes just one day.',
  },
  {
    q: 'Is there really no credit check?',
    a: 'That\'s right — SR Energy does not run a credit check. We believe clean energy should be accessible to every homeowner, regardless of credit score.',
  },
  {
    q: 'What if my roof needs repairs?',
    a: 'During the site assessment, our technicians will evaluate your roof\'s condition. If repairs are needed before installation, we\'ll let you know upfront and can coordinate the work.',
  },
  {
    q: 'Do you handle permits and inspections?',
    a: 'Yes. SR Energy takes care of all permitting, utility interconnection paperwork, and scheduling inspections. You don\'t need to deal with any of it.',
  },
  {
    q: 'What happens if I move?',
    a: 'Solar panels typically increase your home\'s value. If you sell, the system can transfer to the new homeowner, or we can discuss your options.',
  },
  {
    q: 'Which states do you serve?',
    a: 'SR Energy currently serves homeowners in 30 states across the US. Visit our Locations page to see if your area is covered.',
  },
];

// ── Step card component ─────────────────────────────────────────────
function StepCard({
  step,
  index,
}: {
  step: (typeof STEPS)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className="relative">
      {/* Connector dot on the timeline */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 top-0 hidden md:flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold z-10"
          style={{ background: '#F0A500', color: '#1e2333' }}
        >
          {step.number}
        </div>
      </motion.div>

      <div className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${isEven ? '' : 'md:flex-row-reverse'}`}>
        {/* Content side */}
        <motion.div
          className={`flex-1 ${isEven ? 'md:text-right' : 'md:text-left'}`}
          initial={{ opacity: 0, x: isEven ? -60 : 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Mobile step number */}
          <div className="flex items-center gap-3 mb-3 md:hidden">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: '#F0A500', color: '#1e2333' }}
            >
              {step.number}
            </div>
            <span className="text-xs font-medium uppercase tracking-widest text-gray-400">
              Step {step.number}
            </span>
          </div>

          <h3 className="text-2xl font-bold text-white sm:text-3xl">
            {step.title}
          </h3>
          <p className="mt-1 text-sm font-medium" style={{ color: '#F0A500' }}>
            {step.subtitle}
          </p>
          <p className="mt-4 text-gray-300 leading-relaxed max-w-lg">
            {step.description}
          </p>

          {/* Highlight pills */}
          <div className={`mt-5 flex flex-wrap gap-2 ${isEven ? 'md:justify-end' : ''}`}>
            {step.highlights.map((h) => (
              <motion.span
                key={h}
                className="inline-block rounded-full px-3 py-1 text-xs font-medium"
                style={{ background: 'rgba(240,165,0,0.15)', color: '#F0A500' }}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                {h}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Spacer for timeline */}
        <div className="hidden md:block w-14" />

        {/* Icon/visual side */}
        <motion.div
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, x: isEven ? 60 : -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl flex items-center justify-center"
            style={{
              background: 'rgba(240,165,0,0.1)',
              border: '1px solid rgba(240,165,0,0.2)',
            }}
          >
            <span style={{ color: '#F0A500' }}>{step.icon}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ── FAQ Accordion ───────────────────────────────────────────────────
function FaqItem({ faq, index }: { faq: (typeof FAQS)[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      className="border-b border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left cursor-pointer group"
      >
        <span className="text-base font-medium text-white group-hover:text-[#F0A500] transition-colors pr-4">
          {faq.q}
        </span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-5 h-5 text-gray-400 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-gray-400 leading-relaxed">
          {faq.a}
        </p>
      </motion.div>
    </motion.div>
  );
}

// ── Animated counter ────────────────────────────────────────────────
function AnimatedStat({
  value,
  suffix,
  label,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  if (isInView && count === 0 && value > 0) {
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1200, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(ease * value));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="text-4xl sm:text-5xl font-bold" style={{ color: '#F0A500' }}>
        {isInView ? count : 0}
        {suffix}
      </div>
      <div className="mt-2 text-sm text-gray-400">{label}</div>
    </motion.div>
  );
}

// ── Main page component ─────────────────────────────────────────────
export default function HowItWorksClient() {
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start center', 'end center'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <main className="min-h-screen bg-[#1e2333] text-white -mx-4 sm:-mx-6 lg:-mx-8">
      {/* Hero */}
      <section className="relative px-4 pt-20 pb-16 text-center overflow-hidden">
        <motion.div
          className="mx-auto max-w-3xl relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.span
            className="inline-block rounded-full px-4 py-1.5 text-xs font-medium mb-6"
            style={{ background: 'rgba(240,165,0,0.15)', color: '#F0A500' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Simple. Fast. No Credit Check.
          </motion.span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            How It Works
          </h1>
          <p className="mt-5 text-lg text-gray-300 sm:text-xl max-w-2xl mx-auto">
            Going solar with SR Energy is easy. Four simple steps from free quote to
            energy independence — no credit check, no hassle, no hidden fees.
          </p>

          {/* Scroll indicator */}
          <motion.div
            className="mt-10 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll to explore</span>
            <motion.svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </motion.svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Timeline steps */}
      <section ref={timelineRef} className="relative px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          {/* Animated vertical line (desktop only) */}
          <div className="absolute left-1/2 -translate-x-[1px] top-0 bottom-0 hidden md:block">
            <div className="w-[2px] h-full bg-gray-700/50" />
            <motion.div
              className="absolute top-0 left-0 w-[2px] origin-top"
              style={{ height: lineHeight, background: '#F0A500' }}
            />
          </div>

          <div className="space-y-20 sm:space-y-32">
            {STEPS.map((step, i) => (
              <StepCard key={step.number} step={step} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="px-4 py-16 border-t border-gray-700/50">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <AnimatedStat value={30} suffix="+" label="States served" delay={0} />
            <AnimatedStat value={13} suffix="" label="Years experience" delay={0.1} />
            <AnimatedStat value={0} suffix="" label="Credit checks" delay={0.2} />
            <AnimatedStat value={1} suffix="" label="Day install" delay={0.3} />
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-gray-400">
              Everything you need to know about going solar with SR Energy.
            </p>
          </motion.div>

          <div className="divide-y divide-gray-700">
            {FAQS.map((faq, i) => (
              <FaqItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 py-20 text-center" style={{ background: '#111827' }}>
        <motion.div
          className="mx-auto max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to go solar?
          </h2>
          <p className="mt-4 text-gray-300 text-lg">
            No credit check. No pressure. Just a free, personalized quote for your home.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-lg bg-[#F0A500] px-8 py-3.5 text-base font-semibold text-white shadow hover:bg-[#fbb82a] transition-colors"
            >
              Get Your Free Quote
            </Link>
            <Link
              href="/locations"
              className="rounded-lg border border-gray-500 px-8 py-3.5 text-base font-semibold text-gray-200 hover:border-gray-300 hover:text-white transition-colors"
            >
              View Locations
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

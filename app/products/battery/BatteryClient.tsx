'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// ── Data ──────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    title: 'Charges from Solar or Grid',
    description:
      'Your battery fills up during off-peak rate hours or whenever your solar panels produce more power than your home is using.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M3.75 18h15A2.25 2.25 0 0 0 21 15.75v-6a2.25 2.25 0 0 0-2.25-2.25h-15A2.25 2.25 0 0 0 1.5 9.75v6A2.25 2.25 0 0 0 3.75 18Z" />
      </svg>
    ),
  },
  {
    title: 'Monitors Grid in Real Time',
    description:
      'The battery\'s smart controller continuously watches grid voltage and frequency — day and night, automatically.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
  },
  {
    title: 'Switches Over in Milliseconds',
    description:
      'When the grid goes down, your battery automatically activates in under 50 ms — fast enough that most devices never notice the interruption.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    ),
  },
  {
    title: 'Recharges When Grid Returns',
    description:
      'Once utility power is restored, your battery seamlessly reconnects and begins recharging — no switches to flip, nothing to configure.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
  },
];

const BENEFITS = [
  {
    title: 'Whole-Home Backup Power',
    description:
      'Keep your refrigerator, lights, Wi-Fi, and essential medical equipment running during grid outages — for hours or days.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    title: 'Peak Rate Savings',
    description:
      'Discharge stored energy during your utility\'s most expensive hours and recharge at off-peak rates — reducing your bill without changing your habits.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    title: 'Works Without Solar',
    description:
      'A home battery doesn\'t require solar panels. It charges directly from the grid on a schedule you control.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
      </svg>
    ),
  },
  {
    title: 'Charge Your EV Too',
    description:
      'A home battery can power your electric vehicle overnight using stored solar energy — reducing your charging costs and keeping you moving even during outages.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
];

const STATS = [
  { value: '10–13 kWh', label: 'Typical battery capacity' },
  { value: '<50 ms', label: 'Outage switchover time' },
  { value: '10 yrs', label: 'Standard warranty' },
  { value: '$0', label: 'TX VPP eligible installs' },
];

const FAQS = [
  {
    q: 'What appliances can a home battery power during an outage?',
    a: 'A standard 10 kWh battery can run a full-size refrigerator for 24+ hours, keep lights on throughout the home, power Wi-Fi and devices, and support a CPAP or other essential medical equipment. Running central AC or electric heat will reduce runtime significantly.',
  },
  {
    q: 'How long will the battery last during an outage?',
    a: 'Duration depends on how much you use. With conservative use (lights, fridge, devices), most homeowners get 12–24 hours from a single battery. Multiple batteries can extend that to days. Your SR Energy advisor can model your specific home.',
  },
  {
    q: 'Can I get a battery without having solar panels?',
    a: 'Yes. A home battery operates independently of solar. It charges from the grid during off-peak hours and discharges when rates are high or the grid goes down. Many customers start with battery-only and add solar later.',
  },
  {
    q: 'What is the Texas VPP program?',
    a: 'The Texas Virtual Power Plant (VPP) program provides eligible homeowners with a professionally installed home battery at no cost. SR Energy enrolls your battery in a voluntary grid-support network, and you keep backup power priority. After 20 years, the battery is yours permanently. No credit check required.',
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

export default function BatteryClient() {
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
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Home Battery Storage
          </h1>
          <p className="mt-5 text-lg text-gray-300 sm:text-xl">
            Keep the lights on when the grid goes out. SR Energy installs home batteries that
            charge automatically and switch over in milliseconds — no credit check required.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-lg bg-[#F0A500] px-8 py-3.5 text-base font-semibold text-white shadow hover:bg-[#fbb82a] transition-colors"
            >
              Get a Free Battery Quote
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
            <h2 className="text-3xl font-bold sm:text-4xl">How Home Battery Works</h2>
            <p className="mt-3 text-gray-400">
              Fully automatic — charges, monitors, and activates without any action from you.
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
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Why Add a Battery</h2>
            <p className="mt-3 text-gray-500">
              Protection, savings, and peace of mind in one system.
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
              Battery Storage FAQ
            </h2>
            <p className="mt-3 text-gray-500">What homeowners ask before adding a battery.</p>
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
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to add backup power?</h2>
          <p className="mt-4 text-lg text-gray-300">
            No credit check. No pressure. Texas homeowners may qualify for a free battery.
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

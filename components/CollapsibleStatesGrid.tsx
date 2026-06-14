'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface StateItem {
  abbr: string;
  name: string;
  slug: string;
  isVppEligible: boolean;
}

export default function CollapsibleStatesGrid({ states }: { states: StateItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="px-4 pb-12 pt-4">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-center gap-3 group cursor-pointer"
        >
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Browse All States
          </h2>
          <motion.svg
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="h-5 w-5 text-gray-500 group-hover:text-[#F0A500] transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </motion.svg>
        </button>
        <p className="mt-2 mb-4 text-center text-gray-600 text-sm">
          Click to browse all 30 states we serve
        </p>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 pt-4">
                {states.map((state) => (
                  <li key={state.abbr}>
                    <Link
                      href={`/locations/${state.slug}/`}
                      className="group relative flex flex-col items-start rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm transition-all hover:border-[#F0A500]/30 hover:shadow-md"
                    >
                      <span
                        className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-bold ${
                          state.isVppEligible
                            ? 'bg-[#d4920a] text-white'
                            : 'bg-gray-100 text-gray-700 group-hover:bg-[#F0A500]/10 group-hover:text-[#F0A500]'
                        }`}
                      >
                        {state.abbr}
                      </span>
                      <span className="text-sm font-semibold text-gray-900 leading-tight">
                        {state.name}
                      </span>
                      {state.isVppEligible && (
                        <span className="mt-1.5 inline-block rounded-full bg-[#F0A500]/10 px-2 py-0.5 text-xs font-medium text-[#F0A500]">
                          VPP Eligible
                        </span>
                      )}
                      <span className="mt-2 text-xs text-[#F0A500] group-hover:underline">
                        ☀️ Solar in {state.name} — See Local Incentives →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden crawlable links for SEO — always in DOM even when collapsed */}
        {!open && (
          <nav aria-label="All service states" className="sr-only">
            <ul>
              {states.map((state) => (
                <li key={state.abbr}>
                  <Link href={`/locations/${state.slug}/`}>☀️ Solar in {state.name} — See Local Incentives →</Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </section>
  );
}

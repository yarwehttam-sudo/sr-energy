'use client';

import { useState } from 'react';
import Link from 'next/link';

const STATE_RATES: Record<string, { rate: number; avgBill: number }> = {
  "Alabama": { rate: 16.06, avgBill: 183.57 },
  "Alaska": { rate: 25.52, avgBill: 147.51 },
  "Arizona": { rate: 15.61, avgBill: 167.81 },
  "Arkansas": { rate: 12.35, avgBill: 129.43 },
  "California": { rate: 30.29, avgBill: 152.36 },
  "Colorado": { rate: 16.44, avgBill: 110.81 },
  "Connecticut": { rate: 28.30, avgBill: 196.69 },
  "Delaware": { rate: 16.51, avgBill: 150.41 },
  "Florida": { rate: 15.92, avgBill: 175.76 },
  "Georgia": { rate: 14.46, avgBill: 155.30 },
  "Hawaii": { rate: 39.79, avgBill: 196.96 },
  "Idaho": { rate: 12.07, avgBill: 113.94 },
  "Illinois": { rate: 16.36, avgBill: 113.37 },
  "Indiana": { rate: 16.19, avgBill: 145.87 },
  "Iowa": { rate: 12.83, avgBill: 106.75 },
  "Kansas": { rate: 14.29, avgBill: 125.18 },
  "Kentucky": { rate: 14.27, avgBill: 149.41 },
  "Louisiana": { rate: 12.46, avgBill: 149.77 },
  "Maine": { rate: 30.73, avgBill: 169.02 },
  "Maryland": { rate: 20.61, avgBill: 191.47 },
  "Massachusetts": { rate: 31.16, avgBill: 177.61 },
  "Michigan": { rate: 19.52, avgBill: 120.63 },
  "Minnesota": { rate: 14.98, avgBill: 106.66 },
  "Mississippi": { rate: 14.24, avgBill: 164.61 },
  "Missouri": { rate: 11.80, avgBill: 118.12 },
  "Montana": { rate: 12.86, avgBill: 109.57 },
  "Nebraska": { rate: 11.76, avgBill: 112.43 },
  "Nevada": { rate: 13.98, avgBill: 130.01 },
  "New Hampshire": { rate: 26.32, avgBill: 162.92 },
  "New Jersey": { rate: 23.13, avgBill: 153.12 },
  "New Mexico": { rate: 14.70, avgBill: 96.14 },
  "New York": { rate: 28.37, avgBill: 161.99 },
  "North Carolina": { rate: 13.68, avgBill: 138.85 },
  "North Dakota": { rate: 10.92, avgBill: 112.37 },
  "Ohio": { rate: 17.59, avgBill: 148.81 },
  "Oklahoma": { rate: 12.62, avgBill: 136.17 },
  "Oregon": { rate: 14.66, avgBill: 129.30 },
  "Pennsylvania": { rate: 20.19, avgBill: 164.95 },
  "Rhode Island": { rate: 30.14, avgBill: 170.89 },
  "South Carolina": { rate: 15.41, avgBill: 161.81 },
  "South Dakota": { rate: 13.60, avgBill: 135.18 },
  "Tennessee": { rate: 13.10, avgBill: 151.17 },
  "Texas": { rate: 15.36, avgBill: 168.35 },
  "Utah": { rate: 12.88, avgBill: 99.69 },
  "Vermont": { rate: 23.29, avgBill: 133.68 },
  "Virginia": { rate: 15.87, avgBill: 163.78 },
  "Washington": { rate: 13.81, avgBill: 131.89 },
  "West Virginia": { rate: 14.77, avgBill: 151.69 },
  "Wisconsin": { rate: 18.20, avgBill: 117.39 },
  "Wyoming": { rate: 12.85, avgBill: 110.90 },
  "District of Columbia": { rate: 17.71, avgBill: 113.23 },
};

const EV_COST = 110;

export default function SavingsCalculator() {
  const [selectedState, setSelectedState] = useState('');
  const [baseBill, setBaseBill] = useState(150);
  const [withBattery, setWithBattery] = useState(false);
  const [withEv, setWithEv] = useState(false);

  const fmt = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  function handleStateChange(state: string) {
    setSelectedState(state);
    if (state && STATE_RATES[state]) {
      setBaseBill(Math.round(STATE_RATES[state].avgBill));
    }
  }

  // Effective bill includes EV charging cost
  const monthlyBill = baseBill + (withEv ? EV_COST : 0);

  // Solar reduces bill to 15% remaining; battery drops it further to 5%
  const residualFraction = withBattery ? 0.05 : 0.15;
  const withSolar = Math.round(monthlyBill * residualFraction);
  const annualSavings = (monthlyBill - withSolar) * 12;
  const savings25yr = annualSavings * 25;

  // System cost for payback
  const systemCost = 25000 + (withBattery ? 5000 : 0) + (withEv ? 3000 : 0);
  const paybackYears = (systemCost / annualSavings).toFixed(1);

  // CTA label
  let ctaLabel = 'Get My Solar Quote →';
  if (withBattery && withEv) ctaLabel = 'Get My Complete Energy Package Quote →';
  else if (withBattery) ctaLabel = 'Get My Solar + Battery Quote →';
  else if (withEv) ctaLabel = 'Get My Solar + EV Quote →';

  const toggleBtn = (active: boolean) =>
    active
      ? 'bg-[#F0A500] text-[#1e2333] font-bold rounded-xl px-4 py-3 text-sm transition-colors'
      : 'bg-[#111827] text-gray-400 border border-[#F0A500]/30 rounded-xl px-4 py-3 text-sm transition-colors hover:border-[#F0A500]/60';

  const tableRows = [
    { label: 'Monthly Bill',    without: fmt(monthlyBill),       withPkg: fmt(withSolar),       highlight: false },
    { label: 'Annual Cost',     without: fmt(monthlyBill * 12),  withPkg: fmt(withSolar * 12),  highlight: false },
    { label: '25-Year Cost',    without: fmt(monthlyBill*12*25), withPkg: fmt(withSolar*12*25), highlight: false },
    { label: 'You Save (25yr)', without: '—',                    withPkg: fmt(savings25yr),     highlight: true  },
  ];

  return (
    <section className="px-4 py-14">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-2 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          How Much Could You Save?
        </h2>
        <p className="mb-8 text-center text-sm text-gray-500">
          Try our home energy savings calculator. Select your state, choose your products, and drag the slider to see your personalized savings.
        </p>

        <div className="rounded-2xl bg-[#1e2333] px-6 py-8 shadow-xl sm:px-10 sm:py-10">

          {/* ── Section 1: State selector ── */}
          <div className="mb-6">
            <label htmlFor="state-select" className="mb-2 block text-sm font-medium text-gray-300">
              Select Your State
            </label>
            <select
              id="state-select"
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full rounded-lg border border-[#F0A500]/30 bg-[#111827] px-4 py-2 text-white focus:border-[#F0A500] focus:outline-none"
            >
              <option value="">— Choose a state —</option>
              {Object.keys(STATE_RATES).sort().map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {selectedState && (
              <p className="mt-2 text-xs text-gray-400">
                Average monthly bill for {selectedState}: ${STATE_RATES[selectedState].avgBill.toFixed(0)}
              </p>
            )}
          </div>

          {/* ── Section 2: Product toggles ── */}
          <div className="mb-6">
            <p className="mb-3 text-sm font-medium text-gray-300">Build Your Package</p>
            <div className="grid grid-cols-3 gap-2">
              {/* Solar — always on */}
              <button
                type="button"
                disabled
                className={toggleBtn(true)}
                aria-pressed="true"
              >
                ☀️ Solar Panels
              </button>

              {/* Battery toggle */}
              <button
                type="button"
                onClick={() => setWithBattery((v) => !v)}
                className={toggleBtn(withBattery)}
                aria-pressed={withBattery}
              >
                🔋 Add Battery
              </button>

              {/* EV toggle */}
              <button
                type="button"
                onClick={() => setWithEv((v) => !v)}
                className={toggleBtn(withEv)}
                aria-pressed={withEv}
              >
                ⚡ Add EV Charger
              </button>
            </div>
          </div>

          {/* ── Section 3: Education callouts ── */}
          {withBattery && (
            <div className="mb-4 rounded-xl border border-[#F0A500]/30 bg-[#111827] p-4">
              <p className="mb-1 font-semibold text-white text-sm">🔋 How a Home Battery Works</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Solar panels only produce power when the sun shines. Without a battery you still buy
                electricity from the grid at night. A home battery stores excess solar energy and uses
                it at night — reducing your grid dependence by an additional 15–20%. During outages
                your home stays powered.
              </p>
            </div>
          )}
          {withEv && (
            <div className="mb-4 rounded-xl border border-[#F0A500]/30 bg-[#111827] p-4">
              <p className="mb-1 font-semibold text-white text-sm">⚡ How EV Charging Affects Your Bill</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Adding a Level 2 EV charger typically adds $80–$150/month to your electric bill and
                can push you into a higher utility rate tier — making ALL your electricity more
                expensive. With solar your car essentially runs on sunlight.
              </p>
            </div>
          )}

          {/* ── Section 4: Slider ── */}
          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <label htmlFor="bill-slider" className="text-sm font-medium text-gray-300">
                Monthly Electric Bill
              </label>
              <span className="rounded-lg bg-[#F0A500]/20 px-3 py-1 text-lg font-bold text-[#F0A500]">
                ${monthlyBill}
              </span>
            </div>
            <input
              id="bill-slider"
              type="range"
              min={50}
              max={600}
              step={5}
              value={baseBill}
              onChange={(e) => setBaseBill(Number(e.target.value))}
              className="w-full cursor-pointer accent-[#F0A500]"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>$50</span>
              <span>$600</span>
            </div>
            {withEv && (
              <p className="mt-2 text-xs text-[#F0A500]/80">
                + ${EV_COST} EV charging cost added
              </p>
            )}
          </div>

          {/* ── Section 5: Before / after comparison table ── */}
          <div className="overflow-hidden rounded-xl border border-[#F0A500]/20">
            {/* Header */}
            <div className="grid grid-cols-3 bg-[#1e2333] px-4 py-2.5 text-xs font-medium text-gray-400">
              <span></span>
              <span className="text-center">Without Solar</span>
              <span className="text-center text-[#F0A500]">With Your Package</span>
            </div>

            {/* Rows */}
            {tableRows.map(({ label, without, withPkg, highlight }, i) => (
              <div
                key={label}
                className={`grid grid-cols-3 px-4 py-3 text-sm ${
                  i % 2 === 0 ? 'bg-[#111827]' : 'bg-[#1e2333]'
                }`}
              >
                <span className={highlight ? 'font-bold text-[#F0A500]' : 'text-gray-400'}>
                  {label}
                </span>
                <span className={`text-center ${highlight ? 'text-gray-500' : 'text-gray-300'}`}>
                  {without}
                </span>
                <span className={`text-center font-bold ${highlight ? 'text-[#F0A500] text-lg' : 'text-white'}`}>
                  {withPkg}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Estimated payback period:{' '}
            <span className="text-gray-400">{paybackYears} years</span>
          </p>

          <p className="mt-1 text-xs text-[#F0A500]/80">
            *Most homeowners reduce payback to 6–9 years after the 30% federal solar tax credit and local incentives.
          </p>

          <p className="mt-1 text-xs text-gray-600">
            Estimates based on {withBattery ? '95%' : '85%'} bill offset. Actual savings vary by location, usage, and system size.
          </p>

          {/* ── Section 6: Smart CTA ── */}
          <Link
            href="/contact/"
            className="mt-4 block w-full rounded-lg bg-[#F0A500] py-3 text-center text-base font-bold text-[#1e2333] shadow hover:bg-[#fbb82a] transition-colors"
          >
            {ctaLabel}
          </Link>

        </div>
      </div>
    </section>
  );
}

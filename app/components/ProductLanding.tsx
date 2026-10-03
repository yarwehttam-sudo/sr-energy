import Link from 'next/link';
import { Suspense } from 'react';
import LeadCaptureForm from './LeadCaptureForm';
import type { ProductIntent } from '@/lib/acquisition';

const content: Record<ProductIntent, { eyebrow: string; title: string; intro: string; questions: string[]; steps: string[] }> = {
  solar: {
    eyebrow: 'Solar', title: 'Explore whether rooftop solar fits your home',
    intro: 'A property review can consider roof condition, shade, electricity use, utility rules, and your goals before any recommendation is made.',
    questions: ['Roof age, orientation, and usable area', 'Recent electricity use and rate plan', 'Local permitting and utility interconnection', 'Purchase and financing terms available for the property'],
    steps: ['Share your ZIP code and solar interest', 'A specialist reviews service availability', 'If available, discuss a property-specific assessment and written options'],
  },
  battery: {
    eyebrow: 'Battery and backup power', title: 'Plan backup power around the loads that matter',
    intro: 'Battery capacity, runtime, operating mode, and solar compatibility vary by home. Start with the circuits you want to support and how you expect to use stored energy.',
    questions: ['Essential circuits and desired backup duration', 'Electrical panel and installation location', 'Existing or planned solar equipment', 'Utility programs and equipment terms, if documented'],
    steps: ['Share your ZIP code and backup priorities', 'A specialist checks service and property requirements', 'If available, review system options and written terms'],
  },
  'ev-charging': {
    eyebrow: 'EV charging', title: 'Prepare your home for convenient EV charging',
    intro: 'The right home charging setup depends on your vehicle, daily mileage, parking location, panel capacity, and utility rate plan.',
    questions: ['Vehicle and charging connector', 'Parking distance from the electrical panel', 'Panel capacity and available circuit space', 'Charging schedule and utility rate plan'],
    steps: ['Share your ZIP code and EV charging interest', 'A specialist checks service availability and basic requirements', 'If available, arrange an electrical assessment and written scope'],
  },
};

export default function ProductLanding({ intent }: { intent: ProductIntent }) {
  const item = content[intent];
  return <main className="-mx-4 min-h-screen bg-white text-gray-900 sm:-mx-6 lg:-mx-8">
    <nav aria-label="Breadcrumb" className="bg-[#111827] px-4 py-3 text-xs text-gray-300"><ol className="mx-auto flex max-w-5xl gap-2"><li><Link href="/">Home</Link></li><li aria-hidden>›</li><li aria-current="page">{item.eyebrow}</li></ol></nav>
    <section className="bg-[#1e2333] px-4 py-16 text-white"><div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-center"><div><p className="text-sm font-semibold uppercase tracking-widest text-[#F0A500]">{item.eyebrow}</p><h1 className="mt-3 text-4xl font-bold sm:text-5xl">{item.title}</h1><p className="mt-5 text-lg leading-relaxed text-gray-300">{item.intro}</p><p className="mt-4 text-sm text-gray-400">Submitting a request does not determine eligibility, approval, price, savings, or program participation.</p></div><Suspense fallback={<div className="rounded-xl bg-white p-8 text-gray-700">Loading form…</div>}><LeadCaptureForm defaultIntent={intent} /></Suspense></div></section>
    <section className="px-4 py-14"><div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2"><div><h2 className="text-2xl font-bold">What a useful review considers</h2><ul className="mt-5 space-y-3">{item.questions.map((question) => <li key={question} className="rounded-lg border border-gray-200 p-4">{question}</li>)}</ul></div><div><h2 className="text-2xl font-bold">What happens next</h2><ol className="mt-5 space-y-3">{item.steps.map((step, index) => <li key={step} className="flex gap-3 rounded-lg bg-gray-50 p-4"><span className="font-bold text-[#b77900]">{index + 1}</span><span>{step}</span></li>)}</ol></div></div></section>
    <section className="bg-gray-50 px-4 py-12 text-center"><h2 className="text-2xl font-bold">Compare other home energy paths</h2><div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/products/solar" className="rounded-lg border bg-white px-5 py-3">Solar</Link><Link href="/products/battery" className="rounded-lg border bg-white px-5 py-3">Battery</Link><Link href="/products/ev-charger" className="rounded-lg border bg-white px-5 py-3">EV charging</Link></div></section>
  </main>;
}

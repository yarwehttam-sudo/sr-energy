'use client';

import { useState } from 'react';
import { BUSINESS_INFO } from '@/lib/businessInfo';

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York','North Carolina',
  'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
  'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
  'District of Columbia',
];

const PRODUCT_OPTIONS = ['Solar Panels', 'Home Battery', 'EV Charger'] as const;

const inputClass =
  'w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#F0A500] focus:outline-none focus:ring-2 focus:ring-[#F0A500]/20';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [monthlyBill, setMonthlyBill] = useState('');
  const [productInterest, setProductInterest] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function toggleProduct(product: string) {
    setProductInterest((prev) =>
      prev.includes(product) ? prev.filter((p) => p !== product) : [...prev, product],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          message,
          state,
          monthlyBill: monthlyBill ? Number(monthlyBill) : undefined,
          productInterest,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Submission failed.');
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-10 shadow-sm text-center">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#F0A500]/10 text-[#F0A500]">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Quote Request Received!</h3>
        <p className="mt-2 text-sm text-gray-600">
          A real person from our team will call you within the hour. No credit check. No pressure.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">

      {/* Privacy assurance */}
      <p className="mb-5 text-xs font-medium text-gray-500">
        🔒 Your info is private. We never pull your credit score &mdash; ever.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Name + Phone */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-gray-700">
              Full Name <span className="text-[#F0A500]">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-gray-700">
              Phone Number <span className="text-[#F0A500]">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 000-0000"
              className={inputClass}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-gray-700">
            Email Address <span className="text-[#F0A500]">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            className={inputClass}
          />
        </div>

        {/* State + Monthly Bill */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="state" className="mb-1.5 block text-sm font-semibold text-gray-700">
              State
            </label>
            <select
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-[#F0A500] focus:outline-none focus:ring-2 focus:ring-[#F0A500]/20"
            >
              <option value="">— Select a state —</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="monthlyBill" className="mb-1.5 block text-sm font-semibold text-gray-700">
              Monthly Electric Bill
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">$</span>
              <input
                id="monthlyBill"
                type="number"
                min="0"
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(e.target.value)}
                placeholder="150"
                className="w-full rounded-lg border border-gray-200 pl-7 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#F0A500] focus:outline-none focus:ring-2 focus:ring-[#F0A500]/20"
              />
            </div>
          </div>
        </div>

        {/* Product Interest */}
        <div>
          <p className="mb-2 text-sm font-semibold text-gray-700">Product Interest</p>
          <div className="flex flex-wrap gap-3">
            {PRODUCT_OPTIONS.map((product) => {
              const checked = productInterest.includes(product);
              return (
                <label
                  key={product}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    checked
                      ? 'border-[#F0A500] bg-[#F0A500]/10 text-[#F0A500]'
                      : 'border-gray-200 text-gray-600 hover:border-[#F0A500]/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggleProduct(product)}
                  />
                  {product}
                </label>
              );
            })}
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Optional — anything you&apos;d like us to know before we call?"
            className="w-full resize-y rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#F0A500] focus:outline-none focus:ring-2 focus:ring-[#F0A500]/20"
          />
        </div>

        {/* Consent — single collapsed checkbox */}
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
          <label className="flex cursor-pointer items-start gap-2.5 leading-relaxed">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 accent-[#F0A500]"
            />
            <span className="text-xs text-gray-500">
              By submitting, I agree to receive calls and SMS from SR Energy about my quote request.
              Reply <strong>STOP</strong> to opt out.{' '}
              <a href="/privacy-policy" className="text-[#F0A500] hover:underline font-medium">
                Privacy Policy
              </a>
              {' '}|{' '}
              <a href="/terms-of-service" className="text-[#F0A500] hover:underline font-medium">
                Terms of Service
              </a>
            </span>
          </label>
        </div>

        {/* Error message */}
        {status === 'error' && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Trust strip */}
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-gray-500">
          <span>✅ No Credit Check</span>
          <span>✅ Response Within the Hour</span>
          <span>✅ No Obligation, Ever</span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full rounded-lg bg-[#F0A500] px-7 py-3 text-base font-semibold text-white shadow hover:bg-[#fbb82a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? 'Sending…' : 'Get My Free Quote — No Credit Check →'}
        </button>

      </form>
    </div>
  );
}

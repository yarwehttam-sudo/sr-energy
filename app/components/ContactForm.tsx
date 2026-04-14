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
  const [smsConsent, setSmsConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

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
        <h3 className="text-xl font-bold text-gray-900">Message Received!</h3>
        <p className="mt-2 text-sm text-gray-600">
          Thank you! We will contact you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
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
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
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
            Message <span className="text-[#F0A500]">*</span>
          </label>
          <textarea
            id="message"
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us about your home or any questions you have…"
            className="w-full resize-y rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#F0A500] focus:outline-none focus:ring-2 focus:ring-[#F0A500]/20"
          />
        </div>

        {/* SMS Consent */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <label className="flex cursor-pointer items-start gap-3 text-xs text-gray-600 leading-relaxed">
            <input
              type="checkbox"
              required
              checked={smsConsent}
              onChange={(e) => setSmsConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[#F0A500]"
            />
            <span>
              I consent to receive SMS notifications and alerts from SR Energy. Message frequency
              varies. Message and data rates may apply. Reply <strong>STOP</strong> to unsubscribe
              or <strong>HELP</strong> for assistance. You can also call{' '}
              <a href={BUSINESS_INFO.phoneTel} className="text-[#F0A500] hover:underline font-medium">
                {BUSINESS_INFO.phone}
              </a>
              .{' '}
              <a href="/privacy-policy" className="text-[#F0A500] hover:underline font-medium">
                Privacy Policy
              </a>{' '}
              &amp;{' '}
              <a href="/terms-of-service" className="text-[#F0A500] hover:underline font-medium">
                Terms of Service
              </a>
              .
            </span>
          </label>
        </div>

        {/* Marketing consent */}
        <div>
          <label className="flex cursor-pointer items-start gap-3 text-xs text-gray-500 leading-relaxed">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[#F0A500]"
            />
            <span>I agree to receive occasional marketing messages from SR Energy.</span>
          </label>
        </div>

        {/* Error message */}
        {status === 'error' && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full rounded-lg bg-[#F0A500] px-7 py-3 text-base font-semibold text-white shadow hover:bg-[#fbb82a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? 'Sending…' : 'Send Message'}
        </button>

        <p className="text-center text-xs text-gray-400">
          By submitting you agree to our{' '}
          <a href="/privacy-policy" className="text-[#F0A500] hover:underline">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="/terms-of-service" className="text-[#F0A500] hover:underline">
            Terms of Service
          </a>
          .
        </p>
      </form>
    </div>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ATTRIBUTION_KEYS, type AttributionFields, type LeadAttribution, type ProductIntent } from '@/lib/acquisition';
import { SERVICE_TERRITORIES } from '@/lib/serviceTerritories';

const STORAGE_KEY = 'sr-energy-first-touch-v1';
const labels: Record<ProductIntent, string> = {
  solar: 'Solar',
  battery: 'Battery / backup power',
  'ev-charging': 'EV charging',
};

function currentTouch(search: URLSearchParams): AttributionFields {
  const touch: AttributionFields = {
    landing_page: `${window.location.pathname}${window.location.search}`.slice(0, 500),
    referrer: document.referrer.slice(0, 500),
    captured_at: new Date().toISOString(),
  };
  for (const key of ATTRIBUTION_KEYS) {
    const value = search.get(key);
    if (value) touch[key] = value.slice(0, 500);
  }
  return touch;
}

export default function LeadCaptureForm({ defaultIntent }: { defaultIntent?: ProductIntent }) {
  const searchParams = useSearchParams();
  const queryIntent = searchParams.get('intent') as ProductIntent | null;
  const initialIntent = queryIntent && queryIntent in labels ? queryIntent : defaultIntent ?? 'solar';
  const [productIntent, setProductIntent] = useState<ProductIntent>(initialIntent);
  const [market, setMarket] = useState(searchParams.get('state') ?? '');
  const [attribution, setAttribution] = useState<LeadAttribution | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const search = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);

  useEffect(() => {
    const latest = currentTouch(search);
    let first = latest;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) first = JSON.parse(stored) as AttributionFields;
      else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(first));
    } catch {
      // Attribution still works for this request when storage is unavailable.
    }
    setAttribution({ first_touch: first, latest_touch: latest });
  }, [search]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setError('');
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      phone: String(form.get('phone') ?? ''),
      zip: String(form.get('zip') ?? ''),
      market,
      product_intent: productIntent,
      homeowner: form.get('homeowner') === 'yes',
      consent: form.get('consent') === 'on',
      attribution,
      website: String(form.get('website') ?? ''),
    };
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Unable to submit your request.');
      setStatus('success');
    } catch (caught) {
      setStatus('error');
      setError(caught instanceof Error ? caught.message : 'Unable to submit your request.');
    }
  }

  if (status === 'success') {
    return <div role="status" className="rounded-xl bg-white p-8 text-center text-gray-900"><h2 className="text-xl font-bold">Request received</h2><p className="mt-2 text-sm text-gray-600">We will review your address and product interest, then contact you about possible next steps.</p></div>;
  }

  const field = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-[#F0A500] focus:outline-none focus:ring-2 focus:ring-[#F0A500]/30';
  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl bg-white p-5 text-left text-gray-900 shadow-lg sm:p-7" aria-label="Home energy request">
      <div className="sr-only" aria-hidden="true"><label htmlFor="website">Leave this field blank</label><input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" /></div>
      <div>
        <label htmlFor="product_intent" className="mb-1 block text-sm font-semibold">What are you exploring?</label>
        <select id="product_intent" name="product_intent" value={productIntent} onChange={(event) => setProductIntent(event.target.value as ProductIntent)} className={field} required>
          {Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label htmlFor="zip" className="mb-1 block text-sm font-semibold">ZIP code</label><input id="zip" name="zip" inputMode="numeric" autoComplete="postal-code" pattern="[0-9]{5}" maxLength={5} className={field} required /></div>
        <div><label htmlFor="market" className="mb-1 block text-sm font-semibold">State or district</label><select id="market" name="market" value={market} onChange={(event) => setMarket(event.target.value)} className={field} required><option value="">Select</option>{SERVICE_TERRITORIES.map((territory) => <option key={territory.code} value={territory.code}>{territory.name}</option>)}</select></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label htmlFor="name" className="mb-1 block text-sm font-semibold">Name</label><input id="name" name="name" autoComplete="name" maxLength={100} className={field} required /></div>
        <div><label htmlFor="phone" className="mb-1 block text-sm font-semibold">Phone</label><input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={30} className={field} required /></div>
      </div>
      <div><label htmlFor="email" className="mb-1 block text-sm font-semibold">Email</label><input id="email" name="email" type="email" autoComplete="email" maxLength={254} className={field} required /></div>
      <fieldset><legend className="mb-1 text-sm font-semibold">Do you own the property?</legend><label className="mr-5 text-sm"><input type="radio" name="homeowner" value="yes" className="mr-2" required />Yes</label><label className="text-sm"><input type="radio" name="homeowner" value="no" className="mr-2" required />No</label></fieldset>
      <label className="flex items-start gap-2 text-xs text-gray-600"><input type="checkbox" name="consent" className="mt-0.5" required /><span>I agree that SR Energy may call, email, or text me about this request. Consent is not a condition of purchase. Message and data rates may apply; reply STOP to opt out. See the <a href="/privacy-policy" className="underline">Privacy Policy</a> and <a href="/terms-of-service" className="underline">Terms</a>.</span></label>
      {status === 'error' && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={status === 'submitting' || !attribution} className="w-full rounded-lg bg-[#F0A500] px-5 py-3 font-semibold text-[#1e2333] disabled:opacity-60">{status === 'submitting' ? 'Sending…' : 'Request a home energy review'}</button>
      <p className="text-xs text-gray-500">Availability, pricing, equipment, financing, incentives, timelines, and savings depend on the property, utility, program terms, and review.</p>
    </form>
  );
}

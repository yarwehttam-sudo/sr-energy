import Link from 'next/link';
import { BUSINESS_INFO } from '@/lib/businessInfo';

export default function Footer() {
  return (
    <footer className="bg-[#1e2333] text-gray-400">

      {/* Main grid */}
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">

          {/* Company column */}
          <div>
            {/* Logo mark */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px', marginBottom: '12px' }}>
              <div style={{
                border: '2px solid #F0A500',
                padding: '4px 10px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{
                  color: '#F0A500',
                  fontSize: '26px',
                  fontWeight: '700',
                  letterSpacing: '3px',
                  lineHeight: 1,
                  fontFamily: 'Georgia, serif',
                }}>SR</span>
              </div>
              <span style={{
                color: '#F0A500',
                fontSize: '9px',
                fontWeight: '400',
                letterSpacing: '6px',
                fontFamily: 'Georgia, serif',
              }}>ENERGY</span>
            </div>

            <p className="text-sm leading-relaxed">
              Solar panels, home batteries &amp; EV chargers — no credit check required.
            </p>

            <div className="mt-4 space-y-1.5 text-sm">
              <a
                href={BUSINESS_INFO.phoneTel}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <svg className="h-4 w-4 shrink-0 text-[#F0A500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                {BUSINESS_INFO.phone}
              </a>
              <a
                href={BUSINESS_INFO.emailHref}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <svg className="h-4 w-4 shrink-0 text-[#F0A500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                {BUSINESS_INFO.email}
              </a>
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/locations', label: 'Locations' },
                { href: '/how-it-works', label: 'How It Works' },
                { href: '/contact', label: 'Get a Free Quote' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/privacy-policy', label: 'Privacy Policy' },
                { href: '/terms-of-service', label: 'Terms of Service' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs leading-relaxed">
              SR Energy does not require a credit check. Savings estimates are projections only and
              are not guaranteed.
            </p>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700/60">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-xs text-gray-600">
          <p>© {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved.</p>
          <p>Serving homeowners across 30 states — no credit check required.</p>
        </div>
      </div>

    </footer>
  );
}

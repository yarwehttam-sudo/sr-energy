import type { Metadata } from 'next';
import Link from 'next/link';
import { BUSINESS_INFO } from '@/lib/businessInfo';

export const metadata: Metadata = {
  title: 'Terms of Service | SR Energy',
  description:
    'SR Energy terms of service — website use, quote request terms, SMS communications, savings estimate disclaimers, and governing law.',
  alternates: { canonical: 'https://srenergy.com/terms-of-service/' },
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* Hero */}
      <section className="bg-[#1e2333] px-4 py-14 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">Terms of Service</h1>
          <p className="mt-3 text-gray-400 text-sm">Last updated: April 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-3xl space-y-10 text-base leading-relaxed text-gray-700">

          <div>
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your use of the SR Energy website
              located at <strong>srenergy.com</strong> and any quote request, contact, or
              communication services we provide (collectively, the &quot;Services&quot;). By
              accessing our website or submitting a quote request, you agree to be bound by these
              Terms. If you do not agree, please do not use our Services.
            </p>
          </div>

          {/* Section 1 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Use of the Website</h2>
            <p className="mb-3">
              You may use the SR Energy website for lawful purposes only. You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Submit false, misleading, or fraudulent information through any form or contact
                channel.
              </li>
              <li>
                Use automated tools, bots, or scrapers to access or extract content from our website
                without prior written consent.
              </li>
              <li>
                Attempt to interfere with, disrupt, or gain unauthorized access to our website or
                systems.
              </li>
              <li>
                Use our website or Services for any purpose that violates applicable federal, state,
                or local law.
              </li>
            </ul>
            <p className="mt-3">
              SR Energy reserves the right to suspend or block access to the website for any user
              who violates these Terms.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Quote Request Form</h2>
            <p className="mb-3">
              Submitting a quote request through our website or contact form does not create a
              binding contract between you and SR Energy. It is an expression of interest and an
              invitation for SR Energy to contact you with pricing and program information.
            </p>
            <p>
              By submitting a quote request, you consent to being contacted by SR Energy
              representatives by phone, email, or text message at the contact information you
              provide. You may withdraw this consent at any time by contacting us directly.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              3. SMS / Text Message Communications
            </h2>
            <p className="mb-3">
              By providing your phone number and checking the SMS consent checkbox, you expressly
              consent to receive text messages from SR Energy, including but not limited to quote
              follow-ups, appointment reminders, and program information. This consent is not a
              condition of purchasing any product or service.
            </p>
            <p className="mb-3">
              <strong>Message frequency varies.</strong> Standard message and data rates may apply.
            </p>
            <p className="mb-3">
              <strong>To opt out:</strong> Reply <strong>STOP</strong> to any message to
              unsubscribe. You will receive one confirmation message and no further texts will be
              sent.
            </p>
            <p>
              <strong>For assistance:</strong> Reply <strong>HELP</strong> or contact us at{' '}
              <a href={BUSINESS_INFO.phoneTel} className="text-[#F0A500] hover:underline">
                {BUSINESS_INFO.phone}
              </a>
              .
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              4. No Guarantee of Savings Estimates
            </h2>
            <p className="mb-3">
              Any savings estimates, payback period projections, bill reduction figures, or other
              financial projections provided on this website or in a quote are estimates only. They
              are based on general assumptions including average utility rates, typical system
              output, and standard household energy consumption.
            </p>
            <p className="mb-3">
              Actual savings will vary based on factors including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li>Your actual energy consumption and usage patterns.</li>
              <li>Local utility rates, rate structures, and net metering policies.</li>
              <li>Roof orientation, shading, and condition.</li>
              <li>Weather and solar irradiance at your location.</li>
              <li>System maintenance and equipment performance over time.</li>
              <li>Changes in government incentives, tax credits, or utility programs.</li>
            </ul>
            <p>
              SR Energy does not guarantee any specific level of energy savings or return on
              investment. Nothing in our marketing materials or website content constitutes a
              financial guarantee.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Intellectual Property</h2>
            <p>
              All content on the SR Energy website — including text, graphics, logos, icons, and
              images — is the property of SR Energy or its content suppliers and is protected by
              applicable copyright and trademark laws. You may not reproduce, distribute, or create
              derivative works from our content without our prior written consent.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Disclaimer of Warranties</h2>
            <p className="mb-3">
              The SR Energy website and its content are provided on an &quot;as is&quot; and
              &quot;as available&quot; basis without warranties of any kind, either express or
              implied. SR Energy makes no warranty that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The website will be uninterrupted, error-free, or free of viruses.</li>
              <li>Any information on the website is complete, accurate, or up to date.</li>
              <li>
                Use of the website will result in a specific outcome, quote, or service offer.
              </li>
            </ul>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              7. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by applicable law, SR Energy shall not be liable for
              any indirect, incidental, special, consequential, or punitive damages arising from
              your use of, or inability to use, the website or Services — even if SR Energy has been
              advised of the possibility of such damages. SR Energy&apos;s total liability for any
              claim arising from these Terms or your use of the website shall not exceed one hundred
              dollars ($100).
            </p>
          </div>

          {/* Section 8 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the State of
              Texas, without regard to its conflict-of-law principles. Any legal action or
              proceeding arising under these Terms shall be brought exclusively in the state or
              federal courts located in Travis County, Texas, and you hereby consent to the personal
              jurisdiction of such courts.
            </p>
          </div>

          {/* Section 9 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Changes to These Terms</h2>
            <p>
              SR Energy reserves the right to update or modify these Terms at any time. When we do,
              we will revise the &quot;Last updated&quot; date at the top of this page. Your
              continued use of the website after any changes constitutes your acceptance of the
              updated Terms.
            </p>
          </div>

          {/* Section 10 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contact Information</h2>
            <p className="mb-3">
              If you have questions about these Terms, please contact us:
            </p>
            <address className="not-italic space-y-1 text-gray-700">
              <p><strong>{BUSINESS_INFO.name}</strong></p>
              <p>1234 Solar Way, Suite 100</p>
              <p>Austin, TX 78701</p>
              <p>
                Phone:{' '}
                <a href={BUSINESS_INFO.phoneTel} className="text-[#F0A500] hover:underline">
                  {BUSINESS_INFO.phone}
                </a>
              </p>
              <p>
                Email:{' '}
                <a href={BUSINESS_INFO.emailHref} className="text-[#F0A500] hover:underline">
                  {BUSINESS_INFO.email}
                </a>
              </p>
            </address>
            <p className="mt-4">
              You can also reach us through our{' '}
              <Link href="/contact" className="text-[#F0A500] hover:underline">
                contact page
              </Link>
              .
            </p>
          </div>

        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-[#111827] px-4 py-10 text-center">
        <div className="mx-auto max-w-xl">
          <p className="text-gray-400 text-sm">
            Questions about these terms?{' '}
            <Link href="/contact" className="text-[#F0A500] hover:underline">
              Contact our team
            </Link>
            .
          </p>
          <p className="mt-2 text-gray-500 text-xs">
            Also see our{' '}
            <Link href="/privacy-policy" className="text-[#F0A500] hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>

    </main>
  );
}

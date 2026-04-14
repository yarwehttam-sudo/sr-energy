import type { Metadata } from 'next';
import Link from 'next/link';
import { BUSINESS_INFO } from '@/lib/businessInfo';

export const metadata: Metadata = {
  title: 'Privacy Policy | SR Energy',
  description:
    'SR Energy privacy policy — how we collect, use, and protect your personal information, including SMS consent and opt-out instructions.',
  alternates: { canonical: 'https://srenergy.com/privacy-policy/' },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* Hero */}
      <section className="bg-[#1e2333] px-4 py-14 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
          <p className="mt-3 text-gray-400 text-sm">Last updated: April 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-3xl space-y-10 text-base leading-relaxed text-gray-700">

          <div>
            <p>
              SR Energy (&quot;SR Energy,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is
              committed to protecting your privacy. This Privacy Policy explains what personal
              information we collect, how we use it, and your rights regarding that information.
              By using our website or submitting a quote request, you agree to the practices
              described in this policy.
            </p>
          </div>

          {/* Section 1 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
            <p className="mb-3">
              When you request a quote, contact us, or use our website, we may collect the
              following categories of personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Name</strong> — first and last name as provided in contact or quote forms.
              </li>
              <li>
                <strong>Email address</strong> — used to send your quote and follow-up
                communications.
              </li>
              <li>
                <strong>Phone number</strong> — used to contact you by phone or SMS regarding your
                quote or installation.
              </li>
              <li>
                <strong>Home address or ZIP code</strong> — used to assess service availability and
                to size your solar or battery system.
              </li>
              <li>
                <strong>Energy usage information</strong> — such as monthly electric bill estimates,
                utility provider, or roof details you share with us.
              </li>
              <li>
                <strong>Browser and device data</strong> — including IP address, browser type, and
                pages visited, collected automatically through standard web server logs and cookies.
              </li>
            </ul>
            <p className="mt-3">
              We do not collect sensitive financial information such as credit card numbers or bank
              account details through our website. SR Energy does not run credit checks.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                To prepare and deliver a personalized solar, battery, or EV charger quote for your
                home.
              </li>
              <li>
                To contact you by phone, email, or SMS regarding your quote, scheduling a site
                assessment, or answering questions about our services.
              </li>
              <li>
                To follow up on submitted quote requests that have not yet received a response.
              </li>
              <li>
                To send you occasional marketing messages about SR Energy products and promotions,
                only if you have given explicit consent.
              </li>
              <li>
                To improve our website and services based on aggregate usage data.
              </li>
              <li>
                To comply with applicable laws and regulations.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              3. SMS / Text Message Communications
            </h2>
            <p className="mb-3">
              By providing your phone number and checking the SMS consent box on our contact form,
              you agree to receive text messages from SR Energy. These messages may include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li>Quote confirmations and follow-up messages.</li>
              <li>Appointment reminders for site assessments or installations.</li>
              <li>Program updates related to Texas VPP eligibility or other offers.</li>
              <li>Occasional promotional messages (only with explicit marketing consent).</li>
            </ul>
            <p className="mb-3">
              <strong>Message frequency varies.</strong> Message and data rates may apply depending
              on your mobile carrier and plan.
            </p>
            <p className="mb-3">
              <strong>To opt out:</strong> Reply <strong>STOP</strong> to any text message from SR
              Energy at any time and you will be unsubscribed immediately. You will receive one
              final confirmation message.
            </p>
            <p>
              <strong>For help:</strong> Reply <strong>HELP</strong> to any text message or contact
              us directly at{' '}
              <a href={BUSINESS_INFO.phoneTel} className="text-[#F0A500] hover:underline">
                {BUSINESS_INFO.phone}
              </a>{' '}
              or{' '}
              <a href={BUSINESS_INFO.emailHref} className="text-[#F0A500] hover:underline">
                {BUSINESS_INFO.email}
              </a>
              .
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              4. How We Share Your Information
            </h2>
            <p className="mb-3">
              <strong>We do not sell your personal information to third parties.</strong>
            </p>
            <p className="mb-3">
              We may share your information with trusted service providers who assist us in
              operating our business — for example, CRM platforms, email delivery services, and
              scheduling tools. These providers are contractually required to use your information
              only to perform services on our behalf and may not use it for any other purpose.
            </p>
            <p>
              We may also disclose your information if required by law, court order, or government
              authority, or to protect the rights, property, or safety of SR Energy, our customers,
              or others.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide you with our
              services and to comply with our legal obligations. If you request that we delete your
              information, we will do so within a reasonable time, subject to any retention
              requirements imposed by law.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Cookies</h2>
            <p>
              Our website may use cookies and similar tracking technologies to improve your browsing
              experience and to understand how visitors use our site. You can disable cookies through
              your browser settings; however, doing so may limit certain functionality on our site.
            </p>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Your Rights</h2>
            <p className="mb-3">
              Depending on your state of residence, you may have rights regarding your personal
              information, including the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal information we hold about you.</li>
              <li>Request correction of inaccurate information.</li>
              <li>Request deletion of your personal information.</li>
              <li>Opt out of marketing communications at any time.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact us using the information in
              Section 8 below.
            </p>
          </div>

          {/* Section 8 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Contact Us</h2>
            <p className="mb-3">
              If you have questions about this Privacy Policy, wish to exercise your privacy rights,
              or need to report a privacy concern, please contact us:
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

          {/* Section 9 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our
              practices or applicable law. When we do, we will update the &quot;Last updated&quot;
              date at the top of this page. We encourage you to review this policy periodically.
            </p>
          </div>

        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-[#111827] px-4 py-10 text-center">
        <div className="mx-auto max-w-xl">
          <p className="text-gray-400 text-sm">
            Questions about our privacy practices?{' '}
            <Link href="/contact" className="text-[#F0A500] hover:underline">
              Contact our team
            </Link>
            .
          </p>
          <p className="mt-2 text-gray-500 text-xs">
            Also see our{' '}
            <Link href="/terms-of-service" className="text-[#F0A500] hover:underline">
              Terms of Service
            </Link>
            .
          </p>
        </div>
      </section>

    </main>
  );
}

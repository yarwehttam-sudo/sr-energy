import type { Metadata } from "next";
import { BUSINESS_INFO } from "@/lib/businessInfo";
import ContactForm from "@/app/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact SR Energy | Get a Free Solar Quote",
  description:
    "Reach out to SR Energy — call, email, or fill out our contact form. Our team responds within one business day. Clean energy starts with a conversation.",
  alternates: {
    canonical: "https://srenergy.us/contact/",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* ── HERO ── */}
      <section className="bg-[#1e2333] px-4 py-14 text-white sm:py-18">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d4920a]/20 px-3 py-1 text-xs font-semibold text-[#F0A500] ring-1 ring-inset ring-[#F0A500]/30">
            {/* leaf icon */}
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 20A7 7 0 0 1 4 13H2a9 9 0 0 0 9 9v-2Z" />
              <path d="M16.44 4.07A10 10 0 0 1 20 12c0 5.52-4.48 10-10 10" />
              <path d="M2 2s3.45 3.45 5 8c.55 1.62.83 3.3.83 5" />
            </svg>
            We&apos;re Here to Help
          </span>

          <h1 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Contact SR Energy
          </h1>

          <p className="mt-4 text-base text-gray-400 sm:text-lg">
            Questions about solar panels, home batteries, or EV chargers? Our team is
            ready to help. Reach out and we&apos;ll get back to you within one
            business day.
          </p>
        </div>
      </section>

      {/* ── CONTACT CARDS ── */}
      <section className="px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-5 sm:grid-cols-3">

            {/* Phone */}
            <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-[#F0A500]">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-bold sm:text-2xl">Call Us</h2>
              <p className="mt-1 text-sm text-gray-600">
                Speak directly with our solar specialists.
              </p>
              <a
                href={BUSINESS_INFO.phoneTel}
                className="mt-4 text-lg font-semibold text-[#F0A500] hover:text-[#fbb82a] transition-colors"
              >
                {BUSINESS_INFO.phone}
              </a>
              <p className="mt-2 text-xs text-gray-500">
                Mon–Fri 10 AM–6 PM · Sat 10 AM–2 PM (MT)
              </p>
            </div>

            {/* Email */}
            <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-[#F0A500]">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-bold sm:text-2xl">Email Us</h2>
              <p className="mt-1 text-sm text-gray-600">
                Send us a message anytime — we respond fast.
              </p>
              <a
                href={BUSINESS_INFO.emailHref}
                className="mt-4 break-all text-sm font-semibold text-[#F0A500] hover:text-[#fbb82a] transition-colors"
              >
                {BUSINESS_INFO.email}
              </a>
              <p className="mt-2 text-xs text-gray-500">
                We respond within 1 business day.
              </p>
            </div>

            {/* Response time */}
            <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-[#F0A500]">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-bold sm:text-2xl">Hours</h2>
              <p className="mt-1 text-sm text-gray-600">
                We&apos;re available when you need us most.
              </p>
              <ul className="mt-4 space-y-1 text-sm text-gray-700">
                <li className="flex justify-between gap-2">
                  <span className="font-medium">Mon–Fri</span>
                  <span className="text-gray-500">10:00 AM – 6:00 PM</span>
                </li>
                <li className="flex justify-between gap-2">
                  <span className="font-medium">Saturday</span>
                  <span className="text-gray-500">10:00 AM – 2:00 PM</span>
                </li>
                <li className="flex justify-between gap-2">
                  <span className="font-medium">Sunday</span>
                  <span className="text-gray-500">Closed</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ── */}
      <section className="border-t border-gray-100 bg-[#111827] px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-bold text-white sm:text-2xl">Send Us a Message</h2>
            <p className="mt-2 text-sm text-gray-400">
              Fill out the form below and our team will reach out within one business day.
            </p>
          </div>

          <ContactForm />
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="bg-[#1e2333] px-4 py-14 text-center text-white">
        <div className="mx-auto max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d4920a]/20 px-3 py-1 text-xs font-semibold text-[#F0A500] ring-1 ring-inset ring-[#F0A500]/30">
            Free Consultation
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Ready to Go Solar?
          </h2>
          <p className="mt-3 text-gray-400">
            Join thousands of homeowners saving on energy. Call us today for your
            free no-obligation quote.
          </p>
          <a
            href={BUSINESS_INFO.phoneTel}
            className="mt-8 inline-block rounded-lg bg-[#F0A500] px-7 py-3 text-base font-semibold text-white shadow hover:bg-[#fbb82a] transition-colors"
          >
            Call {BUSINESS_INFO.phone}
          </a>
          <p className="mt-4 text-sm text-gray-500">
            Or email us at{" "}
            <a
              href={BUSINESS_INFO.emailHref}
              className="text-[#F0A500] hover:text-[#fbb82a] transition-colors"
            >
              {BUSINESS_INFO.email}
            </a>
          </p>
        </div>
      </section>

    </main>
  );
}

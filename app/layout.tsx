import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import Footer from "./components/Footer";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "SR Energy | No-Credit-Check Solar, Batteries & EV Chargers",
    template: "%s | SR Energy",
  },
  description:
    "SR Energy installs solar panels, home batteries, and EV chargers across 30 states — no credit check required. Get a free quote today.",
  metadataBase: new URL("https://srenergy.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <header className="sticky top-0 z-50 bg-[#1e2333] shadow-sm">
          <div className="mx-auto max-w-5xl px-4 py-2 sm:px-6 lg:px-8 flex items-center justify-between">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <div style={{
                  border: '2.5px solid #F0A500',
                  padding: '6px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '80px'
                }}>
                  <span style={{
                    color: '#F0A500',
                    fontSize: '38px',
                    fontWeight: '700',
                    letterSpacing: '4px',
                    lineHeight: 1,
                    fontFamily: 'Georgia, serif'
                  }}>SR</span>
                </div>
                <span style={{
                  color: '#F0A500',
                  fontSize: '11px',
                  fontWeight: '400',
                  letterSpacing: '8px',
                  fontFamily: 'Georgia, serif'
                }}>ENERGY</span>
              </div>
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/locations/"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Locations
              </Link>
              <Link
                href="/how-it-works"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Our Process
              </Link>
              <Link
                href="/contact/"
                className="rounded-lg bg-[#F0A500] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#fbb82a] transition-colors"
              >
                Free Quote
              </Link>
            </nav>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}

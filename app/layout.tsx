import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Link from 'next/link';
import Footer from './components/Footer';
import SkipLink from './components/SkipLink';
import './globals.css';

const geistSans = localFont({ src: './fonts/GeistVF.woff', variable: '--font-geist-sans', weight: '100 900' });
const geistMono = localFont({ src: './fonts/GeistMonoVF.woff', variable: '--font-geist-mono', weight: '100 900' });

export const metadata: Metadata = {
  title: { default: 'SR Energy | Solar, Battery & EV Charging', template: '%s | SR Energy' },
  description: 'Explore residential solar, battery backup and EV charging with property-specific review.',
  metadataBase: new URL('https://srenergy.us'),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const navLink = 'inline-flex min-h-11 items-center px-2 text-gray-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F0A500]';
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable} overflow-x-hidden antialiased bg-gray-50`}><SkipLink /><header className="sticky top-0 z-50 bg-[#1e2333] shadow-sm"><div className="mx-auto flex max-w-5xl flex-col items-center px-3 py-2 sm:flex-row sm:justify-between sm:px-4"><Link href="/" className="inline-flex min-h-11 items-center text-lg font-bold tracking-widest text-[#F0A500] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F0A500] sm:text-xl" aria-label="SR Energy home">SR ENERGY</Link><nav aria-label="Primary" className="flex w-full flex-wrap items-center justify-center gap-x-1 text-sm sm:w-auto sm:flex-nowrap sm:gap-x-2"><Link href="/products/solar" className={navLink}>Solar</Link><Link href="/products/battery" className={navLink}>Battery</Link><Link href="/products/ev-charger" className={navLink}>EV</Link><Link href="/locations" className={navLink}>Locations</Link><Link href="/contact" className="inline-flex min-h-11 items-center rounded-lg bg-[#F0A500] px-3 font-semibold text-[#1e2333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Request review</Link></nav></div></header><div id="main-content" tabIndex={-1} className="px-4 focus-visible:outline focus-visible:outline-4 focus-visible:outline-[#F0A500] sm:px-6 lg:px-8">{children}</div><Footer /></body></html>;
}
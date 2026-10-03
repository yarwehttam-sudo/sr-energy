import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Link from 'next/link';
import Footer from './components/Footer';
import './globals.css';

const geistSans = localFont({ src: './fonts/GeistVF.woff', variable: '--font-geist-sans', weight: '100 900' });
const geistMono = localFont({ src: './fonts/GeistMonoVF.woff', variable: '--font-geist-mono', weight: '100 900' });

export const metadata: Metadata = {
  title: { default: 'SR Energy | Solar, Battery & EV Charging', template: '%s | SR Energy' },
  description: 'Explore residential solar, battery backup and EV charging with property-specific review.',
  metadataBase: new URL('https://srenergy.us'),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}><a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-white focus:p-3">Skip to content</a><header className="sticky top-0 z-50 bg-[#1e2333] shadow-sm"><div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3"><Link href="/" className="text-xl font-bold tracking-widest text-[#F0A500]" aria-label="SR Energy home">SR ENERGY</Link><nav aria-label="Primary" className="flex items-center gap-3 text-sm sm:gap-5"><Link href="/products/solar" className="text-gray-200 hover:text-white">Solar</Link><Link href="/products/battery" className="text-gray-200 hover:text-white">Battery</Link><Link href="/products/ev-charger" className="text-gray-200 hover:text-white">EV</Link><Link href="/locations" className="hidden text-gray-200 hover:text-white sm:inline">Locations</Link><Link href="/contact" className="rounded-lg bg-[#F0A500] px-3 py-2 font-semibold text-[#1e2333]">Request review</Link></nav></div></header><div id="main-content" className="px-4 sm:px-6 lg:px-8">{children}</div><Footer /></body></html>;
}
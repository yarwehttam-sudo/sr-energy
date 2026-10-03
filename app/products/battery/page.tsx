import type { Metadata } from 'next';
import ProductLanding from '@/app/components/ProductLanding';
export const metadata: Metadata = { title: 'Home Battery & Backup Power | SR Energy', description: 'Plan home battery and backup power around essential loads, runtime goals and your electrical setup.', alternates: { canonical: 'https://srenergy.us/products/battery/' } };
export default function BatteryPage() { return <ProductLanding intent="battery" />; }
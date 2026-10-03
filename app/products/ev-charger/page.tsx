import type { Metadata } from 'next';
import ProductLanding from '@/app/components/ProductLanding';
export const metadata: Metadata = { title: 'Home EV Charging | SR Energy', description: 'Explore home EV charging based on your vehicle, parking location, panel capacity and rate plan.', alternates: { canonical: 'https://srenergy.us/products/ev-charger/' } };
export default function EvChargerPage() { return <ProductLanding intent="ev-charging" />; }
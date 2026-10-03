import type { Metadata } from 'next';
import ProductLanding from '@/app/components/ProductLanding';
export const metadata: Metadata = { title: 'Residential Solar | SR Energy', description: 'Explore whether solar may fit your home based on roof, energy use and utility requirements.', alternates: { canonical: 'https://srenergy.us/products/solar/' } };
export default function SolarPage() { return <ProductLanding intent="solar" />; }
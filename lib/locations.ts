export interface City {
  name: string;
  slug: string;
}

export interface State {
  abbr: string;
  name: string;
  slug: string;
  isVppEligible: boolean;
  avgKwhRate: number;
  peakSunHours: number;
  cities: City[];
}

function city(name: string): City {
  return { name, slug: name.toLowerCase().replace(/\s+/g, '-') };
}

export const STATES: State[] = [
  {
    abbr: 'CA',
    name: 'California',
    slug: 'california',
    isVppEligible: false,
    avgKwhRate: 0.236,
    peakSunHours: 5.8,
    cities: [city('Los Angeles'), city('San Diego'), city('San Jose'), city('San Francisco'), city('Sacramento')],
  },
  {
    abbr: 'CO',
    name: 'Colorado',
    slug: 'colorado',
    isVppEligible: false,
    avgKwhRate: 0.125,
    peakSunHours: 5.5,
    cities: [city('Denver'), city('Colorado Springs'), city('Aurora'), city('Fort Collins'), city('Boulder')],
  },
  {
    abbr: 'CT',
    name: 'Connecticut',
    slug: 'connecticut',
    isVppEligible: false,
    avgKwhRate: 0.238,
    peakSunHours: 4.2,
    cities: [city('Bridgeport'), city('New Haven'), city('Hartford'), city('Stamford')],
  },
  {
    abbr: 'DE',
    name: 'Delaware',
    slug: 'delaware',
    isVppEligible: false,
    avgKwhRate: 0.133,
    peakSunHours: 4.3,
    cities: [city('Wilmington'), city('Dover'), city('Newark'), city('Middletown')],
  },
  {
    abbr: 'DC',
    name: 'District of Columbia',
    slug: 'district-of-columbia',
    isVppEligible: false,
    avgKwhRate: 0.177,
    peakSunHours: 4.3,
    cities: [city('Washington')],
  },
  {
    abbr: 'IL',
    name: 'Illinois',
    slug: 'illinois',
    isVppEligible: false,
    avgKwhRate: 0.128,
    peakSunHours: 4.0,
    cities: [city('Chicago'), city('Aurora'), city('Rockford'), city('Joliet'), city('Naperville')],
  },
  {
    abbr: 'IA',
    name: 'Iowa',
    slug: 'iowa',
    isVppEligible: false,
    avgKwhRate: 0.109,
    peakSunHours: 4.4,
    cities: [city('Des Moines'), city('Cedar Rapids'), city('Davenport'), city('Sioux City')],
  },
  {
    abbr: 'MD',
    name: 'Maryland',
    slug: 'maryland',
    isVppEligible: false,
    avgKwhRate: 0.143,
    peakSunHours: 4.4,
    cities: [city('Baltimore'), city('Frederick'), city('Rockville'), city('Gaithersburg'), city('Annapolis')],
  },
  {
    abbr: 'MI',
    name: 'Michigan',
    slug: 'michigan',
    isVppEligible: false,
    avgKwhRate: 0.168,
    peakSunHours: 3.8,
    cities: [city('Detroit'), city('Grand Rapids'), city('Warren'), city('Ann Arbor'), city('Lansing')],
  },
  {
    abbr: 'MT',
    name: 'Montana',
    slug: 'montana',
    isVppEligible: false,
    avgKwhRate: 0.108,
    peakSunHours: 4.8,
    cities: [city('Billings'), city('Missoula'), city('Great Falls'), city('Bozeman')],
  },
  {
    abbr: 'NE',
    name: 'Nebraska',
    slug: 'nebraska',
    isVppEligible: false,
    avgKwhRate: 0.099,
    peakSunHours: 4.8,
    cities: [city('Omaha'), city('Lincoln'), city('Bellevue'), city('Grand Island')],
  },
  {
    abbr: 'NH',
    name: 'New Hampshire',
    slug: 'new-hampshire',
    isVppEligible: false,
    avgKwhRate: 0.214,
    peakSunHours: 4.1,
    cities: [city('Manchester'), city('Nashua'), city('Concord'), city('Dover')],
  },
  {
    abbr: 'NJ',
    name: 'New Jersey',
    slug: 'new-jersey',
    isVppEligible: false,
    avgKwhRate: 0.168,
    peakSunHours: 4.3,
    cities: [city('Newark'), city('Jersey City'), city('Paterson'), city('Elizabeth'), city('Trenton')],
  },
  {
    abbr: 'OH',
    name: 'Ohio',
    slug: 'ohio',
    isVppEligible: false,
    avgKwhRate: 0.124,
    peakSunHours: 4.0,
    cities: [city('Columbus'), city('Cleveland'), city('Cincinnati'), city('Toledo'), city('Akron')],
  },
  {
    abbr: 'OR',
    name: 'Oregon',
    slug: 'oregon',
    isVppEligible: false,
    avgKwhRate: 0.116,
    peakSunHours: 4.5,
    cities: [city('Portland'), city('Salem'), city('Eugene'), city('Gresham'), city('Hillsboro')],
  },
  {
    abbr: 'PA',
    name: 'Pennsylvania',
    slug: 'pennsylvania',
    isVppEligible: false,
    avgKwhRate: 0.143,
    peakSunHours: 4.1,
    cities: [city('Philadelphia'), city('Pittsburgh'), city('Allentown'), city('Erie'), city('Reading')],
  },
  {
    abbr: 'RI',
    name: 'Rhode Island',
    slug: 'rhode-island',
    isVppEligible: false,
    avgKwhRate: 0.228,
    peakSunHours: 4.2,
    cities: [city('Providence'), city('Cranston'), city('Warwick'), city('Pawtucket')],
  },
  {
    abbr: 'VA',
    name: 'Virginia',
    slug: 'virginia',
    isVppEligible: false,
    avgKwhRate: 0.123,
    peakSunHours: 4.5,
    cities: [city('Virginia Beach'), city('Norfolk'), city('Chesapeake'), city('Richmond'), city('Newport News')],
  },
  {
    abbr: 'WA',
    name: 'Washington',
    slug: 'washington',
    isVppEligible: false,
    avgKwhRate: 0.099,
    peakSunHours: 4.0,
    cities: [city('Seattle'), city('Spokane'), city('Tacoma'), city('Vancouver'), city('Bellevue')],
  },
];

// ---------------------------------------------------------------------------
// Helper: up to 3 other cities in the same state, excluding the current city
// ---------------------------------------------------------------------------

export function getNearbyStateCities(
  stateSlug: string,
  currentCitySlug: string
): City[] {
  const state = STATES.find((s) => s.slug === stateSlug);
  if (!state) return [];
  const cities = state.cities;
  const idx = cities.findIndex((c) => c.slug === currentCitySlug);
  if (idx === -1) return cities.slice(0, 3);
  // Return the 3 cities that follow the current city, wrapping around.
  // Example for [A,B,C,D,E]: A→[B,C,D], B→[C,D,E], C→[D,E,A], D→[E,A,B], E→[A,B,C]
  // This guarantees every city receives exactly 3 inbound sibling links.
  const result: City[] = [];
  for (let i = 1; i <= 3; i++) {
    const neighbor = cities[(idx + i) % cities.length];
    result.push(neighbor);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Helper: up to 3 geographically adjacent SR Energy service states
// ---------------------------------------------------------------------------

// Adjacency pairs based on shared land borders.
// Only SR Energy service states appear as values.
const ADJACENCY: Record<string, string[]> = {
  CA: ['OR'],
  CO: ['NE'],
  CT: ['RI'],
  DE: ['MD', 'PA', 'NJ'],
  DC: ['MD', 'VA'],
  IL: ['IA'],
  IA: ['IL', 'NE'],
  MD: ['VA', 'PA', 'DE', 'DC'],
  MI: ['OH'],
  MT: [],
  NE: ['IA', 'CO'],
  NH: [],
  NJ: ['PA', 'DE'],
  OH: ['PA', 'MI'],
  OR: ['WA', 'CA'],
  PA: ['NJ', 'DE', 'MD', 'OH'],
  RI: ['CT'],
  VA: ['MD', 'DC'],
  WA: ['OR'],
};

const SERVICE_ABBRS = new Set(STATES.map((s) => s.abbr));

export function getNearbyStates(stateAbbr: string): State[] {
  const neighbors = (ADJACENCY[stateAbbr] ?? []).filter(
    (abbr) => SERVICE_ABBRS.has(abbr) && abbr !== stateAbbr
  );
  // Prefer states with more cities (richer cross-linking targets)
  return neighbors
    .map((abbr) => STATES.find((s) => s.abbr === abbr)!)
    .sort((a, b) => b.cities.length - a.cities.length)
    .slice(0, 3);
}

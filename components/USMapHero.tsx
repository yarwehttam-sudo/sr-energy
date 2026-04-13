'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

// ── Active service states — matches lib/locations.ts exactly ────────
const ACTIVE_STATES: Record<string, { cities: number; slug: string }> = {
  Arkansas: { cities: 4, slug: 'arkansas' },
  California: { cities: 5, slug: 'california' },
  Colorado: { cities: 5, slug: 'colorado' },
  Connecticut: { cities: 4, slug: 'connecticut' },
  Delaware: { cities: 4, slug: 'delaware' },
  Georgia: { cities: 5, slug: 'georgia' },
  Hawaii: { cities: 5, slug: 'hawaii' },
  Illinois: { cities: 5, slug: 'illinois' },
  Iowa: { cities: 4, slug: 'iowa' },
  Maine: { cities: 4, slug: 'maine' },
  Maryland: { cities: 5, slug: 'maryland' },
  Massachusetts: { cities: 5, slug: 'massachusetts' },
  Michigan: { cities: 5, slug: 'michigan' },
  Montana: { cities: 4, slug: 'montana' },
  Nebraska: { cities: 4, slug: 'nebraska' },
  Nevada: { cities: 5, slug: 'nevada' },
  'New Hampshire': { cities: 4, slug: 'new-hampshire' },
  'New Jersey': { cities: 5, slug: 'new-jersey' },
  'New Mexico': { cities: 4, slug: 'new-mexico' },
  'New York': { cities: 5, slug: 'new-york' },
  Ohio: { cities: 5, slug: 'ohio' },
  Oregon: { cities: 5, slug: 'oregon' },
  Pennsylvania: { cities: 5, slug: 'pennsylvania' },
  'Rhode Island': { cities: 4, slug: 'rhode-island' },
  Texas: { cities: 5, slug: 'texas' },
  Utah: { cities: 5, slug: 'utah' },
  Vermont: { cities: 4, slug: 'vermont' },
  Virginia: { cities: 5, slug: 'virginia' },
  Washington: { cities: 5, slug: 'washington' },
  'West Virginia': { cities: 4, slug: 'west-virginia' },
};

const TOTAL_STATES = Object.keys(ACTIVE_STATES).length; // 30
const TOTAL_CITIES = Object.values(ACTIVE_STATES).reduce((s, v) => s + v.cities, 0);

const FIPS_TO_NAME: Record<string, string> = {
  '01': 'Alabama', '02': 'Alaska', '04': 'Arizona', '05': 'Arkansas',
  '06': 'California', '08': 'Colorado', '09': 'Connecticut', '10': 'Delaware',
  '11': 'District of Columbia', '12': 'Florida', '13': 'Georgia', '15': 'Hawaii',
  '16': 'Idaho', '17': 'Illinois', '18': 'Indiana', '19': 'Iowa',
  '20': 'Kansas', '21': 'Kentucky', '22': 'Louisiana', '23': 'Maine',
  '24': 'Maryland', '25': 'Massachusetts', '26': 'Michigan', '27': 'Minnesota',
  '28': 'Mississippi', '29': 'Missouri', '30': 'Montana', '31': 'Nebraska',
  '32': 'Nevada', '33': 'New Hampshire', '34': 'New Jersey', '35': 'New Mexico',
  '36': 'New York', '37': 'North Carolina', '38': 'North Dakota', '39': 'Ohio',
  '40': 'Oklahoma', '41': 'Oregon', '42': 'Pennsylvania', '44': 'Rhode Island',
  '45': 'South Carolina', '46': 'South Dakota', '47': 'Tennessee', '48': 'Texas',
  '49': 'Utah', '50': 'Vermont', '51': 'Virginia', '53': 'Washington',
  '54': 'West Virginia', '55': 'Wisconsin', '56': 'Wyoming',
};

// ── Animated counter hook ───────────────────────────────────────────
function useAnimatedCount(target: number, duration: number, trigger: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(ease * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, trigger]);

  return count;
}

// ── Tooltip ─────────────────────────────────────────────────────────
interface TooltipData {
  name: string;
  cities?: number;
  x: number;
  y: number;
}

function MapTooltip({ data }: { data: TooltipData | null }) {
  if (!data) return null;
  return (
    <div
      className="absolute pointer-events-none z-10 whitespace-nowrap rounded-md px-3 py-2 text-sm"
      style={{
        left: data.x + 14,
        top: data.y - 10,
        background: '#0D2240',
        border: '1px solid #C49B38',
      }}
    >
      <div className="font-semibold" style={{ color: '#E8C55A' }}>
        {data.name}
      </div>
      <div className="text-xs mt-0.5" style={{ color: '#aaa' }}>
        {data.cities ? `${data.cities} cities · Solar · Battery · EV` : 'Coming soon'}
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────
export default function USMapHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const glowRef = useRef<SVGRectElement>(null);
  const clipRef = useRef<SVGClipPathElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [mapReady, setMapReady] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const glowRafRef = useRef<number>(0);

  const stateCount = useAnimatedCount(TOTAL_STATES, 1000, mapReady);
  const cityCount = useAnimatedCount(TOTAL_CITIES, 1300, mapReady);

  // ── Glow wave loop ──────────────────────────────────────────────
  const startGlowWave = useCallback(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const duration = 3000;
    const pause = 2500;
    const startX = -300;
    const endX = 1260;
    let start: number | null = null;

    const step = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const cyclePos = elapsed % (duration + pause);

      if (cyclePos < duration) {
        const progress = cyclePos / duration;
        const ease =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        glow.setAttribute('x', String(Math.round(startX + (endX - startX) * ease)));
        glow.setAttribute('opacity', '1');
      } else {
        glow.setAttribute('opacity', '0');
      }

      glowRafRef.current = requestAnimationFrame(step);
    };

    glowRafRef.current = requestAnimationFrame(step);
  }, []);

  // ── Load map data when section scrolls into view ────────────────
  useEffect(() => {
    if (!isInView) return;

    const svg = svgRef.current;
    const clip = clipRef.current;
    const glow = glowRef.current;
    if (!svg || !clip || !glow) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(
          'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'
        );
        const us = await res.json();
        if (cancelled) return;

        const [{ geoAlbersUsa, geoPath }, topojson] = await Promise.all([
          import('d3-geo'),
          import('topojson-client'),
        ]);

        const feats = (topojson as { feature: Function }).feature(us, us.objects.states).features;
        const projection = geoAlbersUsa().fitSize([960, 600], {
          type: 'FeatureCollection',
          features: feats,
        });
        const pathGen = geoPath().projection(projection);

        const stateEls: { el: SVGPathElement; cx: number; cy: number }[] = [];

        feats.forEach((f: { id: string | number }) => {
          const fips = String(f.id).padStart(2, '0');
          const name = FIPS_TO_NAME[fips] || '';
          const d = pathGen(f);
          if (!d) return;

          const isActive = ACTIVE_STATES[name];
          const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          el.setAttribute('d', d);
          el.style.opacity = '0';
          el.style.cursor = 'pointer';
          el.style.transition = 'fill 0.4s ease, stroke 0.4s ease';

          if (isActive) {
            el.setAttribute('fill', '#C49B38');
            el.setAttribute('stroke', '#8B6D28');
            el.setAttribute('stroke-width', '0.5');
            const clipUse = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            clipUse.setAttribute('d', d);
            clip.appendChild(clipUse);
          } else {
            el.setAttribute('fill', '#152A4A');
            el.setAttribute('stroke', '#1E3A5F');
            el.setAttribute('stroke-width', '0.5');
          }

          el.addEventListener('mouseenter', (e) => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;
            if (isActive) {
              el.setAttribute('fill', '#E8C55A');
              el.setAttribute('stroke', '#D4A843');
            } else {
              el.setAttribute('fill', '#1C3560');
            }
            setTooltip({
              name,
              cities: isActive?.cities,
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
          });

          el.addEventListener('mousemove', (e) => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;
            setTooltip((prev) =>
              prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : null
            );
          });

          el.addEventListener('mouseleave', () => {
            if (isActive) {
              el.setAttribute('fill', '#C49B38');
              el.setAttribute('stroke', '#8B6D28');
            } else {
              el.setAttribute('fill', '#152A4A');
            }
            setTooltip(null);
          });

          if (isActive) {
            el.addEventListener('click', () => {
              window.location.href = `/locations/${isActive.slug}`;
            });
          }

          svg.insertBefore(el, glow);
          const bbox = el.getBBox();
          stateEls.push({ el, cx: bbox.x + bbox.width / 2, cy: bbox.y + bbox.height / 2 });
        });

        stateEls.sort((a, b) => a.cx + a.cy * 0.3 - (b.cx + b.cy * 0.3));
        stateEls.forEach(({ el }, i) => {
          setTimeout(() => {
            el.style.transition = 'opacity 0.5s ease, fill 0.4s ease, stroke 0.4s ease';
            el.style.opacity = '1';
          }, i * 25);
        });

        setTimeout(() => setMapReady(true), stateEls.length * 15);
        setTimeout(() => startGlowWave(), stateEls.length * 25 + 600);
      } catch (err) {
        console.error('Failed to load US map data:', err);
      }
    })();

    return () => {
      cancelled = true;
      if (glowRafRef.current) cancelAnimationFrame(glowRafRef.current);
    };
  }, [isInView, startGlowWave]);

  return (
    <div ref={containerRef} className="w-full py-10">
      <div className="mx-auto max-w-4xl px-4">
        {/* Map */}
        <motion.div
          className="relative w-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <svg
            ref={svgRef}
            viewBox="0 0 960 600"
            className="w-full h-auto"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={`Interactive US map showing SR Energy service areas across ${TOTAL_STATES} states`}
          >
            <title>SR Energy service area map</title>
            <desc>
              An interactive map of the United States highlighting {TOTAL_STATES} states
              where SR Energy provides solar, battery, and EV charger installation.
            </desc>
            <defs>
              <linearGradient id="glowGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#E8C55A" stopOpacity={0} />
                <stop offset="40%" stopColor="#F0D88A" stopOpacity={0.55} />
                <stop offset="60%" stopColor="#F0D88A" stopOpacity={0.55} />
                <stop offset="100%" stopColor="#E8C55A" stopOpacity={0} />
              </linearGradient>
              <clipPath ref={clipRef} id="activeClip" />
            </defs>
            <rect
              ref={glowRef}
              x={-300}
              y={0}
              width={300}
              height={600}
              fill="url(#glowGrad)"
              clipPath="url(#activeClip)"
              opacity={0}
              style={{ pointerEvents: 'none' }}
            />
          </svg>
          <MapTooltip data={tooltip} />
        </motion.div>

        {/* Stats */}
        <div className="flex justify-center gap-8 md:gap-12 mt-8 flex-wrap">
          {[
            { value: stateCount, label: 'States Served' },
            { value: cityCount, label: 'Cities Available' },
            { value: 4, label: 'Product Lines' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center min-w-[90px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="text-3xl font-bold tabular-nums" style={{ color: '#F0A500' }}>
                {stat.value}
              </div>
              <div className="text-xs mt-1 text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <motion.div
          className="flex justify-center gap-6 mt-5 text-xs text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: '#C49B38' }} />
            Service area
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: '#152A4A' }} />
            Coming soon
          </span>
        </motion.div>
      </div>
    </div>
  );
}

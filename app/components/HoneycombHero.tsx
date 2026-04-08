'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const HEX_W = 60;
const HEX_H = 70;

function hexPoints(cx: number, cy: number): string {
  return [
    [cx, cy - HEX_H / 2],
    [cx + HEX_W / 2, cy - HEX_H / 4],
    [cx + HEX_W / 2, cy + HEX_H / 4],
    [cx, cy + HEX_H / 2],
    [cx - HEX_W / 2, cy + HEX_H / 4],
    [cx - HEX_W / 2, cy - HEX_H / 4],
  ]
    .map(([x, y]) => `${x},${y}`)
    .join(' ');
}

interface HexCell {
  id: number;
  points: string;
}

function buildGrid(w: number, h: number): HexCell[] {
  const colSpacing = HEX_W;
  const rowSpacing = HEX_H * 0.75;
  const cols = Math.ceil(w / colSpacing) + 3;
  const rows = Math.ceil(h / rowSpacing) + 3;
  const cells: HexCell[] = [];
  let id = 0;
  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      const cx = col * colSpacing + (row % 2 !== 0 ? colSpacing / 2 : 0);
      const cy = row * rowSpacing + HEX_H / 2;
      cells.push({ id: id++, points: hexPoints(cx, cy) });
    }
  }
  return cells;
}

interface Pulse {
  key: number;
  points: string;
}

export default function HoneycombHero() {
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const pulseKeyRef = useRef(0);

  useEffect(() => {
    const update = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const hexes = useMemo<HexCell[]>(
    () => (dims ? buildGrid(dims.w, dims.h) : []),
    [dims],
  );

  // Keep a ref so the interval always sees the latest hex array
  const hexesRef = useRef(hexes);
  hexesRef.current = hexes;

  useEffect(() => {
    if (!dims) return;

    const interval = setInterval(() => {
      const current = hexesRef.current;
      if (current.length === 0) return;

      const count = Math.floor(Math.random() * 2) + 2; // 2 or 3
      const newPulses: Pulse[] = Array.from({ length: count }, () => {
        const hex = current[Math.floor(Math.random() * current.length)];
        return { key: pulseKeyRef.current++, points: hex.points };
      });

      setPulses(prev => [...prev, ...newPulses]);

      // Remove after animation completes (1.5s + small buffer)
      const keys = new Set(newPulses.map(p => p.key));
      setTimeout(() => {
        setPulses(prev => prev.filter(p => !keys.has(p.key)));
      }, 1600);
    }, 300);

    return () => clearInterval(interval);
  }, [dims]);

  if (!dims) return null;

  return (
    <svg
      className="honeycomb-rotate"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* Base static hex grid */}
      {hexes.map(hex => (
        <polygon
          key={hex.id}
          points={hex.points}
          fill="#1e2333"
          stroke="#F0A500"
          strokeOpacity={0.2}
          strokeWidth={1}
        />
      ))}

      {/* Animated pulse overlays — only 2-3 at a time */}
      {pulses.map(pulse => (
        <motion.polygon
          key={pulse.key}
          points={pulse.points}
          stroke="#F0A500"
          strokeOpacity={0.3}
          strokeWidth={1}
          initial={{ fill: '#1e2333', fillOpacity: 1 }}
          animate={{
            fill: ['#1e2333', '#F0A500', '#1e2333'],
            fillOpacity: [1, 0.4, 1],
          }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      ))}

      {/* SR Energy logo watermark */}
      <image
        href="/images/logo.png"
        x="50%"
        y="50%"
        width="800"
        height="800"
        transform="translate(-400, -400)"
        opacity={0.06}
      />
    </svg>
  );
}

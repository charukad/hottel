'use client';

import './ParticleField.css';

/**
 * Seeded pseudo-random number generator (mulberry32).
 * Ensures identical output on server and client for hydration safety.
 */
function seededRandom(seed) {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/**
 * ParticleField — Lightweight CSS-animated floating particles (mountain mist).
 * Pure CSS for performance — no canvas, no JavaScript animation loop.
 * Uses a seeded PRNG so values are deterministic across SSR and hydration.
 * @param {number} count - Number of particles.
 */
const ParticleField = ({ count = 30 }) => {
  const particles = Array.from({ length: count }, (_, i) => {
    const r1 = seededRandom(i * 7 + 1);
    const r2 = seededRandom(i * 7 + 2);
    const r3 = seededRandom(i * 7 + 3);
    const r4 = seededRandom(i * 7 + 4);
    const r5 = seededRandom(i * 7 + 5);
    const r6 = seededRandom(i * 7 + 6);
    return {
      id: i,
      left: `${(r1 * 100).toFixed(2)}%`,
      top: `${(r2 * 100).toFixed(2)}%`,
      size: `${(2 + r3 * 4).toFixed(2)}px`,
      delay: `${(r4 * 8).toFixed(2)}s`,
      duration: `${(8 + r5 * 12).toFixed(2)}s`,
      opacity: Number((0.15 + r6 * 0.25).toFixed(4)),
    };
  });

  return (
    <div className="particle-field" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default ParticleField;

/**
 * SectionDivider — Organic gradient blur divider between sections.
 * @param {'wave'|'mist'|'gradient'} variant
 * @param {boolean} flip - Mirror the divider.
 */
const SectionDivider = ({ variant = 'gradient', flip = false }) => {
  if (variant === 'wave') {
    return (
      <div
        className="section-divider"
        style={{ transform: flip ? 'scaleY(-1)' : 'none' }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          style={{ display: 'block', width: '100%', height: '60px' }}
        >
          <path
            d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"
            fill="currentColor"
            style={{ color: 'var(--cream)' }}
          />
        </svg>
      </div>
    );
  }

  if (variant === 'mist') {
    return (
      <div
        className="section-divider section-divider-mist"
        style={{ transform: flip ? 'scaleY(-1)' : 'none' }}
        aria-hidden="true"
      >
        <div
          style={{
            height: '80px',
            background: 'linear-gradient(to bottom, transparent 0%, var(--cream) 100%)',
          }}
        />
      </div>
    );
  }

  // Default: gradient
  return (
    <div className="section-divider" aria-hidden="true">
      <div
        style={{
          height: '120px',
          background: `radial-gradient(ellipse 80% 50% at 50% 0%, rgba(52, 211, 153, 0.05) 0%, transparent 100%),
                       radial-gradient(ellipse 60% 40% at 30% 50%, rgba(212, 168, 83, 0.03) 0%, transparent 100%)`,
        }}
      />
    </div>
  );
};

export default SectionDivider;

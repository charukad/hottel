'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * GlassCard — Glassmorphism card with gradient border and 3D hover tilt.
 * @param {ReactNode} children
 * @param {string} className
 * @param {boolean} tilt - Enable 3D tilt on hover.
 * @param {boolean} glow - Enable glow effect on hover.
 */
const GlassCard = ({ children, className = '', tilt = true, glow = false, ...props }) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('perspective(800px) rotateX(0deg) rotateY(0deg)');
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    if (!tilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
    setGlowPosition({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(800px) rotateX(0deg) rotateY(0deg)');
    setGlowPosition({ x: 50, y: 50 });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`glass-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform',
      }}
      {...props}
    >
      {glow && (
        <div
          className="glass-card-glow"
          style={{
            background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(52, 211, 153, 0.12) 0%, transparent 60%)`,
          }}
        />
      )}
      {children}
    </motion.div>
  );
};

export default GlassCard;

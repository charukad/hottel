'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * ScrollProgress — Thin gradient bar at the top of the viewport tracking scroll.
 */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="scroll-progress"
      style={{
        scaleX,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #4a7c59, #34d399, #d4a853)',
        transformOrigin: '0%',
        zIndex: 10001,
      }}
    />
  );
};

export default ScrollProgress;

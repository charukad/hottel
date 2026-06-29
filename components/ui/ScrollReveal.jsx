'use client';

import { motion } from 'framer-motion';

/**
 * ScrollReveal — Configurable viewport-triggered animation wrapper.
 * @param {'fade'|'slide-up'|'slide-left'|'scale'|'blur'|'mask'} variant
 * @param {number} delay
 * @param {number} duration
 * @param {boolean} once
 */

const variants = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  'slide-up': {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  'slide-left': {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  'slide-right': {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
  },
  mask: {
    hidden: { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' },
    visible: { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' },
  },
};

const ScrollReveal = ({
  children,
  variant = 'slide-up',
  delay = 0,
  duration = 0.7,
  once = true,
  className = '',
  ...props
}) => {
  const selectedVariant = variants[variant] || variants['slide-up'];

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-80px' }}
      variants={{
        hidden: selectedVariant.hidden,
        visible: {
          ...selectedVariant.visible,
          transition: {
            duration,
            delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;

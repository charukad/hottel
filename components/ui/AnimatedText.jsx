'use client';

import { motion } from 'framer-motion';

/**
 * AnimatedText — Reveals text word-by-word or character-by-character with stagger.
 * @param {string} text - The text to animate.
 * @param {'word'|'character'} splitBy - How to split the text.
 * @param {string} className - CSS class for the container.
 * @param {string} tag - HTML tag to render ('h1', 'h2', 'p', 'span').
 * @param {number} delay - Initial delay before animation starts.
 * @param {number} stagger - Delay between each item.
 * @param {boolean} once - Animate only once when entering viewport.
 */
const AnimatedText = ({
  text,
  splitBy = 'word',
  className = '',
  tag = 'h2',
  delay = 0,
  stagger = 0.04,
  once = true,
}) => {
  const items = splitBy === 'character' ? text.split('') : text.split(' ');
  const MotionTag = motion[tag] || motion.div;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <MotionTag
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px' }}
      aria-label={text}
      style={{ display: 'flex', flexWrap: 'wrap', gap: splitBy === 'word' ? '0.3em' : '0' }}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          variants={itemVariants}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {item}
          {splitBy === 'word' && index < items.length - 1 ? '' : ''}
        </motion.span>
      ))}
    </MotionTag>
  );
};

export default AnimatedText;

'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import AnimatedText from './ui/AnimatedText';
import ScrollReveal from './ui/ScrollReveal';
import './About.css';

const About = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      <div className="about-ambient" aria-hidden="true" />
      <div className="container about-grid">
        <ScrollReveal variant="slide-left" className="about-image-wrap">
          <motion.div className="about-image glass-card" style={{ y: imageY }}>
            <img
              src="/images/MountainBreeze.jpg"
              alt="Mountain Breeze Villa, Ella"
              className="about-img"
            />
            <div className="about-image-overlay" />
          </motion.div>
        </ScrollReveal>

        <div className="about-content">
          <ScrollReveal variant="fade" delay={0.1}>
            <span className="section-label">Our Story</span>
          </ScrollReveal>

          <AnimatedText
            text="A Peaceful Escape in Ella"
            tag="h2"
            className="section-title about-title"
            splitBy="word"
            delay={0.2}
          />

          <ScrollReveal variant="blur" delay={0.4}>
            <p>
              Nestled among the misty hills of Ella, Mountain Breeze Villa offers a
              sanctuary where luxury meets sustainability. Our eco-friendly retreat is
              designed to harmonize with the surrounding mountains, tea plantations, and
              pristine nature.
            </p>
          </ScrollReveal>

          <ScrollReveal variant="blur" delay={0.5}>
            <p>
              Wake to birdsong, breathe fresh mountain air, and experience authentic Sri
              Lankan hospitality. We use solar energy, organic toiletries, and locally
              sourced materials to minimize our footprint while maximizing your comfort.
            </p>
          </ScrollReveal>

          <motion.ul
            className="about-features"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.6 } },
            }}
          >
            {[
              { icon: '🌱', text: '100% eco-conscious practices' },
              { icon: '🏔️', text: 'Panoramic mountain views' },
              { icon: '🍃', text: 'Surrounded by tea country' },
              { icon: '☕', text: 'Authentic Sri Lankan cuisine' },
            ].map((feature) => (
              <motion.li
                key={feature.text}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                <span className="about-feature-icon">{feature.icon}</span>
                {feature.text}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
};

export default About;
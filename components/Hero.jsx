'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import AnimatedText from './ui/AnimatedText';
import ParticleField from './ui/ParticleField';
import './Hero.css';

const slides = [
  {
    id: 1,
    image: '/images/hero-villa-mountains.jpg',
    alt: 'Mountain Breeze Villa with Ella mountain views',
    placeholder: 'Villa exterior with misty Ella mountains',
  },
  {
    id: 2,
    image: '/images/hero-tea-plantation.jpg',
    alt: 'Tea plantation near Ella',
    placeholder: 'Lush green tea plantation panorama',
  },
  {
    id: 4,
    image: '/images/MountainBreeze.jpg',
    alt: 'Mountain Breeze Villa',
    placeholder: 'Mountain Breeze Villa panorama',
  },
  {
    id: 5,
    image: '/images/hero-tea-plantation2.jpg',
    alt: 'Tea plantation vista',
    placeholder: 'Lush green tea fields',
  },
  {
    id: 3,
    image: '/images/hero-nature-retreat.jpg',
    alt: 'Peaceful nature retreat in Sri Lanka',
    placeholder: 'Serene nature path or cabana view',
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});

  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 800], [0, 200]);
  const contentY = useTransform(scrollY, [0, 600], [0, 100]);
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const handleImageError = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: false }));
  };

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section id="home" className="hero">
      {/* Background slides with parallax */}
      <AnimatePresence mode="wait">
        {slides.map(
          (slide, index) =>
            index === current && (
              <motion.div
                key={slide.id}
                className="hero-slide"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ y: backgroundY }}
              >
                {loadedImages[slide.id] !== false ? (
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    onLoad={() => handleImageLoad(slide.id)}
                    onError={() => handleImageError(slide.id)}
                  />
                ) : (
                  <div className="hero-placeholder image-placeholder">
                    {slide.placeholder}
                  </div>
                )}
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Gradient overlays */}
      <div className="hero-overlay" />
      <div className="hero-aurora" />

      {/* Floating mist particles */}
      <ParticleField count={25} />

      {/* Content */}
      <motion.div
        className="hero-content container"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <motion.span
            className="hero-eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Eco-Friendly Mountain Retreat
          </motion.span>

          <AnimatedText
            text="Mountain Breeze Villa"
            tag="h1"
            className="hero-title"
            splitBy="character"
            delay={1}
            stagger={0.03}
          />

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          >
            A cinematic escape into the heart of Ella, Sri Lanka — where luxury
            meets the whisper of mountains
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.8 }}
          >
            <a href="#contact" className="btn btn-primary btn-arrow hero-btn">
              Book Your Stay <span className="btn-icon">→</span>
            </a>
            <a href="#rooms" className="btn btn-glass hero-btn hero-btn-glass">
              Explore Rooms
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Slide dots */}
      <div className="hero-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-dot ${index === current ? 'active' : ''}`}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hero-scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <span>Scroll to explore</span>
        <motion.div
          className="scroll-line"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
};

export default Hero;

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import AnimatedText from './ui/AnimatedText';
import ParticleField from './ui/ParticleField';
import './Hero.css';

import api from '../lib/axios';
// Slides will be fetched dynamically from the DB

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [slides, setSlides] = useState([]);
  const [settings, setSettings] = useState(null);

  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 800], [0, 200]);
  const contentY = useTransform(scrollY, [0, 600], [0, 100]);
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, settingsRes] = await Promise.all([
          api.get('/hero'),
          api.get('/settings')
        ]);
        
        // Only keep active slides
        const activeSlides = heroRes.data.filter(s => s.isActive);
        setSlides(activeSlides);
        setSettings(settingsRes.data);
      } catch (e) {
        console.error('Failed to load hero data', e);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

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
                key={slide._id}
                className="hero-slide"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ y: backgroundY }}
              >
                {loadedImages[slide._id] !== false ? (
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title || 'Hero Slide'}
                    fill
                    priority={index === 0}
                    style={{ objectFit: 'cover' }}
                    sizes="100vw"
                    onLoad={() => handleImageLoad(slide._id)}
                    onError={() => handleImageError(slide._id)}
                    unoptimized={slide.imageUrl.startsWith('http')}
                  />
                ) : (
                  <div className="hero-placeholder image-placeholder">
                    {slide.subtitle || 'Mountain Breeze Villa'}
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
            {settings?.tagline || slides[current]?.subtitle || 'Eco-Friendly Mountain Retreat'}
          </motion.span>

          <AnimatedText
            text={slides[current]?.title || settings?.hotelName || 'Mountain Breeze Villa'}
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
            {settings?.description || 'A cinematic escape into the heart of Ella, Sri Lanka — where luxury meets the whisper of mountains'}
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

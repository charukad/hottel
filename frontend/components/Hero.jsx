'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Hero.css';

const slides = [  
  {
    id: 1,
    image: '/images/hero-villa-mountains.jpg',
    alt: 'Mountain Breeze Villa with Ella mountain views',
    placeholder: 'Add: Villa exterior with misty Ella mountains',
  },
  {
    id: 2,
    image: '/images/hero-tea-plantation.jpg',
    alt: 'Tea plantation near Ella',
    placeholder: 'Add: Lush green tea plantation panorama',
  },

  {
    id: 4,
    image: '/images/MountainBreeze.jpg',
    alt: 'Tea plantation near Ella',
    placeholder: 'Add: Lush green tea plantation panorama',
  },
  {
    id: 5,
    image: '/images/hero-tea-plantation2.jpg',
    alt: 'Tea plantation near Ella',
    placeholder: 'Add: Lush green tea plantation panorama',
  },
  {
    id: 3,
    image: '/images/hero-nature-retreat.jpg',
    alt: 'Peaceful nature retreat in Sri Lanka',
    placeholder: 'Add: Serene nature path or cabana view',
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
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
      <AnimatePresence mode="wait">
        {slides.map(
          (slide, index) =>
            index === current && (
              <motion.div
                key={slide.id}
                className="hero-slide"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2 }}
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
                <div className="hero-overlay" />
              </motion.div>
            )
        )}
      </AnimatePresence>

      <div className="hero-content container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <p className="hero-eyebrow">Eco-Friendly Mountain Retreat</p>
          <h1 className="hero-title">Mountain Breeze Villa – Ella</h1>
          <p className="hero-subtitle">
            Eco-friendly stay in the heart of Sri Lanka mountains
          </p>
          <div className="hero-buttons">
            <a href="#contact" className="btn btn-primary">
              Book Now
            </a>
            <a href="#rooms" className="btn btn-outline hero-btn-outline">
              Explore Rooms
            </a>
          </div>
        </motion.div>
      </div>

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
    </section>
  );
};

export default Hero;

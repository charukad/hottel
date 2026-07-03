'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/axios';
import './Navbar.css';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Events', href: '#events' },
  { label: 'About', href: '#about' },
  { label: 'Rooms', href: '#rooms' },
  { label: 'Services', href: '#services' },
  { label: 'Activities', href: '#activities' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [logoUrl, setLogoUrl] = useState('/images/logo.png');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data && data.logoUrl) {
          setLogoUrl(data.logoUrl);
        }
      } catch (e) {
        console.error('Failed to load logo', e);
      }
    };
    loadSettings();

    const handleScroll = () => setScrolled(window.scrollY > 50);

    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    navLinks.forEach((link) => {
      const section = document.querySelector(link.href);
      if (section) observer.observe(section);
    });

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleNavClick = () => setMenuOpen(false);

  return (
    <>
      <motion.nav
        className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
        initial={{ y: -100, opacity: 0, x: '-50%' }}
        animate={{ y: 0, opacity: 1, x: '-50%' }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="navbar-inner container">
          <a href="#home" className="navbar-logo">
            <Image 
              src={logoUrl} 
              alt="Mountain Breeze Villa" 
              width={160} 
              height={45} 
              className="navbar-logo-img"
              style={{ objectFit: 'contain' }}
              priority
            />
          </a>

          <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={handleNavClick}
                  className={activeSection === link.href.slice(1) ? 'active' : ''}
                >
                  {link.label}
                  {activeSection === link.href.slice(1) && (
                    <motion.span
                      className="nav-indicator"
                      layoutId="nav-indicator"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>

          <div className="navbar-actions">
            <a href="#contact" className="btn btn-primary navbar-cta">
              Book Now
              <span className="btn-icon">→</span>
            </a>
            <button
              className={`menu-toggle ${menuOpen ? 'menu-open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

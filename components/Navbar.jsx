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
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data) {
          if (data.logoUrl) setLogoUrl(data.logoUrl);
          setSettings(data);
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

  const hasSocial = (val) => val && val.trim() !== '' && val.trim() !== '#';

  const fixUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

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
            <div className="navbar-social">
              {hasSocial(settings?.socialFacebook) && (
                <a href={fixUrl(settings.socialFacebook)} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/></svg>
                </a>
              )}
              {hasSocial(settings?.socialInstagram) && (
                <a href={fixUrl(settings.socialInstagram)} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2.16c3.2,0,3.58,0,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85s0,3.58-.07,4.85c-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.64.07-4.85.07s-3.58,0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s0-3.58.07-4.85C2.38,3.85,3.89,2.31,7.15,2.16,8.42,2.1,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33,0,7.05.07c-4.27.2-6.78,2.71-6.98,6.98C0,8.33,0,8.74,0,12s0,3.67.07,4.95c.2,4.27,2.71,6.78,6.98,6.98,1.28.06,1.69.07,4.95.07s3.67,0,4.95-.07c4.27-.2,6.78-2.71,6.98-6.98C24,15.67,24,15.26,24,12s0-3.67-.07-4.95c-.2-4.27-2.71-6.78-6.98-6.98C15.67,0,15.26,0,12,0Zm0,5.83a6.17,6.17,0,1,0,6.17,6.17A6.17,6.17,0,0,0,12,5.83Zm0,10.16a4,4,0,1,1,4-4A4,4,0,0,1,12,16ZM18.4,4.16a1.44,1.44,0,1,0,1.44,1.44A1.44,1.44,0,0,0,18.4,4.16Z"/></svg>
                </a>
              )}
              {hasSocial(settings?.socialTripAdvisor) && (
                <a href={fixUrl(settings.socialTripAdvisor)} target="_blank" rel="noopener noreferrer" aria-label="TripAdvisor">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.16 7.42c-2.4-2.52-6.22-3.8-11.16-3.8s-8.76 1.28-11.16 3.8C.5 7.78.3 8.24.46 8.7c.14.44.52.74.98.78.46.04.88-.2 1.1-.64C4.38 5 8.1 3.96 12 3.96s7.62 1.04 9.46 4.88c.22.44.64.68 1.1.64.46-.04.84-.34.98-.78.16-.46-.04-.92-.38-1.28zM12 4.74c-4.46 0-8.56 1.76-11.66 4.62C.1 9.6-.08 9.98.02 10.36c.1.38.4.68.78.78h.04c.32 0 .6-.18.74-.46C4.4 7.9 8.04 6.22 12 6.22s7.6 1.68 10.42 4.46c.14.28.42.46.74.46h.04c.38-.1.68-.4.78-.78.1-.38-.08-.76-.32-1-3.1-2.86-7.2-4.62-11.66-4.62zm0 2.22c-3.14 0-6.14 1.12-8.56 3.06-.32.26-.44.7-.28 1.08.16.38.56.62.98.6h.04c.26 0 .5-.14.64-.38C6.88 9.5 9.38 8.44 12 8.44s5.12 1.06 7.18 2.88c.14.24.38.38.64.38h.04c.42.02.82-.22.98-.6.16-.38.04-.82-.28-1.08-2.42-1.94-5.42-3.06-8.56-3.06zM7.22 13.56a4.78 4.78 0 1 0 0 9.56 4.78 4.78 0 0 0 0-9.56zm0 8.08a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6zm9.56-8.08a4.78 4.78 0 1 0 0 9.56 4.78 4.78 0 0 0 0-9.56zm0 8.08a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6z"/></svg>
                </a>
              )}
              {hasSocial(settings?.socialWhatsapp) && (
                <a 
                  href={
                    settings.socialWhatsapp.startsWith('http') 
                      ? settings.socialWhatsapp 
                      : `https://wa.me/${settings.socialWhatsapp.replace(/[^0-9]/g, '')}`
                  } 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.03,0C5.39,0,0,5.39,0,12.03c0,2.12.55,4.19,1.6,6.01l-1.6,5.84,5.97-1.57c1.78.98,3.77,1.5,5.84,1.5,6.64,0,12.03-5.39,12.03-12.03S18.67,0,12.03,0Zm0,21.8c-1.8,0-3.56-.48-5.11-1.4l-.36-.21-3.8,1,1-3.7-.24-.38C2.5,15.42,2,13.75,2,12.03c0-5.54,4.51-10.04,10.04-10.04s10.04,4.5,10.04,10.04-4.51,10.03-10.05,10.03Zm5.5-7.5c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15s-.78.98-.96,1.18c-.18.2-.36.23-.66.08a8.18,8.18,0,0,1-2.42-1.5,9.08,9.08,0,0,1-1.67-2.08c-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53s-.68-1.63-.93-2.23c-.24-.59-.49-.51-.68-.52h-.58c-.2,0-.53.08-.8.38s-1.03,1-1.03,2.45,1.05,2.83,1.2,3.03c.15.2,2.06,3.15,5,4.42,2.07.9,2.94.97,4.01.81,1.22-.18,1.78-.73,2.06-1.43s.28-1.3.2-1.43c-.08-.13-.28-.2-.58-.35Z"/></svg>
                </a>
              )}
            </div>
            
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

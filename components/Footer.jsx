'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import api from '../lib/axios';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get('/settings').then(res => setSettings(res.data)).catch(console.error);
  }, []);

  const hasSocial = (val) => val && val.trim() !== '' && val.trim() !== '#';

  return (
    <footer className="footer">
      <div className="footer-aurora" aria-hidden="true" />
      <div className="container footer-inner">
        <motion.div
          className="footer-brand"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Image 
            src={settings?.logoUrl || "/images/logo.png"}
            alt={settings?.hotelName || "Mountain Breeze Villa"}
            width={160} 
            height={52} 
            className="footer-logo-img" 
            style={{ objectFit: 'contain' }}
            unoptimized={true}
          />
          <p>{settings?.tagline || "Eco-friendly luxury in the heart of Ella, Sri Lanka"}</p>
        </motion.div>

        <motion.div
          className="footer-links"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="footer-nav">
            <a href="#about">About</a>
            <a href="#rooms">Rooms</a>
            <a href="#activities">Activities</a>
            <a href="#gallery">Gallery</a>
            <a href="#contact">Contact</a>
          </div>
          
          <div className="footer-social" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'center' }}>
            {hasSocial(settings?.socialFacebook) && (
              <a href={settings.socialFacebook} target="_blank" rel="noopener noreferrer">Facebook</a>
            )}
            {hasSocial(settings?.socialInstagram) && (
              <a href={settings.socialInstagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            )}
            {hasSocial(settings?.socialTripAdvisor) && (
              <a href={settings.socialTripAdvisor} target="_blank" rel="noopener noreferrer">TripAdvisor</a>
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
              >
                WhatsApp
              </a>
            )}
          </div>
        </motion.div>

        <motion.p
          className="footer-copy"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          © {year} Mountain Breeze Villa. All rights reserved.
        </motion.p>
      </div>
    </footer>
  );
};

export default Footer;

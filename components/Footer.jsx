'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

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
            src="/images/logo.png" 
            alt="Mountain Breeze Villa" 
            width={160} 
            height={52} 
            className="footer-logo-img" 
            style={{ objectFit: 'contain' }}
          />
          <p>Eco-friendly luxury in the heart of Ella, Sri Lanka</p>
        </motion.div>

        <motion.div
          className="footer-links"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <a href="#about">About</a>
          <a href="#rooms">Rooms</a>
          <a href="#activities">Activities</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
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

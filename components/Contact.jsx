'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import ScrollReveal from './ui/ScrollReveal';
import MagneticButton from './ui/MagneticButton';
import api from '../lib/axios';
import './Contact.css';

const Contact = () => {
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    checkIn: '',
    checkOut: '',
    guests: '2',
    room: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        setSettings(data);
      } catch (e) {
        console.error('Failed to load contact settings', e);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Save inquiry to database for Admin dashboard
      await api.post('/inquiries', {
        name: form.name,
        email: form.email,
        phone: '', // Optional field we didn't include yet
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: Number(form.guests),
        roomType: form.room,
        message: form.message
      });

      // 2. Format for WhatsApp
      const text = encodeURIComponent(
        `Hello Mountain Breeze Villa!\n\n` +
          `Name: ${form.name}\n` +
          `Email: ${form.email}\n` +
          `Check-in: ${form.checkIn}\n` +
          `Check-out: ${form.checkOut}\n` +
          `Guests: ${form.guests}\n` +
          `Room: ${form.room || 'Any available'}\n` +
          `Message: ${form.message}`
      );

      // Extract Whatsapp number from settings or use fallback
      let phone = settings?.socialWhatsapp || settings?.contactPhone || '94710743192';
      // Clean non-numeric characters for WhatsApp link
      phone = phone.replace(/\D/g, '');
      if (phone.startsWith('0')) { phone = '94' + phone.substring(1); } // basic local to international format

      window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
      toast.success('Inquiry sent! Opening WhatsApp to complete your booking.');
      
      setForm({
        name: '', email: '', checkIn: '', checkOut: '', guests: '2', room: '', message: ''
      });
    } catch (e) {
      toast.error('Failed to send inquiry. Please try WhatsApp directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    let phone = settings?.socialWhatsapp || settings?.contactPhone || '94710743192';
    phone = phone.replace(/\D/g, '');
    if (phone.startsWith('0')) { phone = '94' + phone.substring(1); }
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent('Hello! I would like to inquire about a stay at Mountain Breeze Villa.')}`,
      '_blank'
    );
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-ambient" aria-hidden="true" />
      <div className="container">
        <ScrollReveal variant="fade">
          <div className="section-header">
            <span className="section-label">Get in Touch</span>
            <h2 className="section-title">Contact & Booking</h2>
            <p className="section-subtitle">
              We'd love to welcome you to our mountain retreat
            </p>
          </div>
        </ScrollReveal>

        <div className="contact-grid">
          <ScrollReveal variant="slide-left" delay={0.1}>
            <div className="contact-info">
              <div className="contact-card glass-card">
                <h3>Reach Us</h3>
                <button className="btn btn-whatsapp contact-whatsapp" onClick={openWhatsApp}>
                  💬 Chat on WhatsApp
                </button>
                <a href={`mailto:${settings?.contactEmail || 'info@mountainbreezevilla.com'}`} className="contact-link">
                  ✉️ {settings?.contactEmail || 'info@mountainbreezevilla.com'}
                </a>
                <p className="contact-address">
                  📍 {settings?.contactAddress || 'Mountain Breeze Villa, Ella, Uva Province, Sri Lanka'}
                </p>
              </div>

              <div className="contact-map glass-card">
                {settings?.googleMapsUrl ? (
                  <div style={{ position: 'relative', width: '100%', height: '280px', borderRadius: '16px', overflow: 'hidden' }}>
                    <iframe
                      title="Mountain Breeze Villa Location"
                      src={settings.googleMapsUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                    {settings?.googlePlaceShareLink && (
                      <a 
                        href={settings.googlePlaceShareLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-primary" 
                        style={{ position: 'absolute', bottom: '1rem', right: '1rem', padding: '0.6rem 1.2rem', fontSize: '0.85rem', boxShadow: '0 4px 16px rgba(0,0,0,0.25)', zIndex: 10 }}
                      >
                        📍 Open in Google Maps
                      </a>
                    )}
                  </div>
                ) : (
                  <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', borderRadius: '16px' }}>
                    <p>Map loading...</p>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="slide-right" delay={0.2}>
            <form className="booking-form glass-card" onSubmit={handleSubmit}>
              <h3>Booking Inquiry</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="checkIn">Check-in</label>
                  <input
                    id="checkIn"
                    name="checkIn"
                    type="date"
                    required
                    value={form.checkIn}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="checkOut">Check-out</label>
                  <input
                    id="checkOut"
                    name="checkOut"
                    type="date"
                    required
                    value={form.checkOut}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="guests">Guests</label>
                  <select id="guests" name="guests" value={form.guests} onChange={handleChange}>
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="room">Preferred Room</label>
                  <select id="room" name="room" value={form.room} onChange={handleChange}>
                    <option value="">Any available</option>
                    <option value="Deluxe Double">Deluxe Double Room</option>
                    <option value="Superior">Superior Room</option>
                    <option value="Family">Family Room</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Any special requests or questions..."
                />
              </div>
              <MagneticButton className="btn-primary form-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Booking Inquiry'} <span className="btn-icon">→</span>
              </MagneticButton>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default Contact;

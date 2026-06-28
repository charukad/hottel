'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import './Contact.css';

const WHATSAPP_NUMBER = '94710743192';
const EMAIL = 'info@mountainbreezevilla.com';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    checkIn: '',
    checkOut: '',
    guests: '2',
    room: '',
    message: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
    toast.success('Opening WhatsApp to complete your booking!');
  };

  const openWhatsApp = () => {
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello! I would like to inquire about a stay at Mountain Breeze Villa.')}`,
      '_blank'
    );
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Get in Touch</span>
          <h2 className="section-title">Contact & Booking</h2>
          <p className="section-subtitle">
            We'd love to welcome you to our mountain retreat
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-card card">
              <h3>Reach Us</h3>
              <button className="btn btn-whatsapp contact-whatsapp" onClick={openWhatsApp}>
                💬 Chat on WhatsApp
              </button>
              <a href={`mailto:${EMAIL}`} className="contact-link">
                ✉️ {EMAIL}
              </a>
              <p className="contact-address">
                📍 Mountain Breeze Villa<br />
                Ella, Uva Province<br />
                Sri Lanka
              </p>
            </div>

            <div className="contact-map card">
            <iframe
  title="Mountain Breeze Villa Location"
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.6639558508577!2d81.0418814!3d6.9307091!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae46302a36714eb%3A0xed85eb8b9de667a8!2sMountain%20Breeze%20Villa!5e0!3m2!1sen!2slk!4v1782627947723!5m2!1sen!2slk"
  width="100%"
  height="280"
  style={{
    border: 0,
    borderRadius: "12px",
  }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="strict-origin-when-cross-origin"
/>
</div>
          </div>

          <form className="booking-form card" onSubmit={handleSubmit}>
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
            <button type="submit" className="btn btn-primary form-submit">
              Send Booking via WhatsApp
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;

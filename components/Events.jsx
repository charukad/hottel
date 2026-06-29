'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import ScrollReveal from './ui/ScrollReveal';
import './Events.css';

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const Events = ({ events = [] }) => {
  if (events.length === 0) return null;

  return (
    <section id="events" className="events-section">
      <div className="container">
        <ScrollReveal variant="fade">
          <div className="section-header">
            <span className="section-label">What's Happening</span>
            <h2 className="section-title">Upcoming Events</h2>
            <p className="section-subtitle">
              Special experiences and gatherings at Mountain Breeze Villa
            </p>
          </div>
        </ScrollReveal>

        <div className="events-grid">
          {events.map((event, index) => (
            <ScrollReveal key={event._id} variant="scale" delay={index * 0.1}>
              <motion.article
                className="event-card glass-card"
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="event-image">
                  {event.imageUrl ? (
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="image-placeholder">
                      Add event image via Admin Panel
                    </div>
                  )}
                  <span className="event-date-badge glass">{formatDate(event.date)}</span>
                </div>
                <div className="event-body">
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                </div>
              </motion.article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;

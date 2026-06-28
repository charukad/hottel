'use client';

import { motion } from 'framer-motion';
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
  if (events.length === 0) {
    return null;
  }

  return (
    <section id="events" className="events-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">What's Happening</span>
          <h2 className="section-title">Upcoming Events</h2>
          <p className="section-subtitle">
            Special experiences and gatherings at Mountain Breeze Villa
          </p>
        </div>

        <div className="events-grid">
          {events.map((event, index) => (
            <motion.article
              key={event._id}
              className="event-card card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="event-image">
                {event.imageUrl ? (
                  <img src={event.imageUrl} alt={event.title} />
                ) : (
                  <div className="image-placeholder">
                    Add event image via Admin Panel
                  </div>
                )}
                <span className="event-date-badge">{formatDate(event.date)}</span>
              </div>
              <div className="event-body">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;

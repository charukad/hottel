'use client';

import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ScrollReveal from './ui/ScrollReveal';
import GlassCard from './ui/GlassCard';
import MagneticButton from './ui/MagneticButton';
import './Rooms.css';
import './ui/GlassCard.css';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(price);

const Rooms = ({ rooms = [] }) => {
  const handleBook = (roomName) => {
    toast.success(`Booking inquiry for ${roomName} — contact us via WhatsApp!`);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (rooms.length === 0) return null;

  return (
    <section id="rooms" className="rooms-section">
      <div className="rooms-ambient" aria-hidden="true" />
      <div className="container">
        <ScrollReveal variant="fade">
          <div className="section-header">
            <span className="section-label">Accommodation</span>
            <h2 className="section-title">Our Rooms</h2>
            <p className="section-subtitle">
              Four thoughtfully designed rooms blending comfort with nature
            </p>
          </div>
        </ScrollReveal>

        <div className="rooms-grid">
          {rooms.map((room, index) => (
            <ScrollReveal
              key={room._id}
              variant={index % 2 === 0 ? 'slide-up' : 'blur'}
              delay={index * 0.12}
            >
              <GlassCard className="room-card" tilt={true} glow={true}>
                <div className="room-image">
                  {room.image ? (
                    <img
                      src={room.image}
                      alt={room.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="image-placeholder room-placeholder"
                    style={{ display: room.image ? 'none' : 'flex' }}
                  >
                    Add: {room.type} room photo
                  </div>
                  <span className="room-type-badge glass">{room.type}</span>
                </div>
                <div className="room-body">
                  <h3>{room.name}</h3>
                  <p className="room-desc">{room.description}</p>
                  <ul className="room-features">
                    {(room.features || []).map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <div className="room-footer">
                    <span className="room-price">
                      {formatPrice(room.price)}
                      <small>/ night</small>
                    </span>
                    <MagneticButton
                      className="btn-primary"
                      onClick={() => handleBook(room.name)}
                    >
                      Book Now <span className="btn-icon">→</span>
                    </MagneticButton>
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Rooms;

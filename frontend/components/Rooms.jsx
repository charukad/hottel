'use client';

import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import './Rooms.css';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(price);

const Rooms = ({ rooms = [] }) => {
  const handleBook = (roomName) => {
    toast.success(`Booking inquiry for ${roomName} — contact us via WhatsApp!`);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (rooms.length === 0) {
    return null;
  }

  return (
    <section id="rooms" className="rooms-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Accommodation</span>
          <h2 className="section-title">Our Rooms</h2>
          <p className="section-subtitle">
            Four thoughtfully designed rooms blending comfort with nature
          </p>
        </div>

        <div className="rooms-grid">
          {rooms.map((room, index) => (
            <motion.article
              key={room._id}
              className="room-card card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
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
                <span className="room-type-badge">{room.type}</span>
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
                  <button className="btn btn-primary" onClick={() => handleBook(room.name)}>
                    Book Now
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Rooms;

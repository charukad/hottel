import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/axios';
import LoadingSpinner from './LoadingSpinner';
import './Rooms.css';

const fallbackRooms = [
  {
    _id: '1',
    name: 'Deluxe Double Room 1',
    type: 'Deluxe Double',
    description: 'Spacious double room with panoramic mountain views and eco-friendly amenities.',
    price: 8500,
    features: ['King Bed', 'Mountain View', 'Private Balcony', 'Eco Toiletries'],
    image: '/images/room-deluxe-1.jpg',
  },
  {
    _id: '2',
    name: 'Deluxe Double Room 2',
    type: 'Deluxe Double',
    description: 'Elegant double room surrounded by lush greenery, perfect for couples.',
    price: 8500,
    features: ['King Bed', 'Garden View', 'Rain Shower', 'Organic Linens'],
    image: '/images/room-deluxe-2.jpg',
  },
  {
    _id: '3',
    name: 'Superior Room',
    type: 'Superior',
    description: 'Premium room with elevated views of Ella\'s misty peaks.',
    price: 12000,
    features: ['Queen Bed', 'Panoramic View', 'Sitting Area', 'Mini Bar'],
    image: '/images/room-superior.jpg',
  },
  {
    _id: '4',
    name: 'Family Room',
    type: 'Family',
    description: 'Generous family suite ideal for exploring Ella together.',
    price: 15000,
    features: ['Double + Single Bed', 'Living Space', 'Mountain View', 'Extra Storage'],
    image: '/images/room-family.jpg',
  },
];

const formatPrice = (price) =>
  new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(price);

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await api.get('/rooms');
        if (data.length) {
          setRooms(
            data.map((room, i) => ({
              ...room,
              image: room.images?.[0] || fallbackRooms[i]?.image,
            }))
          );
        } else {
          setRooms(fallbackRooms);
        }
      } catch {
        setRooms(fallbackRooms);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleBook = (roomName) => {
    toast.success(`Booking inquiry for ${roomName} — contact us via WhatsApp!`);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <section id="rooms" className="rooms-section">
        <div className="container">
          <LoadingSpinner fullScreen />
        </div>
      </section>
    );
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

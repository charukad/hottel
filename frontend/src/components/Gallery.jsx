import { motion } from 'framer-motion';
import './Gallery.css';

const galleryImages = [
  { src: '/images/gallery-1.jpg', alt: 'Villa exterior', placeholder: 'Villa exterior at sunrise' },
  { src: '/images/gallery-2.jpg', alt: 'Mountain view', placeholder: 'Panoramic Ella mountain view' },
  { src: '/images/gallery-3.jpg', alt: 'Room interior', placeholder: 'Cozy room interior' },
  { src: '/images/gallery-4.jpg', alt: 'Garden', placeholder: 'Villa garden with flowers' },
  { src: '/images/gallery-5.jpg', alt: 'Dining area', placeholder: 'Outdoor dining area' },
  { src: '/images/gallery-6.jpg', alt: 'Sunset', placeholder: 'Sunset over the hills' },
  { src: '/images/gallery-7.jpg', alt: 'Tea fields', placeholder: 'Nearby tea fields' },
  { src: '/images/gallery-8.jpg', alt: 'Nature path', placeholder: 'Forest nature path' },
];

const Gallery = () => {
  return (
    <section id="gallery" className="gallery-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Visual Journey</span>
          <h2 className="section-title">Gallery</h2>
          <p className="section-subtitle">
            Glimpses of Mountain Breeze Villa and the beauty of Ella
          </p>
        </div>

        <div className="gallery-grid">
          {galleryImages.map((item, index) => (
            <motion.div
              key={item.src}
              className={`gallery-item ${index === 0 ? 'gallery-item-large' : ''}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={item.src}
                alt={item.alt}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="image-placeholder gallery-placeholder" style={{ display: 'none' }}>
                Add: {item.placeholder}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;

'use client';

import { motion } from 'framer-motion';
import './Gallery.css';

const fixedGalleryImages = [
  { id: 'fixed-1', src: '/images/gallery-1.jpg', alt: 'Villa exterior', placeholder: 'Villa exterior at sunrise', isFixed: true },
  { id: 'fixed-2', src: '/images/gallery-2.jpg', alt: 'Mountain view', placeholder: 'Panoramic Ella mountain view', isFixed: true },
  { id: 'fixed-3', src: '/images/gallery-3.jpg', alt: 'Room interior', placeholder: 'Cozy room interior', isFixed: true },
  { id: 'fixed-4', src: '/images/gallery-4.jpg', alt: 'Garden', placeholder: 'Villa garden with flowers', isFixed: true },
  { id: 'fixed-5', src: '/images/gallery-5.jpg', alt: 'Dining area', placeholder: 'Outdoor dining area', isFixed: true },
  { id: 'fixed-6', src: '/images/gallery-6.jpg', alt: 'Sunset', placeholder: 'Sunset over the hills', isFixed: true },
  { id: 'fixed-7', src: '/images/gallery-7.jpg', alt: 'Tea fields', placeholder: 'Nearby tea fields', isFixed: true },
  { id: 'fixed-8', src: '/images/gallery-8.jpg', alt: 'Nature path', placeholder: 'Forest nature path', isFixed: true },
];

const Gallery = ({ additionalImages = [] }) => {
  const adminImages = additionalImages.map((image) => ({
    id: image._id,
    src: image.imageUrl,
    alt: image.alt,
    placeholder: image.alt,
  }));

  const galleryImages = [...fixedGalleryImages, ...adminImages];

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
              key={item.id}
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
                {item.isFixed ? `Add: ${item.placeholder}` : item.placeholder}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;

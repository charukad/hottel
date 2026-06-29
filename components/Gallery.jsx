'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import ScrollReveal from './ui/ScrollReveal';
import './Gallery.css';

const fixedGalleryImages = [
  { id: 'fixed-1', src: '/images/gallery-1.jpg', alt: 'Villa exterior', isFixed: true },
  { id: 'fixed-2', src: '/images/gallery-2.jpg', alt: 'Mountain view', isFixed: true },
  { id: 'fixed-3', src: '/images/gallery-3.jpg', alt: 'Room interior', isFixed: true },
  { id: 'fixed-4', src: '/images/gallery-4.jpg', alt: 'Garden', isFixed: true },
  { id: 'fixed-5', src: '/images/gallery-5.jpg', alt: 'Dining area', isFixed: true },
  { id: 'fixed-6', src: '/images/gallery-6.jpg', alt: 'Sunset', isFixed: true },
  { id: 'fixed-7', src: '/images/gallery-7.jpg', alt: 'Tea fields', isFixed: true },
  { id: 'fixed-8', src: '/images/gallery-8.jpg', alt: 'Nature path', isFixed: true },
];

const Gallery = ({ additionalImages = [] }) => {
  const adminImages = additionalImages.map((image) => ({
    id: image._id,
    src: image.imageUrl,
    alt: image.alt,
  }));

  const galleryImages = [...fixedGalleryImages, ...adminImages];

  return (
    <section id="gallery" className="gallery-section">
      <div className="container">
        <ScrollReveal variant="fade">
          <div className="section-header">
            <span className="section-label">Visual Journey</span>
            <h2 className="section-title">Gallery</h2>
            <p className="section-subtitle">
              Glimpses of Mountain Breeze Villa and the beauty of Ella
            </p>
          </div>
        </ScrollReveal>

        <div className="gallery-masonry">
          {galleryImages.map((item, index) => (
            <motion.div
              key={item.id}
              className={`gallery-item ${index === 0 || index === 5 ? 'gallery-item-tall' : ''} ${index === 3 ? 'gallery-item-wide' : ''}`}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: index * 0.04, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                style={{ objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="image-placeholder gallery-placeholder" style={{ display: 'none' }}>
                {item.isFixed ? `Add: ${item.alt}` : item.alt}
              </div>
              <div className="gallery-item-overlay">
                <span>{item.alt}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;

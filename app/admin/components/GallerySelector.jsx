"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import '../styles/GallerySelector.css';

export default function GallerySelector({ onSelect, onClose }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data } = await api.get('/gallery');
        setImages(data);
      } catch {
        toast.error('Failed to load gallery images');
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="modal-overlay gallery-selector-overlay" onClick={onClose}>
      <div className="modal-content gallery-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Select Image from Gallery</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        
        {loading ? (
          <div className="spinner" />
        ) : images.length === 0 ? (
          <div className="empty-state">
            <p>No images found in the gallery. Upload some first!</p>
          </div>
        ) : (
          <div className="gallery-grid-selector">
            {images.map((img) => (
              <div 
                key={img._id} 
                className="gallery-item-selector"
                onClick={() => onSelect(img.imageUrl)}
              >
                <img src={img.imageUrl} alt={img.alt} loading="lazy" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

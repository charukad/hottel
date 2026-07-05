"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import '../styles/FormModal.css'; // Reuse modal styles
import '../styles/Media.css'; // Reuse media grid styles

export default function MediaSelector({ onSelect, onClose }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const { data } = await api.get('/media');
      setMedia(data);
    } catch (err) {
      setError('Failed to load media library');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '800px' }}>
        <h3>Select Media</h3>
        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="spinner" />
        ) : (
          <div className="media-grid" style={{ marginTop: '1rem', maxHeight: '50vh', overflowY: 'auto' }}>
            {media.length === 0 && <p>No media found. Go to the Media Library to upload some.</p>}
            {media.map((item) => {
              const isVideo = item.url.match(/\.(mp4|webm|ogg)$/i);
              return (
                <div 
                  key={item._id} 
                  className="media-card" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelect(item)}
                >
                  <div className="media-thumbnail">
                    {isVideo ? (
                      <video src={item.url} muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <img src={item.url} alt={item.altText} loading="lazy" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

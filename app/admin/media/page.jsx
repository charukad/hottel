"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import '../styles/Media.css';

export default function MediaDashboard() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
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

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      // Upload sequentially for simplicity, but could be parallelized
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('altText', file.name);
        formData.append('folder', 'library');
        await api.post('/media', formData);
      }
      await fetchMedia();
    } catch (err) {
      setError('Failed to upload some images');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image? It might be in use.')) return;
    try {
      await api.delete(`/media/${id}`);
      setMedia(media.filter(m => m._id !== id));
    } catch (err) {
      setError('Failed to delete image');
    }
  };

  return (
    <div className="admin-page media-dashboard">
      <div className="page-header">
        <h2>Media Library</h2>
        <div className="header-actions">
          <label className="btn btn-primary upload-btn">
            {uploading ? 'Uploading...' : 'Upload Media'}
            <input 
              type="file" 
              accept="image/*,video/*" 
              multiple 
              onChange={handleUpload} 
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="media-grid">
          {media.length === 0 && <p>No media found. Upload some images!</p>}
            {media.map((item) => {
              const isVideo = item.url.match(/\.(mp4|webm|ogg)$/i);
              return (
                <div key={item._id} className="media-card">
                  <div className="media-thumbnail">
                    {isVideo ? (
                      <video src={item.url} muted loop playsInline onMouseEnter={(e) => e.target.play()} onMouseLeave={(e) => e.target.pause()} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <img src={item.url} alt={item.altText} loading="lazy" />
                    )}
                  </div>
                  <div className="media-actions">
                    <button onClick={() => handleDelete(item._id)} className="btn btn-danger btn-sm">Delete</button>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(item.url);
                        alert('URL Copied!');
                      }} 
                      className="btn btn-outline btn-sm"
                    >
                      Copy URL
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

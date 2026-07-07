"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import '../styles/GalleryForm.css';

import MediaSelector from './MediaSelector';

const GalleryForm = ({ image, onClose, onSuccess }) => {
  const isEdit = !!image;
  const [form, setForm] = useState({
    alt: image?.alt || '',
    order: image?.order ?? 0,
  });
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [preview, setPreview] = useState(image?.imageUrl || '');
  const [submitting, setSubmitting] = useState(false);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'order' ? Number(value) : value });
  };

  const handleMediaSelect = (mediaItem) => {
    setPreview(mediaItem.url);
    if (!form.alt) {
      setForm((prev) => ({ ...prev, alt: mediaItem.altText }));
    }
    setShowMediaSelector(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEdit && !preview) {
      toast.error('Please select an image from the Media Library');
      return;
    }

    setSubmitting(true);

    try {
      if (isEdit) {
        await api.put(`/gallery/${image._id}`, {
          alt: form.alt,
          order: form.order,
          imageUrl: preview, // If changed
        });
        toast.success('Gallery image updated');
      } else {
        await api.post('/gallery', {
          alt: form.alt,
          order: form.order,
          imageUrl: preview,
        });
        toast.success('Gallery image added');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save gallery image');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Gallery Image' : 'Add Gallery Image'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="gallery-alt">Description</label>
            <input
              id="gallery-alt"
              name="alt"
              value={form.alt}
              onChange={handleChange}
              required
              placeholder="e.g. Sunset view from the villa terrace"
            />
          </div>

          <div className="form-group">
            <label htmlFor="gallery-order">Display order</label>
            <input
              id="gallery-order"
              name="order"
              type="number"
              min="0"
              value={form.order}
              onChange={handleChange}
            />
            <small className="form-hint">Lower numbers appear first among admin-added images</small>
          </div>

          <div className="form-group">
            <label>Image</label>
            <div style={{ marginBottom: '1rem' }}>
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => setShowMediaSelector(true)}
              >
                Select from Media Library
              </button>
            </div>
            {preview && <img src={preview} alt="Preview" className="image-preview" />}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : isEdit ? 'Update Image' : 'Add Image'}
            </button>
          </div>
        </form>
        </div>
      </div>
      
      {showMediaSelector && (
        <MediaSelector 
          onSelect={handleMediaSelect} 
          onClose={() => setShowMediaSelector(false)} 
        />
      )}
    </>
  );
};

export default GalleryForm;

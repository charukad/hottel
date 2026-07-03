"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import GallerySelector from './GallerySelector';
import '../styles/EventForm.css'; // Reusing EventForm styles as the structure is similar

const RoomForm = ({ room, onClose, onSuccess }) => {
  const isEdit = !!room;
  const [form, setForm] = useState({
    name: room?.name || '',
    type: room?.type || '',
    price: room?.price || '',
    description: room?.description || '',
    features: room?.features?.join(', ') || '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(room?.images?.[0] || '');
  const [submitting, setSubmitting] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedGalleryUrl, setSelectedGalleryUrl] = useState('');

  // Clean up blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
      setImage(file);
      setSelectedGalleryUrl('');
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleGallerySelect = (url) => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setImage(null);
    setSelectedGalleryUrl(url);
    setPreview(url);
    setShowGallery(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('type', form.type);
    formData.append('price', form.price);
    formData.append('description', form.description);
    
    // Convert comma-separated string back to array
    const featuresArray = form.features
      .split(',')
      .map(f => f.trim())
      .filter(f => f);
    formData.append('features', JSON.stringify(featuresArray));

    if (image) {
      formData.append('image', image);
    } else if (selectedGalleryUrl) {
      formData.append('imageUrl', selectedGalleryUrl);
    } else if (preview && isEdit) {
      formData.append('imageUrl', preview);
    }

    try {
      if (isEdit) {
        await api.put(`/rooms/${room._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Room updated successfully');
      } else {
        await api.post('/rooms', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Room created successfully');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save room');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Room' : 'Create Room'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="room-name">Name</label>
            <input id="room-name" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Mountain View Deluxe" />
          </div>
          
          <div className="form-group">
            <label htmlFor="room-type">Type</label>
            <input id="room-type" name="type" value={form.type} onChange={handleChange} required placeholder="e.g. Deluxe Double" />
          </div>

          <div className="form-group">
            <label htmlFor="room-price">Price (LKR)</label>
            <input id="room-price" name="price" type="number" value={form.price} onChange={handleChange} required placeholder="15000" />
          </div>

          <div className="form-group">
            <label htmlFor="room-description">Description</label>
            <textarea id="room-description" name="description" value={form.description} onChange={handleChange} required rows="3" />
          </div>

          <div className="form-group">
            <label htmlFor="room-features">Features (comma separated)</label>
            <input id="room-features" name="features" value={form.features} onChange={handleChange} placeholder="e.g. King Bed, Balcony, Mountain View" />
          </div>

          <div className="form-group">
            <label>Room Image</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input id="room-image" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              <button type="button" className="btn btn-outline" onClick={() => document.getElementById('room-image').click()}>
                Upload File
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setShowGallery(true)}>
                Select from Gallery
              </button>
            </div>
            {preview && (
              <img src={preview} alt="Preview" className="image-preview" style={{ marginTop: '10px' }} />
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : isEdit ? 'Update Room' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>

      {showGallery && (
        <GallerySelector 
          onClose={() => setShowGallery(false)}
          onSelect={handleGallerySelect}
        />
      )}
    </div>
  );
};

export default RoomForm;

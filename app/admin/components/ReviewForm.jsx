"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import '../styles/FormModal.css';

export default function ReviewForm({ review, onClose, onSuccess }) {
  const isEdit = !!review;
  
  const [formData, setFormData] = useState({
    guestName: review?.guestName || '',
    text: review?.text || '',
    rating: review?.rating || 5,
    source: review?.source || 'Direct',
    isActive: review != null ? review.isActive : true
  });
  
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.guestName || !formData.text) {
      toast.error('Guest name and review text are required');
      return;
    }

    setSaving(true);
    
    try {
      if (isEdit) {
        await api.put(`/reviews/${review._id}`, formData);
        toast.success('Review updated');
      } else {
        await api.post('/reviews', formData);
        toast.success('Review created');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save review');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEdit ? 'Edit Review' : 'Add Review'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group row">
            <div className="form-col" style={{ flex: 2 }}>
              <label>Guest Name</label>
              <input type="text" name="guestName" value={formData.guestName} onChange={handleChange} required />
            </div>
            <div className="form-col" style={{ flex: 1 }}>
              <label>Rating (1-5)</label>
              <input type="number" name="rating" min="1" max="5" value={formData.rating} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Review Text</label>
            <textarea name="text" value={formData.text} onChange={handleChange} rows="4" required />
          </div>

          <div className="form-group row">
            <div className="form-col">
              <label>Source (e.g. TripAdvisor, Google)</label>
              <input type="text" name="source" value={formData.source} onChange={handleChange} />
            </div>
            <div className="form-col checkbox-col">
              <label>
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                Show on Website
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

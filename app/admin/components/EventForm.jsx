"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import MediaSelector from './MediaSelector';
import '../styles/EventForm.css';

const EventForm = ({ event, onClose, onSuccess }) => {
  const isEdit = !!event;
  const [form, setForm] = useState({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date ? new Date(event.date).toISOString().split('T')[0] : '',
  });
  const [preview, setPreview] = useState(event?.imageUrl || '');
  const [submitting, setSubmitting] = useState(false);
  const [showMediaSelector, setShowMediaSelector] = useState(false);

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

  const handleMediaSelect = (mediaItem) => {
    setPreview(mediaItem.url);
    setShowMediaSelector(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('date', form.date);
    if (preview) {
      formData.append('imageUrl', preview);
    }

    try {
      if (isEdit) {
        await api.put(`/events/${event._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Event updated successfully');
      } else {
        await api.post('/events', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Event created successfully');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Event' : 'Create Event'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="event-title">Title</label>
            <input
              id="event-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Event title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="event-description">Description</label>
            <textarea
              id="event-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Event description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="event-date">Date</label>
            <input
              id="event-date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Event Image</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button type="button" className="btn btn-primary" onClick={() => setShowMediaSelector(true)}>
                Select from Media Library
              </button>
            </div>
            {preview && (
              <img src={preview} alt="Preview" className="image-preview" style={{ marginTop: '10px' }} />
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>

      {showMediaSelector && (
        <MediaSelector 
          onClose={() => setShowMediaSelector(false)}
          onSelect={handleMediaSelect}
        />
      )}
    </div>
  );
};

export default EventForm;

"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import api from '../api/axios';
import '../styles/FormModal.css';

export default function ActivityForm({ activity, onClose, onSuccess }) {
  const isEdit = !!activity;
  
  const [formData, setFormData] = useState({
    title: activity?.title || '',
    description: activity?.description || '',
    order: activity?.order || 0,
    isActive: activity ? activity.isActive : true
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(activity?.imageUrl || '');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEdit && !imageFile) {
      toast.error('An image is required for new activities');
      return;
    }

    setSaving(true);
    
    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('order', formData.order);
    payload.append('isActive', formData.isActive);
    if (imageFile) {
      payload.append('image', imageFile);
    }

    try {
      if (isEdit) {
        await api.put(`/activities/${activity._id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Activity updated');
      } else {
        await api.post('/activities', payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Activity created');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save activity');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEdit ? 'Edit Activity' : 'Add Activity'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Image Upload</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {preview && (
              <div style={{ position: 'relative', width: '100%', height: '150px', marginTop: '1rem' }}>
                <Image src={preview} alt="Preview" fill style={{ objectFit: 'cover', borderRadius: '4px' }} unoptimized={preview.startsWith('http')} />
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label>Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Ella Rock Hike" required />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" required />
          </div>

          <div className="form-group row">
            <div className="form-col">
              <label>Display Order</label>
              <input type="number" name="order" value={formData.order} onChange={handleChange} />
            </div>
            <div className="form-col checkbox-col">
              <label>
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                Active Activity
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

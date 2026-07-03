"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import api from '../api/axios';
import '../styles/FormModal.css';

export default function HeroForm({ slide, onClose, onSuccess }) {
  const isEdit = !!slide;
  
  const [formData, setFormData] = useState({
    title: slide?.title || '',
    subtitle: slide?.subtitle || '',
    order: slide?.order || 0,
    isActive: slide !== undefined ? slide.isActive : true
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(slide?.imageUrl || '');
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
      toast.error('An image is required for new slides');
      return;
    }

    setSaving(true);
    
    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('subtitle', formData.subtitle);
    payload.append('order', formData.order);
    payload.append('isActive', formData.isActive);
    if (imageFile) {
      payload.append('image', imageFile);
    }

    try {
      if (isEdit) {
        await api.put(`/hero/${slide._id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Slide updated');
      } else {
        await api.post('/hero', payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Slide created');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save slide');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEdit ? 'Edit Hero Slide' : 'Add Hero Slide'}</h2>
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
            <label>Headline (Title)</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Mountain Breeze Villa" />
          </div>

          <div className="form-group">
            <label>Sub-Headline</label>
            <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} placeholder="e.g. Eco-Friendly Mountain Retreat" />
          </div>

          <div className="form-group row">
            <div className="form-col">
              <label>Display Order</label>
              <input type="number" name="order" value={formData.order} onChange={handleChange} />
            </div>
            <div className="form-col checkbox-col">
              <label>
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                Active Slide
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Slide'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

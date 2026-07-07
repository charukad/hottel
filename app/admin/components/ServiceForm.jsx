"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import '../styles/FormModal.css';

export default function ServiceForm({ service, onClose, onSuccess }) {
  const isEdit = !!service;
  
  const [formData, setFormData] = useState({
    title: service?.title || '',
    description: service?.description || '',
    icon: service?.icon || '',
    imageUrl: service?.imageUrl || '',
    order: service?.order || 0,
    isActive: service ? service.isActive : true
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(service?.imageUrl || null);
  
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
    if (!formData.title || !formData.description) {
      toast.error('Title and description are required');
      return;
    }

    setSaving(true);
    
    let finalImageUrl = formData.imageUrl;

    try {
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        uploadData.append('folder', 'services');
        const { data: uploadRes } = await api.post('/media', uploadData);
        finalImageUrl = uploadRes.url;
      }

      const payload = { ...formData, imageUrl: finalImageUrl };

      if (isEdit) {
        await api.put(`/services/${service._id}`, payload);
        toast.success('Service updated');
      } else {
        await api.post('/services', payload);
        toast.success('Service created');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEdit ? 'Edit Service' : 'Add Service'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" required />
          </div>

          <div className="form-group row">
            <div className="form-col">
              <label>Service Image</label>
              <input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }} />
              {imagePreview && (
                <div style={{ marginTop: '0.5rem' }}>
                  <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                  <button type="button" className="btn btn-sm" style={{ color: 'red', display: 'block', padding: 0 }} onClick={() => { setImageFile(null); setImagePreview(null); setFormData(p => ({...p, imageUrl: ''}))}}>Remove Image</button>
                </div>
              )}
            </div>
            <div className="form-col">
              <label>OR SVG Icon Code</label>
              <textarea name="icon" value={formData.icon} onChange={handleChange} rows="3" placeholder="<svg>...</svg>" />
              <small className="help-text">Paste the raw SVG HTML code here. You can find free SVG icons online.</small>
            </div>
          </div>

          <div className="form-group row">
            <div className="form-col">
              <label>Display Order</label>
              <input type="number" name="order" value={formData.order} onChange={handleChange} />
            </div>
            <div className="form-col checkbox-col">
              <label>
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                Active Service
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

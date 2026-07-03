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
    order: service?.order || 0,
    isActive: service !== undefined ? service.isActive : true
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
    if (!formData.title || !formData.description) {
      toast.error('Title and description are required');
      return;
    }

    setSaving(true);
    
    try {
      if (isEdit) {
        await api.put(`/services/${service._id}`, formData);
        toast.success('Service updated');
      } else {
        await api.post('/services', formData);
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

          <div className="form-group">
            <label>SVG Icon Code</label>
            <textarea name="icon" value={formData.icon} onChange={handleChange} rows="3" placeholder="<svg>...</svg>" />
            <small className="help-text">Paste the raw SVG HTML code here. You can find free SVG icons online.</small>
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

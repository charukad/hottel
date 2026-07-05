"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import '../styles/Settings.css';

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewLogo, setPreviewLogo] = useState('');
  const [previewFavicon, setPreviewFavicon] = useState('');

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      setSettings(data);
      setPreviewLogo(data.logoUrl);
      setPreviewFavicon(data.faviconUrl);
    } catch {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e, field, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setSettings(prev => ({ ...prev, [field]: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData();
    Object.keys(settings).forEach(key => {
      // Don't append empty values or internal MongoDB fields
      if (key === '_id' || key === 'createdAt' || key === 'updatedAt' || key === '__v') return;
      if (key === 'logoUrl' || key === 'faviconUrl') return;
      
      if (settings[key] !== null && settings[key] !== undefined) {
        formData.append(key, settings[key]);
      }
    });

    if (settings.logoFile) formData.append('logoFile', settings.logoFile);
    if (settings.faviconFile) formData.append('faviconFile', settings.faviconFile);

    try {
      await api.put('/settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Settings updated successfully!');
      fetchSettings(); // Refresh to get the actual uploaded URLs
    } catch {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Global Site Settings</h1>
        <p>Manage the hotel's branding, contact information, and SEO.</p>
      </div>

      <form className="settings-form" onSubmit={handleSubmit}>
        
        {/* BRANDING SECTION */}
        <section className="settings-section card">
          <h2>Branding & Theme</h2>
          <div className="form-grid">
            <div className="form-group full-width" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f9f9f9', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--green-primary)' }}>
              <input 
                type="checkbox" 
                id="showRoomPrices" 
                name="showRoomPrices" 
                checked={settings.showRoomPrices !== false} 
                onChange={handleChange} 
                style={{ width: '1.25rem', height: '1.25rem' }}
              />
              <label htmlFor="showRoomPrices" style={{ margin: 0, fontWeight: 'bold', fontSize: '1.05rem', cursor: 'pointer' }}>
                Display Room Prices publicly on the website
              </label>
            </div>
            
            <div className="form-group">
              <label>Hotel Name</label>
              <input type="text" name="hotelName" value={settings.hotelName || ''} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Tagline</label>
              <input type="text" name="tagline" value={settings.tagline || ''} onChange={handleChange} required />
            </div>
            <div className="form-group full-width">
              <label>Brief Description (About Us snippet)</label>
              <textarea name="description" value={settings.description || ''} onChange={handleChange} rows="3" required />
            </div>
            
            <div className="form-group">
              <label>Primary Color</label>
              <div className="color-picker-wrap">
                <input type="color" name="primaryColor" value={settings.primaryColor || '#2b4c3b'} onChange={handleChange} />
                <span>{settings.primaryColor || '#2b4c3b'}</span>
              </div>
            </div>
            <div className="form-group">
              <label>Secondary Color</label>
              <div className="color-picker-wrap">
                <input type="color" name="secondaryColor" value={settings.secondaryColor || '#8fa87a'} onChange={handleChange} />
                <span>{settings.secondaryColor || '#8fa87a'}</span>
              </div>
            </div>

            <div className="form-group">
              <label>Website Logo</label>
              {previewLogo && <img src={previewLogo} alt="Logo Preview" className="logo-preview" />}
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'logoFile', setPreviewLogo)} />
            </div>
            <div className="form-group">
              <label>Browser Favicon</label>
              {previewFavicon && <img src={previewFavicon} alt="Favicon Preview" className="favicon-preview" />}
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'faviconFile', setPreviewFavicon)} />
            </div>
          </div>
        </section>

        {/* CONTACT INFO SECTION */}
        <section className="settings-section card">
          <h2>Contact Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Contact Email</label>
              <input type="email" name="contactEmail" value={settings.contactEmail || ''} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Contact Phone</label>
              <input type="text" name="contactPhone" value={settings.contactPhone || ''} onChange={handleChange} required />
            </div>
            <div className="form-group full-width">
              <label>Physical Address</label>
              <input type="text" name="contactAddress" value={settings.contactAddress || ''} onChange={handleChange} required />
            </div>
            <div className="form-group full-width">
              <label>Google Maps Embed URL</label>
              <input type="url" name="googleMapsUrl" value={settings.googleMapsUrl || ''} onChange={handleChange} placeholder="https://www.google.com/maps/embed?pb=..." />
              <small className="help-text">Go to Google Maps &gt; Share &gt; Embed a map &gt; Copy the URL inside the src="..." attribute.</small>
            </div>
          </div>
        </section>

        {/* SOCIAL LINKS SECTION */}
        <section className="settings-section card">
          <h2>Social Media Links</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Facebook URL</label>
              <input type="text" name="socialFacebook" value={settings.socialFacebook || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Instagram URL</label>
              <input type="text" name="socialInstagram" value={settings.socialInstagram || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>TripAdvisor URL</label>
              <input type="text" name="socialTripAdvisor" value={settings.socialTripAdvisor || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>WhatsApp Link</label>
              <input type="text" name="socialWhatsapp" value={settings.socialWhatsapp || ''} onChange={handleChange} placeholder="https://wa.me/9477..." />
            </div>
          </div>
        </section>

        {/* SEO SECTION */}
        <section className="settings-section card">
          <h2>SEO (Search Engine Optimization)</h2>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>SEO Title (Browser Tab & Google Search)</label>
              <input type="text" name="seoTitle" value={settings.seoTitle || ''} onChange={handleChange} required />
            </div>
            <div className="form-group full-width">
              <label>SEO Description (Meta Tag)</label>
              <textarea name="seoDescription" value={settings.seoDescription || ''} onChange={handleChange} rows="2" required />
            </div>
            <div className="form-group full-width">
              <label>SEO Keywords (Comma separated)</label>
              <input type="text" name="seoKeywords" value={settings.seoKeywords || ''} onChange={handleChange} placeholder="hotel, ella, sri lanka, eco resort" />
            </div>
          </div>
        </section>

        <div className="settings-actions">
          <button type="submit" className="btn btn-primary btn-large" disabled={saving}>
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import api from '../api/axios';
import HeroForm from '../components/HeroForm';
import MediaSelector from '../components/MediaSelector';
import '../styles/Events.css'; // Reusing event styles for the table layout

export default function HeroPage() {
  const [slides, setSlides] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchData = async () => {
    try {
      const [slidesRes, settingsRes] = await Promise.all([
        api.get('/hero'),
        api.get('/settings')
      ]);
      setSlides(slidesRes.data);
      setSettings(settingsRes.data);
    } catch {
      toast.error('Failed to load hero data');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      const formData = new FormData();
      formData.append(key, value);
      const { data } = await api.put('/settings', formData);
      setSettings(data);
      toast.success('Settings updated');
    } catch {
      toast.error('Failed to update settings');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = () => {
    setEditingSlide(null);
    setShowForm(true);
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slide?')) return;
    setDeleting(id);
    try {
      await api.delete(`/hero/${id}`);
      toast.success('Slide deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete slide');
    } finally {
      setDeleting(null);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingSlide(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchData();
  };

  return (
    <div className="events-page">
      <div className="events-header">
        <div>
          <h1>Hero Section Management</h1>
          <p>Manage the large background slider on the homepage</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          + Add Slide
        </button>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : (
        <>
          <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Hero Display Mode</h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <select 
                value={settings?.heroMode || 'slider'} 
                onChange={(e) => updateSetting('heroMode', e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
              >
                <option value="slider">Sliding Images</option>
                <option value="video">Full Screen Video</option>
              </select>

              {settings?.heroMode === 'video' && (
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button className="btn btn-outline" onClick={() => setShowMediaSelector(true)}>
                    Select Video
                  </button>
                  {settings.heroVideoUrl && (
                    <span style={{ fontSize: '0.9rem', color: 'gray' }}>Video selected!</span>
                  )}
                </div>
              )}
            </div>
            {settings?.heroMode === 'video' && settings.heroVideoUrl && (
              <div style={{ marginTop: '1rem', height: '200px', width: '350px', background: 'black', borderRadius: '8px', overflow: 'hidden' }}>
                <video src={settings.heroVideoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay muted loop playsInline />
              </div>
            )}
          </div>

          {settings?.heroMode !== 'video' && (
            slides.length === 0 ? (
              <div className="empty-state card">
                <p>No hero slides configured. The website will show a blank hero section.</p>
                <button className="btn btn-primary" onClick={handleCreate}>
                  Create First Slide
                </button>
              </div>
            ) : (
        <div className="events-table-wrap card">
          <table className="events-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Subtitle</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slides.map((slide) => (
                <tr key={slide._id} className={!slide.isActive ? 'inactive-row' : ''}>
                  <td>
                    <div style={{ position: 'relative', width: '100px', height: '60px' }}>
                      <Image 
                        src={slide.imageUrl} 
                        alt={slide.title || 'Slide'} 
                        fill 
                        style={{ objectFit: 'cover' }} 
                        className="event-thumb"
                        unoptimized={slide.imageUrl.startsWith('http')}
                      />
                    </div>
                  </td>
                  <td><strong>{slide.title || '(No title)'}</strong></td>
                  <td className="desc-cell">{slide.subtitle || '-'}</td>
                  <td>{slide.order}</td>
                  <td>
                    <span className={`status-badge ${slide.isActive ? 'active' : 'inactive'}`}>
                      {slide.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="btn btn-outline btn-sm" onClick={() => handleEdit(slide)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(slide._id)}
                      disabled={deleting === slide._id}
                    >
                      {deleting === slide._id ? '...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
            )
          )}

      {showForm && (
        <HeroForm
          slide={editingSlide}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {showMediaSelector && (
        <MediaSelector
          onClose={() => setShowMediaSelector(false)}
          onSelect={(item) => {
            updateSetting('heroVideoUrl', item.url);
            setShowMediaSelector(false);
          }}
        />
      )}
    </div>
  );
}

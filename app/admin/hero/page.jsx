"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import api from '../api/axios';
import HeroForm from '../components/HeroForm';
import '../styles/Events.css'; // Reusing event styles for the table layout

export default function HeroPage() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchSlides = async () => {
    try {
      const { data } = await api.get('/hero');
      setSlides(data);
    } catch {
      toast.error('Failed to load hero slides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
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
      fetchSlides();
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
    fetchSlides();
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
      ) : slides.length === 0 ? (
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
      )}

      {showForm && (
        <HeroForm
          slide={editingSlide}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

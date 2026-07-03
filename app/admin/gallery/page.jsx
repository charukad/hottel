"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import api from '../api/axios';
import GalleryForm from '../components/GalleryForm';
import '../styles/Gallery.css';

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchImages = async () => {
    try {
      const { data } = await api.get('/gallery');
      setImages(data);
    } catch {
      toast.error('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleCreate = () => {
    setEditingImage(null);
    setShowForm(true);
  };

  const handleEdit = (image) => {
    setEditingImage(image);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this image from the website gallery?')) return;
    setDeleting(id);
    try {
      await api.delete(`/gallery/${id}`);
      toast.success('Gallery image removed');
      fetchImages();
    } catch {
      toast.error('Failed to delete gallery image');
    } finally {
      setDeleting(null);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingImage(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchImages();
  };

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <div>
          <h1>Gallery Management</h1>
          <p>
            Add extra photos to the public gallery. The 8 fixed gallery images on the website
            are always shown — uploads here appear alongside them.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          + Add Image
        </button>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : images.length === 0 ? (
        <div className="empty-state card">
          <p>No admin gallery images yet. The website still shows the fixed gallery photos.</p>
          <button className="btn btn-primary" onClick={handleCreate}>
            Add Image
          </button>
        </div>
      ) : (
        <div className="gallery-grid-admin">
          {images.map((image) => (
            <article key={image._id} className="gallery-admin-card card">
              <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                <Image src={image.imageUrl} alt={image.alt} fill style={{ objectFit: 'cover' }} className="gallery-admin-thumb" unoptimized={image.imageUrl.startsWith('http')} />
              </div>
              <div className="gallery-admin-body">
                <p className="gallery-admin-alt">{image.alt}</p>
                <span className="gallery-admin-order">Order: {image.order}</span>
                <div className="gallery-admin-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => handleEdit(image)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(image._id)}
                    disabled={deleting === image._id}
                  >
                    {deleting === image._id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {showForm && (
        <GalleryForm
          image={editingImage}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

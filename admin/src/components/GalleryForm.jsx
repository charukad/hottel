import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import './EventForm.css';
import './GalleryForm.css';

const GalleryForm = ({ image, onClose, onSuccess }) => {
  const isEdit = !!image;
  const [form, setForm] = useState({
    alt: image?.alt || '',
    order: image?.order ?? 0,
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(image?.imageUrl || '');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'order' ? Number(value) : value });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEdit && !file) {
      toast.error('Please select an image to upload');
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append('alt', form.alt);
    formData.append('order', form.order);
    if (file) formData.append('image', file);

    try {
      if (isEdit) {
        await api.put(`/gallery/${image._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Gallery image updated');
      } else {
        await api.post('/gallery', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Gallery image added');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save gallery image');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Gallery Image' : 'Add Gallery Image'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="alt">Description</label>
            <input
              id="alt"
              name="alt"
              value={form.alt}
              onChange={handleChange}
              required
              placeholder="e.g. Sunset view from the villa terrace"
            />
          </div>

          <div className="form-group">
            <label htmlFor="order">Display order</label>
            <input
              id="order"
              name="order"
              type="number"
              min="0"
              value={form.order}
              onChange={handleChange}
            />
            <small className="form-hint">Lower numbers appear first among admin-added images</small>
          </div>

          <div className="form-group">
            <label htmlFor="image">Image{isEdit ? ' (optional — leave empty to keep current)' : ''}</label>
            <input id="image" type="file" accept="image/*" onChange={handleFileChange} />
            {preview && <img src={preview} alt="Preview" className="image-preview" />}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : isEdit ? 'Update Image' : 'Add Image'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GalleryForm;

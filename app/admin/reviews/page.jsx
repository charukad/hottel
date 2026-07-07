"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import ReviewForm from '../components/ReviewForm';
import '../styles/Events.css'; 

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get('/reviews?admin=true');
      setReviews(data);
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleCreate = () => {
    setEditingReview(null);
    setShowForm(true);
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    setDeleting(id);
    try {
      await api.delete(`/reviews/${id}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch {
      toast.error('Failed to delete review');
    } finally {
      setDeleting(null);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingReview(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchReviews();
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="events-page">
      <div className="events-header">
        <div>
          <h1>Guest Reviews</h1>
          <p>Manage testimonials shown on the website carousel</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          + Add Review
        </button>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : reviews.length === 0 ? (
        <div className="empty-state card">
          <p>No reviews added yet.</p>
          <button className="btn btn-primary" onClick={handleCreate}>
            Add First Review
          </button>
        </div>
      ) : (
        <div className="events-table-wrap card">
          <table className="events-table">
            <thead>
              <tr>
                <th>Guest Name</th>
                <th>Rating</th>
                <th>Review Text</th>
                <th>Source</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review._id} className={!review.isActive ? 'inactive-row' : ''}>
                  <td><strong>{review.guestName}</strong></td>
                  <td style={{ color: '#ffb400', fontSize: '1.2rem' }}>{renderStars(review.rating)}</td>
                  <td className="desc-cell">"{review.text}"</td>
                  <td>{review.source}</td>
                  <td>
                    <span className={`status-badge ${review.isActive ? 'active' : 'inactive'}`}>
                      {review.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="btn btn-outline btn-sm" onClick={() => handleEdit(review)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(review._id)}
                      disabled={deleting === review._id}
                    >
                      {deleting === review._id ? '...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ReviewForm
          review={editingReview}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

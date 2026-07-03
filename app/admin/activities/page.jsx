"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import api from '../api/axios';
import ActivityForm from '../components/ActivityForm';
import '../styles/Events.css'; 

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchActivities = async () => {
    try {
      const { data } = await api.get('/activities');
      setActivities(data);
    } catch {
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleCreate = () => {
    setEditingActivity(null);
    setShowForm(true);
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    setDeleting(id);
    try {
      await api.delete(`/activities/${id}`);
      toast.success('Activity deleted');
      fetchActivities();
    } catch {
      toast.error('Failed to delete activity');
    } finally {
      setDeleting(null);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingActivity(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchActivities();
  };

  return (
    <div className="events-page">
      <div className="events-header">
        <div>
          <h1>Activities & Attractions</h1>
          <p>Manage "Things to Do" around Ella (e.g., Nine Arch Bridge, Ella Rock)</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          + Add Activity
        </button>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : activities.length === 0 ? (
        <div className="empty-state card">
          <p>No activities configured.</p>
          <button className="btn btn-primary" onClick={handleCreate}>
            Create First Activity
          </button>
        </div>
      ) : (
        <div className="events-table-wrap card">
          <table className="events-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Description</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity._id} className={!activity.isActive ? 'inactive-row' : ''}>
                  <td>
                    <div style={{ position: 'relative', width: '100px', height: '60px' }}>
                      <Image 
                        src={activity.imageUrl} 
                        alt={activity.title} 
                        fill 
                        style={{ objectFit: 'cover' }} 
                        className="event-thumb"
                        unoptimized={activity.imageUrl.startsWith('http')}
                      />
                    </div>
                  </td>
                  <td><strong>{activity.title}</strong></td>
                  <td className="desc-cell">{activity.description}</td>
                  <td>{activity.order}</td>
                  <td>
                    <span className={`status-badge ${activity.isActive ? 'active' : 'inactive'}`}>
                      {activity.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="btn btn-outline btn-sm" onClick={() => handleEdit(activity)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(activity._id)}
                      disabled={deleting === activity._id}
                    >
                      {deleting === activity._id ? '...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ActivityForm
          activity={editingActivity}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

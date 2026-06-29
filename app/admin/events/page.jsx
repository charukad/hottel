"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import EventForm from '../components/EventForm';
import '../styles/Events.css';

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/events');
      setEvents(data);
    } catch {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreate = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    setDeleting(id);
    try {
      await api.delete(`/events/${id}`);
      toast.success('Event deleted');
      fetchEvents();
    } catch {
      toast.error('Failed to delete event');
    } finally {
      setDeleting(null);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchEvents();
  };

  return (
    <div className="events-page">
      <div className="events-header">
        <div>
          <h1>Event Management</h1>
          <p>Create and manage events shown on the public website</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          + Add Event
        </button>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : events.length === 0 ? (
        <div className="empty-state card">
          <p>No events yet. Create your first event to display on the website.</p>
          <button className="btn btn-primary" onClick={handleCreate}>
            Create Event
          </button>
        </div>
      ) : (
        <div className="events-table-wrap card">
          <table className="events-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Date</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id}>
                  <td>
                    {event.imageUrl ? (
                      <img src={event.imageUrl} alt={event.title} className="event-thumb" />
                    ) : (
                      <span className="no-image">No image</span>
                    )}
                  </td>
                  <td><strong>{event.title}</strong></td>
                  <td>{formatDate(event.date)}</td>
                  <td className="desc-cell">{event.description}</td>
                  <td className="actions-cell">
                    <button className="btn btn-outline btn-sm" onClick={() => handleEdit(event)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(event._id)}
                      disabled={deleting === event._id}
                    >
                      {deleting === event._id ? '...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <EventForm
          event={editingEvent}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

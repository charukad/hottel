"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import api from '../api/axios';
import RoomForm from '../components/RoomForm';
import '../styles/Events.css'; // Reusing event styles for table layouts

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchRooms = async () => {
    try {
      const { data } = await api.get('/rooms');
      setRooms(data);
    } catch {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreate = () => {
    setEditingRoom(null);
    setShowForm(true);
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    setDeleting(id);
    try {
      await api.delete(`/rooms/${id}`);
      toast.success('Room deleted');
      fetchRooms();
    } catch {
      toast.error('Failed to delete room');
    } finally {
      setDeleting(null);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingRoom(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchRooms();
  };

  return (
    <div className="events-page">
      <div className="events-header">
        <div>
          <h1>Room Management</h1>
          <p>Create and manage accommodation options</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          + Add Room
        </button>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : rooms.length === 0 ? (
        <div className="empty-state card">
          <p>No rooms yet. Create your first room to display on the website.</p>
          <button className="btn btn-primary" onClick={handleCreate}>
            Create Room
          </button>
        </div>
      ) : (
        <div className="events-table-wrap card">
          <table className="events-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Type</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id}>
                  <td>
                    {room.images && room.images.length > 0 ? (
                      <div style={{ position: 'relative', width: '100px', height: '60px' }}>
                        <Image src={room.images[0]} alt={room.name} fill style={{ objectFit: 'cover' }} className="event-thumb" unoptimized={room.images[0].startsWith('http')} />
                      </div>
                    ) : (
                      <span className="no-image">No image</span>
                    )}
                  </td>
                  <td><strong>{room.name}</strong></td>
                  <td>{room.type}</td>
                  <td>LKR {room.price?.toLocaleString()}</td>
                  <td className="actions-cell">
                    <button className="btn btn-outline btn-sm" onClick={() => handleEdit(room)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(room._id)}
                      disabled={deleting === room._id}
                    >
                      {deleting === room._id ? '...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <RoomForm
          room={editingRoom}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import ServiceForm from '../components/ServiceForm';
import '../styles/Events.css'; // Reusing event styles for the table layout

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchServices = async () => {
    try {
      const { data } = await api.get('/services');
      setServices(data);
    } catch {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreate = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    setDeleting(id);
    try {
      await api.delete(`/services/${id}`);
      toast.success('Service deleted');
      fetchServices();
    } catch {
      toast.error('Failed to delete service');
    } finally {
      setDeleting(null);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingService(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchServices();
  };

  return (
    <div className="events-page">
      <div className="events-header">
        <div>
          <h1>Services Management</h1>
          <p>Manage the hotel amenities and services</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          + Add Service
        </button>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : services.length === 0 ? (
        <div className="empty-state card">
          <p>No services configured.</p>
          <button className="btn btn-primary" onClick={handleCreate}>
            Create First Service
          </button>
        </div>
      ) : (
        <div className="events-table-wrap card">
          <table className="events-table">
            <thead>
              <tr>
                <th>Icon (SVG code)</th>
                <th>Title</th>
                <th>Description</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id} className={!service.isActive ? 'inactive-row' : ''}>
                  <td>
                    {service.imageUrl ? (
                      <img src={service.imageUrl} alt={service.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : service.icon ? (
                       <span className="icon-preview-box" dangerouslySetInnerHTML={{ __html: service.icon }} />
                    ) : (
                      <span className="no-image">No icon</span>
                    )}
                  </td>
                  <td><strong>{service.title}</strong></td>
                  <td className="desc-cell">{service.description}</td>
                  <td>{service.order}</td>
                  <td>
                    <span className={`status-badge ${service.isActive ? 'active' : 'inactive'}`}>
                      {service.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="btn btn-outline btn-sm" onClick={() => handleEdit(service)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(service._id)}
                      disabled={deleting === service._id}
                    >
                      {deleting === service._id ? '...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ServiceForm
          service={editingService}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

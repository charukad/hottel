"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import '../styles/Events.css'; 

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchInquiries = async () => {
    try {
      const { data } = await api.get('/inquiries');
      setInquiries(data);
    } catch {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await api.put(`/inquiries/${id}`, { status });
      toast.success(`Inquiry marked as ${status}`);
      fetchInquiries();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this inquiry?')) return;
    setUpdating(id);
    try {
      await api.delete(`/inquiries/${id}`);
      toast.success('Inquiry deleted');
      fetchInquiries();
    } catch {
      toast.error('Failed to delete inquiry');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <span className="status-badge active">Approved</span>;
      case 'rejected': return <span className="status-badge inactive">Rejected</span>;
      default: return <span className="status-badge" style={{ background: '#ffa000' }}>Pending</span>;
    }
  };

  return (
    <div className="events-page">
      <div className="events-header">
        <div>
          <h1>Booking Inquiries</h1>
          <p>Review and manage reservation requests from the website</p>
        </div>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : inquiries.length === 0 ? (
        <div className="empty-state card">
          <p>No booking inquiries found yet. When guests use the booking form, they will appear here.</p>
        </div>
      ) : (
        <div className="events-table-wrap card">
          <table className="events-table" style={{ minWidth: '1000px' }}>
            <thead>
              <tr>
                <th>Date Received</th>
                <th>Guest Details</th>
                <th>Reservation Info</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => (
                <tr key={inquiry._id}>
                  <td>{formatDate(inquiry.createdAt)}</td>
                  <td>
                    <strong>{inquiry.name}</strong><br />
                    <a href={`mailto:${inquiry.email}`} className="text-sm">{inquiry.email}</a><br />
                    <span className="text-sm text-gray">{inquiry.phone || 'No phone'}</span>
                  </td>
                  <td>
                    {inquiry.roomType ? <strong>{inquiry.roomType}</strong> : <span>Any Room</span>}<br />
                    <span className="text-sm">{formatDate(inquiry.checkIn)} → {formatDate(inquiry.checkOut)}</span><br />
                    <span className="text-sm text-gray">{inquiry.guests} Guests</span>
                  </td>
                  <td className="desc-cell" style={{ maxWidth: '250px' }}>
                    {inquiry.message || <em className="text-gray">No message provided</em>}
                  </td>
                  <td>{getStatusBadge(inquiry.status)}</td>
                  <td className="actions-cell">
                    {inquiry.status === 'pending' && (
                      <>
                        <button 
                          className="btn btn-outline btn-sm" 
                          onClick={() => handleUpdateStatus(inquiry._id, 'approved')}
                          disabled={updating === inquiry._id}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn btn-outline btn-sm" 
                          style={{ color: '#dc3545', borderColor: '#dc3545' }}
                          onClick={() => handleUpdateStatus(inquiry._id, 'rejected')}
                          disabled={updating === inquiry._id}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(inquiry._id)}
                      disabled={updating === inquiry._id}
                      style={{ marginTop: inquiry.status === 'pending' ? '0.5rem' : '0' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

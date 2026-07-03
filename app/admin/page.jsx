"use client";

import { useState, useEffect } from 'react';
import api from './api/axios';
import './styles/Dashboard.css';

export default function DashboardPage() {
  const [stats, setStats] = useState({ roomCount: 0, eventCount: 0, galleryCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/stats');
        setStats({
          roomCount: data.roomsCount || 0,
          eventCount: data.eventsCount || 0,
          galleryCount: data.galleryCount || 0
        });
      } catch (e) {
        console.error('Failed to fetch stats:', e.message);
        setError(true);
        // Fallback stats so the UI doesn't completely break
        setStats({ roomCount: 4, eventCount: 0, galleryCount: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p className="dashboard-sub">Welcome to Mountain Breeze Villa admin panel</p>

      {error && (
        <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '10px 15px', borderRadius: '4px', marginBottom: '20px', fontSize: '14px' }}>
          ⚠️ Could not load real-time statistics. Showing fallback data.
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card card">
          <span className="stat-icon">🏨</span>
          <div>
            {loading ? (
              <div className="skeleton-text" style={{ width: '40px', height: '24px', marginBottom: '8px' }} />
            ) : (
              <h2>{stats.roomCount}</h2>
            )}
            <p>Total Rooms</p>
          </div>
        </div>
        <div className="stat-card card">
          <span className="stat-icon">📅</span>
          <div>
            {loading ? (
              <div className="skeleton-text" style={{ width: '40px', height: '24px', marginBottom: '8px' }} />
            ) : (
              <h2>{stats.eventCount}</h2>
            )}
            <p>Active Events</p>
          </div>
        </div>
        <div className="stat-card card">
          <span className="stat-icon">🖼️</span>
          <div>
            {loading ? (
              <div className="skeleton-text" style={{ width: '40px', height: '24px', marginBottom: '8px' }} />
            ) : (
              <h2>{stats.galleryCount}</h2>
            )}
            <p>Gallery Uploads</p>
          </div>
        </div>
      </div>

      <div className="dashboard-info card">
        <h3>Quick Guide</h3>
        <ul>
          <li>Go to <strong>Events</strong> to create, edit, or delete events</li>
          <li>Go to <strong>Rooms</strong> to manage accommodation options and pricing</li>
          <li>Go to <strong>Gallery</strong> to add extra photos alongside the fixed website gallery</li>
          <li>Changes appear on the public website automatically after saving</li>
        </ul>
      </div>
    </div>
  );
}

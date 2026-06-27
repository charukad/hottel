import { useState, useEffect } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({ roomCount: 0, eventCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/stats');
        setStats(data);
      } catch {
        setStats({ roomCount: 4, eventCount: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Layout><div className="spinner" /></Layout>;

  return (
    <Layout>
      <div className="dashboard">
        <h1>Dashboard</h1>
        <p className="dashboard-sub">Welcome to Mountain Breeze Villa admin panel</p>

        <div className="stats-grid">
          <div className="stat-card card">
            <span className="stat-icon">🏨</span>
            <div>
              <h2>{stats.roomCount}</h2>
              <p>Total Rooms</p>
            </div>
          </div>
          <div className="stat-card card">
            <span className="stat-icon">📅</span>
            <div>
              <h2>{stats.eventCount}</h2>
              <p>Active Events</p>
            </div>
          </div>
        </div>

        <div className="dashboard-info card">
          <h3>Quick Guide</h3>
          <ul>
            <li>Go to <strong>Events</strong> to create, edit, or delete events</li>
            <li>Events appear on the public website automatically after saving</li>
            <li>Upload event images when creating or editing events</li>
            <li>Room prices are managed via the database seed (future: room editor)</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

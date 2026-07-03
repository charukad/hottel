"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // Redirect authenticated users — inside useEffect, not during render
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/admin');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) return <div className="spinner" />;

  // Don't render the form if already authenticated (redirect is in progress)
  if (isAuthenticated) return <div className="spinner" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(username, password);
      toast.success('Welcome back!');
      router.replace('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card card">
        <div className="login-header">
          <span className="login-icon">🌿</span>
          <h1>Mountain Breeze Villa</h1>
          <p>Admin Panel</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn btn-primary login-btn" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

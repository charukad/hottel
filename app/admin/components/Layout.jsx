"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import '../styles/Layout.css';
import '../styles/index.css';

const Layout = ({ children }) => {
  const { admin, logout, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [loading, isAuthenticated, pathname, router]);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  if (loading || (!isAuthenticated && pathname !== '/admin/login')) {
    return <div className="spinner" />;
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="admin-layout">
      <button 
        className="mobile-menu-toggle" 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? '✕' : '☰'}
      </button>

      <div className={`mobile-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)} />

      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <img src="/images/logo.png" alt="Mountain Breeze Villa" className="sidebar-logo" />
        </div>
        <nav className="sidebar-nav">
          <Link href="/admin" className={pathname === '/admin' ? 'active' : ''}>
            Dashboard
          </Link>
          <Link href="/admin/inquiries" className={pathname.startsWith('/admin/inquiries') ? 'active' : ''}>
            Inquiries
          </Link>
          <Link href="/admin/hero" className={pathname.startsWith('/admin/hero') ? 'active' : ''}>
            Hero Slides
          </Link>
          <Link href="/admin/events" className={pathname.startsWith('/admin/events') ? 'active' : ''}>
            Events
          </Link>
          <Link href="/admin/rooms" className={pathname.startsWith('/admin/rooms') ? 'active' : ''}>
            Rooms
          </Link>
          <Link href="/admin/services" className={pathname.startsWith('/admin/services') ? 'active' : ''}>
            Services
          </Link>
          <Link href="/admin/activities" className={pathname.startsWith('/admin/activities') ? 'active' : ''}>
            Activities
          </Link>
          <Link href="/admin/gallery" className={pathname.startsWith('/admin/gallery') ? 'active' : ''}>
            Gallery
          </Link>
          <Link href="/admin/reviews" className={pathname.startsWith('/admin/reviews') ? 'active' : ''}>
            Reviews
          </Link>
          <Link href="/admin/settings" className={pathname.startsWith('/admin/settings') ? 'active' : ''}>
            Settings
          </Link>
        </nav>
        <div className="sidebar-footer">
          <p>Signed in as <strong>{admin?.username}</strong></p>
          <button className="btn btn-outline logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
};

export default Layout;

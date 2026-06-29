"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import '../styles/Layout.css';
import '../styles/index.css';

const Layout = ({ children }) => {
  const { admin, logout, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/images/logo.png" alt="Mountain Breeze Villa" className="sidebar-logo" />
        </div>
        <nav className="sidebar-nav">
          <Link href="/admin" className={pathname === '/admin' ? 'active' : ''}>
            Dashboard
          </Link>
          <Link href="/admin/events" className={pathname === '/admin/events' ? 'active' : ''}>
            Events
          </Link>
          <Link href="/admin/gallery" className={pathname === '/admin/gallery' ? 'active' : ''}>
            Gallery
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

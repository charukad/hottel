import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/images/logo.png" alt="Mountain Breeze Villa" className="sidebar-logo" />
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Dashboard
          </NavLink>
          <NavLink to="/events" className={({ isActive }) => (isActive ? 'active' : '')}>
            Events
          </NavLink>
          <NavLink to="/gallery" className={({ isActive }) => (isActive ? 'active' : '')}>
            Gallery
          </NavLink>
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

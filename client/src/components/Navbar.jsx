import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Split, User, LogIn, LogOut, UserPlus, Server, Users, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="navbar-brand">
          <Split size={24} />
          Fair<span>Share</span>
        </Link>
        <ul className="navbar-links">
          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className={`navbar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <LayoutDashboard size={15} />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/groups"
                  className={`navbar-link ${location.pathname.startsWith('/groups') ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Users size={15} />
                  <span>Groups</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className={`navbar-link ${location.pathname === '/profile' ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <User size={15} />
                  <span>{user?.name?.split(' ')[0]}</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                  title="Log out"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/"
                  className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/status"
                  className={`navbar-link ${location.pathname === '/status' ? 'active' : ''}`}
                >
                  <Server size={14} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} />
                  Status
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className={`navbar-link ${location.pathname === '/login' ? 'active' : ''}`}
                >
                  <LogIn size={15} style={{ marginRight: '5px', verticalAlign: 'text-bottom' }} />
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem' }}
                >
                  <UserPlus size={14} />
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

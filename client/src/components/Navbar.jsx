import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Split, User, LogIn, LogOut, UserPlus, Server, Users, LayoutDashboard, Sparkles } from 'lucide-react';
import SignatureEye from './SignatureEye';

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
        {/* Brand Logo with Glow & Mini Signature Eye */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="navbar-brand">
          <div className="navbar-brand-icon">
            <Split size={20} />
          </div>
          <span>Fair<span style={{ color: 'var(--primary)' }}>Share</span></span>
        </Link>

        {/* Navigation Items */}
        <ul className="navbar-links">
          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className={`navbar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/groups"
                  className={`navbar-link ${location.pathname.startsWith('/groups') ? 'active' : ''}`}
                >
                  <Users size={16} />
                  <span>Groups</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className={`navbar-link ${location.pathname === '/profile' ? 'active' : ''}`}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span>{user?.name?.split(' ')[0]}</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  title="Log out"
                  style={{ gap: '0.4rem', color: 'var(--text-muted)' }}
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
                  <Server size={14} style={{ color: 'var(--secondary)' }} />
                  <span>Status</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className={`navbar-link ${location.pathname === '/login' ? 'active' : ''}`}
                >
                  <LogIn size={15} />
                  <span>Login</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm"
                >
                  <UserPlus size={14} />
                  <span>Register</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

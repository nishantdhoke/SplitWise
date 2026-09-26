import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, LogIn, LogOut, UserPlus, Server, Users, LayoutDashboard, User } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(3, 4, 11, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(124, 58, 237, 0.2)',
        padding: '0.85rem 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand: FairShare in the Cosmic Environment */}
        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
            color: 'var(--star-white)',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'radial-gradient(circle at 30% 30%, #38D9FF 0%, #7C3AED 70%, #03040B 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F8FAFF',
              boxShadow: '0 0 16px rgba(56, 217, 255, 0.45)',
            }}
          >
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                FAIR<span style={{ color: 'var(--starlight-cyan)' }}>SHARE</span>
              </span>
            </div>
            <span
              style={{
                fontSize: '0.62rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'block',
                marginTop: '-2px',
              }}
            >
              Smart Expense Splitting
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <ul style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', listStyle: 'none' }}>
          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/dashboard"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    textDecoration: 'none',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: location.pathname === '/dashboard' ? 'var(--starlight-cyan)' : 'var(--text-secondary)',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: location.pathname === '/dashboard' ? 'rgba(56, 217, 255, 0.1)' : 'transparent',
                    border: location.pathname === '/dashboard' ? '1px solid rgba(56, 217, 255, 0.25)' : '1px solid transparent',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/groups"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    textDecoration: 'none',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: location.pathname.startsWith('/groups') ? 'var(--starlight-cyan)' : 'var(--text-secondary)',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: location.pathname.startsWith('/groups') ? 'rgba(56, 217, 255, 0.1)' : 'transparent',
                    border: location.pathname.startsWith('/groups') ? '1px solid rgba(56, 217, 255, 0.25)' : '1px solid transparent',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <Users size={16} />
                  <span>My Groups</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textDecoration: 'none',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: location.pathname === '/profile' ? 'var(--starlight-cyan)' : 'var(--text-secondary)',
                    padding: '0.4rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: location.pathname === '/profile' ? 'rgba(56, 217, 255, 0.1)' : 'transparent',
                    border: location.pathname === '/profile' ? '1px solid rgba(56, 217, 255, 0.25)' : '1px solid transparent',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, #7C3AED 0%, #2563EB 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#F8FAFF',
                      fontSize: '11px',
                      fontWeight: 800,
                      boxShadow: '0 0 10px rgba(124, 58, 237, 0.4)',
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
                  title="Logout from account"
                  style={{ gap: '0.4rem', color: 'var(--text-muted)' }}
                >
                  <LogOut size={13} />
                  <span>Logout</span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/"
                  style={{
                    textDecoration: 'none',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: location.pathname === '/' ? 'var(--starlight-cyan)' : 'var(--text-secondary)',
                    padding: '0.45rem 0.75rem',
                  }}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/status"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    textDecoration: 'none',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    padding: '0.45rem 0.75rem',
                  }}
                >
                  <Server size={14} color="var(--starlight-cyan)" />
                  <span>System Status</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    textDecoration: 'none',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    padding: '0.45rem 0.75rem',
                  }}
                >
                  <LogIn size={15} />
                  <span>Sign In</span>
                </Link>
              </li>
              <li>
                <Link to="/register" className="btn btn-primary btn-sm">
                  <UserPlus size={14} />
                  <span>Sign Up</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

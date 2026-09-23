import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import StatusCheck from './pages/StatusCheck';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Groups from './pages/Groups';
import CreateGroup from './pages/CreateGroup';
import GroupDetails from './pages/GroupDetails';
import Dashboard from './pages/Dashboard';

function HomeRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
        <div className="spinner" style={{ width: '2rem', height: '2rem' }}></div>
      </div>
    );
  }
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <StatusCheck />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Home & Public Routes */}
              <Route path="/" element={<HomeRoute />} />
              <Route path="/status" element={<StatusCheck />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes (Require Authentication) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/groups"
                element={
                  <ProtectedRoute>
                    <Groups />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/groups/new"
                element={
                  <ProtectedRoute>
                    <CreateGroup />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/groups/:groupId"
                element={
                  <ProtectedRoute>
                    <GroupDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="footer">
            FairShare — Expense Splitting Application &bull; Built with React, Express, MySQL
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

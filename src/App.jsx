/**
 * App.jsx — Root Router
 * 
 * Chỉ chịu trách nhiệm:
 * - Định nghĩa Routes (URL → Page)
 * - Redirect logic cơ bản
 * - Navigation handlers cho các trang public
 */

import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

// ── Pages ──
import IntroScreen from './features/intro/pages/IntroScreen';
import LoginScreen from './features/auth/pages/LoginScreen';
import ForgotPasswordScreen from './features/auth/pages/ForgotPasswordScreen';
import DashboardContainer from './features/dashboard/pages/DashboardContainer.jsx';

function App() {
  const navigate = useNavigate();

  // Auto-redirect: nếu đã đăng nhập → vào dashboard
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && window.location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [navigate]);

  // ── Navigation Handlers ──

  const handleNavigate = (view) => {
    const routes = {
      'landing': '/',
      'login': '/login',
      'register': '/register',
      'forgot-password': '/forgot-password',
      'dashboard': '/dashboard',
    };
    const path = routes[view];
    if (path) navigate(path);
  };

  const handleLoginSuccess = () => navigate('/dashboard');
  const handleLogout = () => navigate('/');

  // ── Routes ──

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<IntroScreen onNavigate={handleNavigate} />} />
      <Route path="/login" element={
        <LoginScreen
          currentView="login"
          onNavigate={handleNavigate}
          onLoginSuccess={handleLoginSuccess}
          onAdminLoginSuccess={handleLoginSuccess}
        />
      } />
      <Route path="/register" element={
        <LoginScreen
          currentView="register"
          onNavigate={handleNavigate}
          onLoginSuccess={handleLoginSuccess}
          onAdminLoginSuccess={handleLoginSuccess}
        />
      } />
      <Route path="/forgot-password" element={<ForgotPasswordScreen onNavigate={handleNavigate} />} />

      {/* Protected Pages */}
      <Route path="/dashboard" element={<DashboardContainer onLogout={handleLogout} />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

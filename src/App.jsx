/**
 * App.jsx — Root Router
 * 
 * Chỉ chịu trách nhiệm:
 * - Định nghĩa Routes (URL → Page)
 * - Redirect logic cơ bản
 * - Navigation handlers cho các trang public
 */

import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// ── Pages ──
import IntroScreen from './features/intro/pages/IntroScreen';
import NotFoundScreen from './features/intro/pages/NotFoundScreen';
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

  const handleNavigate = (view, redirect) => {
    const routes = {
      'landing': '/',
      'login': '/login',
      'register': '/register',
      'forgot-password': '/forgot-password',
      'dashboard': '/dashboard',
      'ai': '/ai',
      'community': '/group',
    };
    const path = routes[view];
    if (path) {
      // Nếu chuyển đến login với redirect, thêm query param để sau login chuyển đúng trang
      if (view === 'login' && redirect) {
        navigate(`${path}?redirect=${encodeURIComponent(redirect)}`);
      } else {
        navigate(path);
      }
    }
  };

  // Đọc redirect param từ URL để sau login chuyển đến đúng trang
  const handleLoginSuccess = () => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    navigate(redirect || '/dashboard');
  };
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
      <Route path="/ai" element={<DashboardContainer onLogout={handleLogout} initialView="ai" />} />
      <Route path="/group" element={<DashboardContainer onLogout={handleLogout} initialView="community" />} />

      {/* Fallback */}
      <Route path="*" element={<NotFoundScreen onNavigate={handleNavigate} />} />
    </Routes>
  );
}

export default App;

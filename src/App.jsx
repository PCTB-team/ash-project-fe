import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import LoginScreen from './Feature_Authen/pages/LoginScreen';
import ForgotPasswordScreen from './Feature_Authen/pages/ForgotPasswordScreen';
import Dashboard from './pages/Dashboard';
import IntroScreen from './Feature_Intro/IntroScreen';
import './App.css';

function App() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && window.location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  const handleNavigate = (view) => {
    if (view === 'landing') navigate('/');
    else if (view === 'login') navigate('/login');
    else if (view === 'register') navigate('/register');
    else if (view === 'forgot-password') navigate('/forgot-password');
    else if (view === 'dashboard') navigate('/dashboard');
  };

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  const handleAdminLoginSuccess = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={<IntroScreen onNavigate={handleNavigate} />} />
      <Route path="/login" element={
        <LoginScreen
          currentView="login"
          onNavigate={handleNavigate}
          onLoginSuccess={handleLoginSuccess}
          onAdminLoginSuccess={handleAdminLoginSuccess}
        />
      } />
      <Route path="/register" element={
        <LoginScreen
          currentView="register"
          onNavigate={handleNavigate}
          onLoginSuccess={handleLoginSuccess}
          onAdminLoginSuccess={handleAdminLoginSuccess}
        />
      } />
      <Route path="/forgot-password" element={<ForgotPasswordScreen onNavigate={handleNavigate} />} />
      
      {/* Protected Route for Dashboard can be added later, for now just basic route */}
      <Route path="/dashboard" element={<Dashboard onLogout={handleLogout} />} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

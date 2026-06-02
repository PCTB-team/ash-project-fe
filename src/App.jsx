import { useState } from 'react';
import LoginScreen from './Feature_Authen/pages/LoginScreen';
import ForgotPasswordScreen from './Feature_Authen/pages/ForgotPasswordScreen';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login' | 'register' | 'forgot-password' | 'dashboard'

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleLoginSuccess = () => {
    setCurrentView('dashboard');
  };

  const handleAdminLoginSuccess = () => {
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentView('login');
  };

  return (
    <>
      {currentView === 'dashboard' ? (
        <Dashboard onLogout={handleLogout} />
      ) : currentView === 'forgot-password' ? (
        <ForgotPasswordScreen onNavigate={handleNavigate} />
      ) : (
        <LoginScreen 
          currentView={currentView} 
          onNavigate={handleNavigate}
          onLoginSuccess={handleLoginSuccess}
          onAdminLoginSuccess={handleAdminLoginSuccess}
        />
      )}
    </>
  )
}

export default App;

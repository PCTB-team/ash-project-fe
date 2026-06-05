import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import { LOGOUT_API_URL } from './features/auth/hooks/useAuth';

import LoginScreen from './features/auth/pages/LoginScreen';
import ForgotPasswordScreen from './features/auth/pages/ForgotPasswordScreen';
import IntroScreen from './features/intro/pages/IntroScreen';
import './App.css';

import MainLayout from './features/dashboard/layouts/MainLayout.jsx';
import DashboardScreen from './features/dashboard/pages/DashboardScreen.jsx';
import ProfileScreen from './features/dashboard/pages/ProfileScreen.jsx';
import TrashScreen from './features/dashboard/pages/TrashScreen.jsx';

function DashboardFeature({ onLogout }) {
  const [currentView, setCurrentView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [accentColor, setAccentColor] = useState('#ff5c00');
  const [avatarUrl, setAvatarUrl] = useState(() => localStorage.getItem('cachedAvatar') || 'https://ui-avatars.com/api/?name=User&background=random');
  const [documents, setDocuments] = useState([]);
  const [trashDocuments, setTrashDocuments] = useState([]);
  const [fullName, setFullName] = useState('User');

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      const response = await fetch('http://localhost:8080/api/v1/documents', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if ((data.code === 0 || data.code === 1000) && data.result) {
          const mappedDocs = data.result.map(d => ({
            id: d.documentId,
            name: d.fileName || 'Untitled',
            type: d.fileExtension?.replace('.', '') || 'unknown',
            size: d.fileSize ? `${(d.fileSize / (1024*1024)).toFixed(1)} MB` : '1.0 MB',
            uploadedAt: new Date().toISOString(), // Fallback if no creation date
            status: d.status,
            storageUrl: d.storageUrl
          }));
          setDocuments(mappedDocs);
        }
      }
    } catch (e) {
      console.error("Lỗi lấy danh sách tài liệu:", e);
    }
  };

  const fetchTrashDocuments = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      const response = await fetch('http://localhost:8080/api/v1/documents/trash', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if ((data.code === 0 || data.code === 1000) && data.result) {
          const mappedDocs = data.result.map(d => ({
            id: d.documentId,
            name: d.fileName || 'Untitled',
            type: d.fileExtension?.replace('.', '') || 'unknown',
            size: d.fileSize ? `${(d.fileSize / (1024*1024)).toFixed(1)} MB` : '1.0 MB',
            uploadedAt: d.deletedAt || new Date().toISOString(),
            status: d.status,
            storageUrl: d.storageUrl
          }));
          setTrashDocuments(mappedDocs);
        }
      }
    } catch (e) {
      console.error("Lỗi lấy danh sách thùng rác:", e);
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchTrashDocuments();
  }, []);

  useEffect(() => {
    // Ưu tiên lấy fullname lưu từ API lúc đăng nhập
    const storedName = localStorage.getItem('fullname');
    if (storedName) {
      setFullName(storedName);
      return;
    }

    // Nếu không có, thử giải mã từ JWT token
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const payload = JSON.parse(jsonPayload);

        // Lấy trường fullname từ token
        const name = payload.fullname || payload.fullName || payload.name || payload.sub;
        if (name) {
          setFullName(name);
        }
      } catch (e) {
        console.error("Lỗi giải mã token:", e);
      }
    }
  }, []);

  // Handlers
  const handleNavigate = (view) => setCurrentView(view);
  
  const handleLogoutClick = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await fetch(LOGOUT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ refreshToken })
      });

      if (response.ok) {
        message.success('Đã đăng xuất thành công khỏi hệ thống!');
      } else {
        message.warning('Phiên đăng nhập đã hết hạn, tự động thoát!');
      }
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      if (onLogout) onLogout();
    }
  };
  
  const handleAddDocument = (doc) => setDocuments([...documents, doc]);
  const handleRemoveDocument = (docId) => setDocuments(documents.filter(d => d.id !== docId));
  const handleRenameDocument = (docId, newName) => {
    setDocuments(documents.map(d => d.id === docId ? { ...d, name: newName } : d));
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardScreen
            documents={documents}
            searchTerm={searchTerm}
            onAddDocument={handleAddDocument}
            onRefreshDocuments={() => { fetchDocuments(); fetchTrashDocuments(); }}
            onSelectActiveDocument={() => {}}
            currentUser={fullName}
            onLogout={handleLogoutClick}
            onNavigate={handleNavigate}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            currentUser={fullName}
            documentsCount={documents.length}
            storagePercentage={15}
            avatarUrl={avatarUrl}
            onAvatarChange={setAvatarUrl}
            accentColor={accentColor}
            onAccentColorChange={setAccentColor}
          />
        );
      case 'trash':
        return (
          <TrashScreen
            trashDocuments={trashDocuments}
            searchTerm={searchTerm}
            onRefreshDocuments={() => { fetchDocuments(); fetchTrashDocuments(); }}
            onNavigate={handleNavigate}
          />
        );
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <MainLayout
      currentView={currentView}
      onNavigate={handleNavigate}
      onLogout={handleLogoutClick}
      currentUser={fullName}
      storagePercentage={15}
      documentsCount={documents.length}
      deletedDocsCount={trashDocuments.length}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      avatarUrl={avatarUrl}
      accentColor={accentColor}
      isAdmin={false}
    >
      {renderContent()}
    </MainLayout>
  );
}

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
      <Route path="/dashboard" element={<DashboardFeature onLogout={handleLogout} />} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

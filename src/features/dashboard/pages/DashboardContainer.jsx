/**
 * DashboardFeature — Container component quản lý state & logic cho toàn bộ Dashboard.
 * 
 * Responsibilities:
 * - Quản lý documents, trash, user info, storage
 * - Fetch data từ API
 * - Xử lý logout
 * - Render đúng page (Dashboard/Profile/Trash) dựa trên currentView
 */

import { useEffect, useState } from 'react';
import { message } from 'antd';
import { LOGOUT_API_URL } from '../../auth/hooks/useAuth';
import { fetchWithAuth } from '../../../utils/apiClient.js';

import MainLayout from '../layouts/MainLayout.jsx';
import DashboardScreen from './DashboardScreen.jsx';
import ProfileScreen from './ProfileScreen.jsx';
import TrashScreen from './TrashScreen.jsx';
import logoAvatarDefault from '../../../assets/logo_avatar_default.jpg';

// ── API Endpoints ──
const DOCUMENTS_API_URL = 'http://localhost:8080/api/v1/documents';
const TRASH_API_URL = 'http://localhost:8080/api/v1/documents/trash';
const USER_PROFILE_API_URL = 'http://localhost:8080/api/v1/user/profile';

// ── Constants ──

const DEFAULT_AVATAR = logoAvatarDefault;

const getInitialFullName = () => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const payload = JSON.parse(jsonPayload);
      const name = payload.fullname || payload.fullName || payload.name || payload.sub;
      if (name) return name;
    } catch (e) {
      console.error("Lỗi giải mã token:", e);
    }
  }
  return 'User';
};

export default function DashboardContainer({ onLogout }) {
  // ── State ──
  const [currentView, setCurrentView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [accentColor, setAccentColor] = useState('#ff5c00');
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR);
  const [documentsCount, setDocumentsCount] = useState(0);
  const [trashDocuments, setTrashDocuments] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [fullName, setFullName] = useState(getInitialFullName);
  const [profileData, setProfileData] = useState(null);

  // ── Data Fetching ──

  // Removed old fetchDocuments as it now paginates inside DocumentManager

  const fetchTrashDocuments = async () => {
    try {
      const response = await fetchWithAuth(TRASH_API_URL);

      if (response.ok) {
        const data = await response.json();
        if ((data.code === 0 || data.code === 1000) && data.result) {
          const mappedDocs = data.result.map(d => ({
            id: d.documentId,
            name: d.fileName || 'Untitled',
            type: d.fileExtension?.replace('.', '') || 'unknown',
            fileSizeBytes: d.fileSize || 0,
            size: d.fileSize ? `${(d.fileSize / (1024 * 1024)).toFixed(2)} MB` : '0 MB',
            uploadedAt: d.deletedAt || new Date().toISOString(),
            timeSinceUpload: d.timeSinceUpload,
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

  const refreshAll = () => {
    setRefreshKey(prev => prev + 1);
    fetchTrashDocuments();
    fetchProfile();
  };

  const fetchProfile = async () => {
    try {
      const response = await fetchWithAuth(USER_PROFILE_API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        const resultData = data.result || (data.email ? data : null);

        if ((data.code === 0 || data.code === 1000 || !data.code) && resultData) {
          const mappedData = {
            ...resultData,
            avatarUrl: resultData.avatarUrl || resultData.avatar || ''
          };
          setProfileData(mappedData);
          if (mappedData.fullname) setFullName(mappedData.fullname);
          if (mappedData.avatarUrl) setAvatarUrl(mappedData.avatarUrl);
        }
      }
    } catch (error) {
      console.error("Lỗi lấy thông tin hồ sơ:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Computed Values ──

  // TODO: Xóa logic tự tính dung lượng bằng vòng lặp ở FE.
  // Cần gọi API GET /api/v1/users/storage-stats từ Back-end để lấy số liệu thực tế an toàn hơn.
  const totalStorageMB = 0;
  const storagePercentage = 0;

  // ── Handlers ──

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

  const handleRenameDocument = (docId, newName) => {
    // handled internally now
  };

  // ── Page Rendering ──

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardScreen
            refreshTrigger={refreshKey}
            searchTerm={searchTerm}
            onUpdateDocumentsCount={setDocumentsCount}
            onRefreshDocuments={refreshAll}
            currentUser={fullName}
            onLogout={handleLogoutClick}
            onNavigate={handleNavigate}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            initialProfileData={profileData}
            currentUser={fullName}
            documentsCount={documentsCount}
            storagePercentage={storagePercentage}
            totalStorageMB={totalStorageMB}
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
            onRefreshDocuments={refreshAll}
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
      storagePercentage={storagePercentage}
      totalStorageMB={totalStorageMB}
      documentsCount={documentsCount}
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

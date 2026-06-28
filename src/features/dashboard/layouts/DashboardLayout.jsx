import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';
import { LOGOUT_API_URL } from '../../auth/hooks/useAuth';
import { axiosClient } from '../../../utils/apiClient.js';
import MainLayout from './MainLayout.jsx';
import { profileApi } from '../../profile/api/profile.api.js';
import { useProfile } from '../../profile/hooks/useProfile.js';
import { useTrash } from '../../trash/hooks/useTrash.js';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // ── State ──
  const [searchTerm, setSearchTerm] = useState('');
  const [accentColor, setAccentColor] = useState('#ff5c00');
  const [documentsCount, setDocumentsCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [usedStorageBytes, setUsedStorageBytes] = useState(0);
  const [maxStorageBytes, setMaxStorageBytes] = useState(500 * 1024 * 1024);
  
  const { profileData, fullName, avatarUrl, fetchProfile, setAvatarUrl } = useProfile();
  const { trashDocuments, fetchTrashDocuments } = useTrash();

  // Determine currentView based on pathname to highlight Sidebar correctly
  const path = location.pathname;
  let currentView = 'dashboard';
  if (path.includes('/dashboard/profile')) currentView = 'profile';
  else if (path.includes('/dashboard/trash')) currentView = 'trash';
  else if (path.includes('/dashboard/group')) currentView = 'community';
  else if (path.includes('/dashboard/ai')) currentView = 'ai';

  const fetchStorageUsage = async () => {
    try {
      const data = await profileApi.getStorageUsage();
      if (data && data.result) {
        console.log("STORAGE API RESPONSE:", data.result);
        setUsedStorageBytes(data.result.usedStorage || 0);
        setMaxStorageBytes(data.result.maxStorage || data.result.quotaSize || data.result.maxStorageSize || data.result.totalCapacity || 500 * 1024 * 1024);
      }
    } catch (e) {
      console.error('Failed to fetch storage usage', e);
    }
  };

  const refreshAll = () => {
    setRefreshKey(prev => prev + 1);
    fetchProfile();
    fetchStorageUsage();
    if (currentView === 'trash') {
      fetchTrashDocuments();
    }
  };

  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentView === 'trash' && trashDocuments.length === 0) {
      fetchTrashDocuments();
    }
  }, [currentView, trashDocuments.length, fetchTrashDocuments]);

  const maxStorageMB = Number((maxStorageBytes / (1024 * 1024)).toFixed(1));
  const totalStorageMB = Number((usedStorageBytes / (1024 * 1024)).toFixed(1));
  const storagePercentage = Math.min(100, Math.round((usedStorageBytes / maxStorageBytes) * 100));

  const handleLogoutClick = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axiosClient.post(LOGOUT_API_URL, { refreshToken });

      if (response.status === 200 || response.data?.code === 0 || response.data?.code === 1000) {
        message.success('Đã đăng xuất thành công khỏi hệ thống!');
      } else {
        message.warning('Phiên đăng nhập đã hết hạn, tự động thoát!');
      }
    } catch (error) {
      console.error("Logout Error:", error);
      message.warning('Tự động thoát!');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/', { replace: true });
    }
  };

  return (
    <MainLayout
      currentView={currentView}
      onLogout={handleLogoutClick}
      currentUser={fullName}
      storagePercentage={storagePercentage}
      totalStorageMB={totalStorageMB}
      maxStorageMB={maxStorageMB}
      documentsCount={documentsCount}
      deletedDocsCount={trashDocuments.length}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      avatarUrl={avatarUrl}
      accentColor={accentColor}
      isAdmin={false}
    >
      <Outlet context={{
        searchTerm,
        refreshKey,
        refreshAll,
        documentsCount,
        setDocumentsCount,
        trashDocuments,
        profileData,
        fullName,
        avatarUrl,
        setAvatarUrl,
        accentColor,
        setAccentColor,
        totalStorageMB,
        storagePercentage
      }} />
    </MainLayout>
  );
}

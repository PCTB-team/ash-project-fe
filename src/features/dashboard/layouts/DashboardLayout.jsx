import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { message, Spin } from 'antd';
import { LOGOUT_API_URL } from '../../auth/hooks/useAuth';
import { axiosClient } from '../../../utils/apiClient.js';
import MainLayout from './MainLayout.jsx';
import { profileApi } from '../../profile/api/profile.api.js';
import { useProfile } from '../../profile/hooks/useProfile.js';
import { useTrash } from '../../trash/hooks/useTrash.js';
import { useAuthContext } from '../../../contexts/AuthContext.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, fetchStorageUsage } from '../../../redux/slices/userSlice.js';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // ── State ──
  const [isInitializing, setIsInitializing] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [accentColor, setAccentColor] = useState('#ff5c00');
  const [documentsCount, setDocumentsCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { logout } = useAuthContext();
  const dispatch = useDispatch();
  
  const { profileData, fullName, avatarUrl, usedStorageBytes, maxStorageBytes } = useSelector((state) => state.user);

  const { trashDocuments, fetchTrashDocuments } = useTrash();

  // Determine currentView based on pathname to highlight Sidebar correctly
  const path = location.pathname;
  let currentView = 'dashboard';
  if (path.includes('/dashboard/profile')) currentView = 'profile';
  else if (path.includes('/dashboard/trash')) currentView = 'trash';
  else if (path.includes('/dashboard/group')) currentView = 'community';
  else if (path.includes('/dashboard/ai')) currentView = 'ai';

  const fetchStorageUsageData = async () => {
    // Moved to Redux AsyncThunk
  };

  const refreshAll = async () => {
    setIsInitializing(true);
    setRefreshKey(prev => prev + 1);
    await Promise.allSettled([
      dispatch(fetchUserProfile()).unwrap().catch(() => {}),
      dispatch(fetchStorageUsage()).unwrap().catch(() => {}),
      (currentView === 'trash' || trashDocuments.length === 0) ? fetchTrashDocuments() : Promise.resolve()
    ]);
    setIsInitializing(false);
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
      logout();
      navigate('/', { replace: true });
    }
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-[#fafafb]">
        <div className="flex flex-col items-center gap-4">
          <Spin size="large" indicator={<i className="bi bi-fan text-[32px] text-[#ff5c00] animate-[spin_2s_linear_infinite]" />} />
          <span className="text-[14px] font-semibold text-black/40 animate-pulse">Đang tải không gian làm việc...</span>
        </div>
      </div>
    );
  }

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
        accentColor,
        setAccentColor,
        totalStorageMB,
        maxStorageMB,
        storagePercentage
      }} />
    </MainLayout>
  );
}

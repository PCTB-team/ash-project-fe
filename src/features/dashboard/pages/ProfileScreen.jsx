import { useState, useEffect } from 'react';
import { Button, message, Tooltip } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import logoAvatarDefault from '../../../assets/logo_avatar_default.jpg';
import { fetchWithAuth } from '../../../utils/apiClient.js';
import { useOutletContext } from 'react-router-dom';

const USER_PROFILE_API_URL = 'https://ash-project-be.onrender.com/api/v1/user/profile';

export default function ProfileScreen() {
  const {
    profileData: initialProfileData,
    fullName: currentUser,
    documentsCount,
    storagePercentage,
    totalStorageMB,
    avatarUrl,
    setAvatarUrl: onAvatarChange,
    accentColor,
    setAccentColor: onAccentColorChange,
  } = useOutletContext();

  const [profileData, setProfileData] = useState(initialProfileData || { id: '', username: '', email: '', fullname: '', avatarUrl: avatarUrl || '', school: '' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [imgError, setImgError] = useState(false);

  // Xử lý các loại định dạng đường dẫn ảnh trả về từ Backend
  const getDisplayAvatar = (url) => {
    if (!url || url === logoAvatarDefault) return logoAvatarDefault;
    if (url.startsWith('http') || url.startsWith('data:image')) return url;
    if (url.startsWith('res.cloudinary.com')) return `https://${url}`;
    if (url.startsWith('/')) return `https://ash-project-be.onrender.com${url}`;
    if (/^[A-Za-z0-9+/=]{50,}$/.test(url.trim())) return `data:image/jpeg;base64,${url.trim()}`;
    return `https://ash-project-be.onrender.com/${url}`;
  };

  useEffect(() => {
    if (initialProfileData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfileData(initialProfileData);
    }
  }, [initialProfileData]);

  const handleSaveSettings = async () => {
    if (!profileData.fullname?.trim()) {
      message.error("Họ và Tên không được để trống!");
      return;
    }
    try {
      const formData = new FormData();
      formData.append('fullname', profileData.fullname || '');
      formData.append('school', profileData.school || '');
      formData.append('username', profileData.username || '');
      if (avatarFile) {
        formData.append('file', avatarFile);
      }

      const response = await fetchWithAuth(USER_PROFILE_API_URL, {
        method: 'PUT',
        headers: { 'Accept': 'application/json' },
        body: formData
      });

      let data = {};
      try { data = await response.json(); } catch { console.warn('Cannot parse JSON'); }

      if (response.ok || data.code === 0 || data.code === 1000) {
        if ((data.code === 0 || data.code === 1000) && data.result) {
          const mappedData = {
            ...data.result,
            avatarUrl: data.result.avatarUrl || data.result.avatar || ''
          };
          setProfileData(mappedData);
          if (mappedData.avatarUrl && onAvatarChange) onAvatarChange(mappedData.avatarUrl);
          setIsEditingProfile(false);
          message.success('Đã lưu thông tin hồ sơ thành công!');
        } else if (response.ok && !data.code) {
          setIsEditingProfile(false);
          message.success('Đã lưu thông tin hồ sơ thành công!');
        } else {
          message.error(data.message || 'Cập nhật thất bại');
        }
      } else {
        message.error(data.message || `Lỗi từ server: ${response.status}`);
      }
    } catch (error) {
      console.error("Lỗi lưu hồ sơ:", error);
      message.error(`Lỗi kết nối: ${error.message}`);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        message.error('Kích thước ảnh không vượt quá 10MB.');
        return;
      }
      setAvatarFile(file);
      setImgError(false);

      const reader = new FileReader();
      reader.onloadend = () => {
        onAvatarChange(reader.result);
        setProfileData(prev => ({ ...prev, avatarUrl: reader.result }));
      };
      reader.readAsDataURL(file);

      message.loading({ content: 'Đang đồng bộ ảnh đại diện...', key: 'avatar-upload' });
      try {
        const formData = new FormData();
        formData.append('fullname', profileData.fullname || '');
        formData.append('school', profileData.school || '');
        formData.append('username', profileData.username || '');
        formData.append('file', file);

        const response = await fetchWithAuth(USER_PROFILE_API_URL, {
          method: 'PUT',
          headers: { 'Accept': 'application/json' },
          body: formData
        });

        let data = {};
        try { data = await response.json(); } catch { /* ignore */ }

        if (response.ok || data.code === 0 || data.code === 1000) {
          message.success({ content: 'Đã lưu ảnh đại diện thành công!', key: 'avatar-upload' });
          if ((data.code === 0 || data.code === 1000) && data.result) {
            const mappedData = {
              ...data.result,
              avatarUrl: data.result.avatarUrl || data.result.avatar || ''
            };
            setProfileData(mappedData);
            if (mappedData.avatarUrl && onAvatarChange) onAvatarChange(mappedData.avatarUrl);
          }
        } else {
          message.error({ content: data.message || 'Lỗi lưu ảnh', key: 'avatar-upload' });
        }
      } catch {
        message.error({ content: 'Lỗi kết nối khi lưu ảnh', key: 'avatar-upload' });
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24, staggerChildren: 0.1 } }
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto bg-[#fafafb] relative pb-20">

      <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-6 md:py-12">

        {/* ── Profile Header ── */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="relative group shrink-0 w-max mx-auto md:mx-0">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden shadow-sm bg-white border border-black/5">
                <img
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  src={imgError ? logoAvatarDefault : (getDisplayAvatar(profileData.avatarUrl) || getDisplayAvatar(avatarUrl) || logoAvatarDefault)}
                  onError={() => setImgError(true)}
                />
              </div>
              <label className="absolute bottom-0 right-0 md:bottom-1 md:right-1 w-8 h-8 bg-white border border-black/10 rounded-full flex items-center justify-center text-black/60 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:shadow-md cursor-pointer transition-all shadow-sm">
                <i className="bi bi-camera text-[14px]" />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h1 className="text-[24px] md:text-[32px] font-bold text-gray-900 tracking-tight leading-none mb-3 flex flex-col sm:flex-row items-center gap-3">
                <span>{profileData.fullname || currentUser || 'Người dùng'}</span>

                {/* TikTok-style Fire Streak */}
                <Tooltip title="Chuỗi ngày học tập liên tiếp">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] cursor-pointer hover:scale-105 transition-transform">
                    <i className="bi bi-fire text-yellow-300 text-[18px] animate-pulse drop-shadow-md" />
                    <span className="text-white font-black text-[16px] tracking-wider italic drop-shadow-md">14</span>
                  </div>
                </Tooltip>
              </h1>
              <p className="text-[14px] text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2">
                <i className="bi bi-envelope" />
                {profileData.email || 'Đang tải...'}
              </p>
            </div>
          </div>

          {/* Quick Actions / Badges */}
          <div className="flex gap-3">
            <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex items-center gap-2">
              <i className="bi bi-stars text-amber-500 text-[16px]" />
              <span className="text-[13px] font-bold text-amber-700">Ultra Member</span>
            </div>
          </div>
        </div>

        {/* ── Main Layout Grid ── */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

          {/* ── Left Column: Overview & Security (1/2) ── */}
          <div className="lg:col-span-1 flex flex-col gap-6 lg:h-full lg:justify-between">
            
            {/* About Card */}
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-5">
              <h3 className="text-[14px] font-semibold text-gray-900 mb-4">Giới thiệu</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-[13.5px]">
                  <i className="bi bi-bank text-gray-400 text-[16px] mt-0.5" />
                  <div>
                    <span className="block text-gray-500 mb-0.5">Trường học</span>
                    <span className="font-medium text-gray-900">{profileData.school || 'Chưa cập nhật'}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-[13.5px]">
                  <i className="bi bi-person-badge text-gray-400 text-[16px] mt-0.5" />
                  <div>
                    <span className="block text-gray-500 mb-0.5">Tên đăng nhập</span>
                    <span className="font-medium text-gray-900">@{profileData.username || 'username'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Card */}
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-5">
              <h3 className="text-[14px] font-semibold text-gray-900 mb-4">Bảo mật</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2.5 text-[13.5px]">
                    <i className="bi bi-envelope-check text-emerald-500 text-[16px]" />
                    <span className="font-medium text-gray-700">Email</span>
                  </div>
                  <span className="text-[12px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Đã xác minh</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2.5 text-[13.5px]">
                    <i className="bi bi-key text-gray-400 text-[16px]" />
                    <span className="font-medium text-gray-700">Mật khẩu</span>
                  </div>
                  <button className="text-[13px] font-medium text-blue-600 hover:text-blue-700">Thay đổi</button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2.5 text-[13.5px]">
                    <i className="bi bi-shield-check text-gray-400 text-[16px]" />
                    <span className="font-medium text-gray-700">2FA</span>
                  </div>
                  <span className="text-[13px] font-medium text-gray-400">Chưa bật</span>
                </div>
              </div>
            </div>

          </div>

          {/* ── Right Column: Forms & Settings (1/2) ── */}
          <div className="lg:col-span-1 flex flex-col gap-6 lg:h-full lg:justify-between">

            {/* Personal Information Form */}
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[16px] font-semibold text-gray-900">Thông tin cá nhân</h3>
                {!isEditingProfile && (
                  <Button onClick={() => setIsEditingProfile(true)} type="text" className="!text-[13px] !font-medium text-gray-600 hover:text-gray-900">
                    <i className="bi bi-pencil-square mr-1" /> Chỉnh sửa
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-gray-600">Họ và Tên</label>
                  <input
                    type="text"
                    value={profileData.fullname || ''}
                    onChange={(e) => setProfileData({ ...profileData, fullname: e.target.value })}
                    disabled={!isEditingProfile}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-transparent text-[14px] text-gray-900 outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300 ease-in-out"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-gray-600">Email liên kết</label>
                  <input
                    type="email"
                    value={profileData.email || ''}
                    disabled
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-[14px] text-gray-500 outline-none cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[12px] font-medium text-gray-600">Tên trường học</label>
                  <input
                    type="text"
                    value={profileData.school || ''}
                    onChange={(e) => setProfileData({ ...profileData, school: e.target.value })}
                    disabled={!isEditingProfile}
                    placeholder="VD: Đại học Công nghệ Thông tin..."
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-transparent text-[14px] text-gray-900 outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300 ease-in-out"
                  />
                </div>
              </div>

              <AnimatePresence>
                {isEditingProfile && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="mt-6 pt-5 border-t border-gray-100 flex justify-end gap-3">
                      <Button onClick={() => setIsEditingProfile(false)} className="!h-9 !rounded-lg !text-[13px] !font-medium">Hủy</Button>
                      <Button type="primary" onClick={handleSaveSettings} className="!h-9 !rounded-lg !text-[13px] !font-medium !bg-[var(--color-primary)] !border-none hover:!brightness-110">
                        Lưu thay đổi
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Storage & Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              {/* Cloud Storage Linear */}
              <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-[14px] font-semibold text-gray-900">Bộ nhớ đám mây</h3>
                    <i className="bi bi-cloud text-gray-400 text-[16px]" />
                  </div>
                  <p className="text-[12px] text-gray-500 mb-6">Đã sử dụng {totalStorageMB < 1 ? `${(totalStorageMB * 1024).toFixed(1)} KB` : `${totalStorageMB.toFixed(1)} MB`} trong tổng số 1.0 GB</p>
                </div>

                <div>
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-[24px] font-bold text-gray-900 leading-none">{storagePercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${storagePercentage}%` }}
                      transition={{ duration: 1 }}
                      className="h-full rounded-full bg-[var(--color-primary)]"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <i className="bi bi-file-earmark-text text-[24px]" />
                  </div>
                  <span className="text-[12px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">Tổng cộng</span>
                </div>
                <div>
                  <span className="text-[36px] font-bold text-gray-900 leading-none block mb-1">{documentsCount}</span>
                  <span className="block text-[13px] font-medium text-gray-500">Tài liệu đã đóng góp lên hệ thống</span>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}

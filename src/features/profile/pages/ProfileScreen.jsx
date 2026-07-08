import { useState, useEffect, useMemo } from 'react';
import { Button, message, Tooltip, Form, Modal, Input } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import logoAvatarDefault from '../../../assets/logo_avatar_default.jpg';
import { useOutletContext } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile.js';
import { profileApi } from '../api/profile.api.js';
import './profile.css';

const getPlanStyle = (code) => {
  const styles = {
    FREE: { bg: '#f3f4f6', text: '#4b5563', border: '#e5e7eb', icon: 'bi-box', gradient: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)' },
    GO: { bg: '#dbeafe', text: '#2563eb', border: '#bfdbfe', icon: 'bi-rocket-takeoff-fill', gradient: 'linear-gradient(135deg, #dbeafe, #bfdbfe)' },
    PLUS: { bg: '#f3e8ff', text: '#7c3aed', border: '#e9d5ff', icon: 'bi-lightning-charge-fill', gradient: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)' },
    PRO: { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa', icon: 'bi-star-fill', gradient: 'linear-gradient(135deg, #fff7ed, #fed7aa)' },
    CUSTOM: { bg: '#1e293b', text: '#f8fafc', border: '#334155', icon: 'bi-gem', gradient: 'linear-gradient(135deg, #1e293b, #334155)' },
  };
  return styles[code] || styles.FREE;
};

/* ── Circular SVG Storage Ring ── */
function StorageRing({ percentage, accentColor }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="storage-ring">
      <svg viewBox="0 0 120 120">
        <circle className="storage-ring-bg" cx="60" cy="60" r={radius} />
        <motion.circle
          className="storage-ring-fill"
          cx="60" cy="60" r={radius}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
          style={{ stroke: accentColor }}
        />
      </svg>
      <div className="storage-ring-text">
        <motion.span
          className="storage-ring-percentage"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {percentage.toFixed(0)}%
        </motion.span>
        <span className="storage-ring-label">đã dùng</span>
      </div>
    </div>
  );
}

export default function ProfileScreen() {
  const {
    profileData: initialProfileData,
    fullName: currentUser,
    documentsCount,
    storagePercentage,
    totalStorageMB,
    maxStorageMB,
    avatarUrl,
    setAvatarUrl: onAvatarChange,
    accentColor,
    setAccentColor: onAccentColorChange,
  } = useOutletContext();

  const { updateProfile } = useProfile();

  const [profileData, setProfileData] = useState(initialProfileData || { id: '', username: '', email: '', fullname: '', avatarUrl: avatarUrl || '', school: '' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordForm] = Form.useForm();
  const [storageData, setStorageData] = useState(null);
  const [storageLoading, setStorageLoading] = useState(true);

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
    if (initialProfileData) setProfileData(initialProfileData);
  }, [initialProfileData]);

  useEffect(() => {
    const fetchStorage = async () => {
      try {
        setStorageLoading(true);
        const res = await profileApi.getStorageUsage();
        if (res.result) setStorageData(res.result);
      } catch (err) {
        console.error("Failed to fetch storage data:", err);
      } finally {
        setStorageLoading(false);
      }
    };
    fetchStorage();
  }, []);

  const handleSaveSettings = async () => {
    if (!profileData.fullname?.trim()) { message.error("Họ và Tên không được để trống!"); return; }
    const formData = new FormData();
    formData.append('fullname', profileData.fullname || '');
    formData.append('school', profileData.school || '');
    formData.append('username', profileData.username || '');
    if (avatarFile) formData.append('file', avatarFile);
    const result = await updateProfile(formData);
    if (result.success) {
      setProfileData(result.data);
      if (result.data.avatarUrl && onAvatarChange) onAvatarChange(result.data.avatarUrl);
      setIsEditingProfile(false);
      message.success('Đã lưu thông tin hồ sơ thành công!');
    } else {
      message.error(result.message || 'Cập nhật thất bại');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { message.error('Kích thước ảnh không vượt quá 10MB.'); return; }
    setAvatarFile(file);
    setImgError(false);
    const reader = new FileReader();
    reader.onloadend = () => { onAvatarChange(reader.result); setProfileData(prev => ({ ...prev, avatarUrl: reader.result })); };
    reader.readAsDataURL(file);
    message.loading({ content: 'Đang đồng bộ ảnh đại diện...', key: 'avatar-upload' });
    const formData = new FormData();
    formData.append('fullname', profileData.fullname || '');
    formData.append('school', profileData.school || '');
    formData.append('username', profileData.username || '');
    formData.append('file', file);
    const result = await updateProfile(formData);
    if (result.success) {
      message.success({ content: 'Đã lưu ảnh đại diện thành công!', key: 'avatar-upload' });
      setProfileData(result.data);
      if (result.data.avatarUrl && onAvatarChange) onAvatarChange(result.data.avatarUrl);
    } else {
      message.error({ content: result.message || 'Lỗi lưu ảnh', key: 'avatar-upload' });
    }
  };

  const handleChangePassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) { message.error("Mật khẩu xác nhận không khớp!"); return; }
    setPasswordLoading(true);
    try {
      const res = await profileApi.changePassword(values.oldPassword, values.newPassword);
      if (res.code === 0 || res.code === 1000 || res.status === 200) {
        message.success("Đổi mật khẩu thành công!");
        setIsPasswordModalVisible(false);
        passwordForm.resetFields();
      } else { message.error(res.message || "Đổi mật khẩu thất bại!"); }
    } catch (e) {
      console.error(e);
      message.error(e.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau!");
    } finally { setPasswordLoading(false); }
  };

  const planStyle = useMemo(() => storageData ? getPlanStyle(storageData.planCode) : null, [storageData]);
  const displayAvatar = imgError ? logoAvatarDefault : (getDisplayAvatar(profileData.avatarUrl) || getDisplayAvatar(avatarUrl) || logoAvatarDefault);

  const cardAnim = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }
  });

  return (
    <div className="flex-1 w-full h-full overflow-y-auto bg-[#fafafb] relative pb-20" style={{ '--profile-accent': accentColor || '#ff5c00' }}>
      <div className="max-w-[920px] mx-auto px-4 md:px-6 py-6 md:py-8">

        {/* ══ Cover Banner ══ */}
        <motion.div className="profile-banner" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
          {/* Decorative floating shapes */}
          <motion.div className="absolute top-6 right-8 w-20 h-20 rounded-full border border-white/20" animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute top-12 right-32 w-8 h-8 rounded-lg bg-white/10" animate={{ rotate: [0, 90, 0], y: [0, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute bottom-16 left-[60%] w-12 h-12 rounded-full bg-white/5 border border-white/10" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
        </motion.div>

        {/* ══ Profile Header ══ */}
        <div className="px-5 md:px-8 -mt-1">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6">

            {/* Avatar */}
            <motion.div className="profile-avatar-wrapper" {...cardAnim(0.1)}>
              <div className="profile-avatar">
                <img alt="Avatar" src={displayAvatar} onError={() => setImgError(true)} />
              </div>
              <label className="avatar-upload-btn">
                <i className="bi bi-camera text-[14px]" />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </motion.div>

            {/* Name + Badges */}
            <motion.div className="flex flex-col items-center md:items-start mb-2 gap-2" {...cardAnim(0.2)}>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <h1 className="text-[26px] md:text-[30px] font-extrabold text-[#1a1a2e] m-0 leading-tight">
                  {profileData.fullname || currentUser || 'Người dùng'}
                </h1>
                {!storageLoading && planStyle && (
                  <div className="badge-plan" style={{ background: planStyle.gradient, color: planStyle.text, border: `1px solid ${planStyle.border}` }}>
                    <i className={`bi ${planStyle.icon}`} />
                    {storageData.planName}
                  </div>
                )}
                <Tooltip title="Chuỗi ngày học tập liên tiếp">
                  <div className="badge-streak">
                    <i className="bi bi-fire text-yellow-300 text-[16px]" />
                    {profileData.streak || 0}
                  </div>
                </Tooltip>
              </div>
              <p className="text-[14px] text-black/40 font-medium flex items-center gap-2 m-0">
                <i className="bi bi-envelope text-[13px]" />
                {profileData.email || 'Đang tải...'}
              </p>
              {profileData.isPremium && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                  <i className="bi bi-stars text-amber-500 text-[14px]" />
                  <span className="text-[12px] font-bold text-amber-700">Ultra Member</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* ══ Bento Grid ══ */}
        <div className="profile-bento-grid mt-6">

          {/* ── About Card ── */}
          <motion.div className="glass-card p-5 bento-about" {...cardAnim(0.25)}>
            <div className="section-header">
              <div className="section-header-icon bg-violet-50 text-violet-500"><i className="bi bi-person-lines-fill" /></div>
              <h3>Giới thiệu</h3>
            </div>
            <div className="space-y-1">
              <div className="info-item">
                <div className="info-item-icon bg-blue-50 text-blue-500"><i className="bi bi-bank" /></div>
                <div>
                  <span className="block text-[11px] font-semibold text-black/35 uppercase tracking-wide">Trường học</span>
                  <span className="text-[14px] font-semibold text-[#1a1a2e]">{profileData.school || 'Chưa cập nhật'}</span>
                </div>
              </div>
              <div className="info-item">
                <div className="info-item-icon bg-emerald-50 text-emerald-500"><i className="bi bi-person-badge" /></div>
                <div>
                  <span className="block text-[11px] font-semibold text-black/35 uppercase tracking-wide">Tên đăng nhập</span>
                  <span className="text-[14px] font-semibold text-[#1a1a2e]">{profileData.username || 'username'}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Security Card ── */}
          <motion.div className="glass-card p-5 bento-security" {...cardAnim(0.35)}>
            <div className="section-header">
              <div className="section-header-icon bg-rose-50 text-rose-500"><i className="bi bi-shield-lock-fill" /></div>
              <h3>Bảo mật</h3>
            </div>
            <div>
              <div className="security-row">
                <div className="flex items-center gap-3">
                  <div className="security-icon bg-emerald-50 text-emerald-500"><i className="bi bi-envelope-check-fill" /></div>
                  <div>
                    <span className="text-[13.5px] font-semibold text-[#1a1a2e] block">Email</span>
                    <span className="text-[11px] text-black/35">{profileData.email}</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">✓ Đã xác minh</span>
              </div>
              <div className="security-row">
                <div className="flex items-center gap-3">
                  <div className="security-icon bg-amber-50 text-amber-500"><i className="bi bi-key-fill" /></div>
                  <div>
                    <span className="text-[13.5px] font-semibold text-[#1a1a2e] block">Mật khẩu</span>
                    <span className="text-[11px] text-black/35">••••••••</span>
                  </div>
                </div>
                <button onClick={() => setIsPasswordModalVisible(true)} className="text-[12px] font-bold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border-none cursor-pointer">
                  Thay đổi
                </button>
              </div>
              <div className="security-row">
                <div className="flex items-center gap-3">
                  <div className="security-icon bg-purple-50 text-purple-500"><i className="bi bi-shield-check" /></div>
                  <div>
                    <span className="text-[13.5px] font-semibold text-[#1a1a2e] block">Xác thực 2 lớp</span>
                    <span className="text-[11px] text-black/35">Bảo vệ tài khoản nâng cao</span>
                  </div>
                </div>
                <span className="text-[12px] font-semibold text-black/25 bg-black/[0.03] px-2.5 py-1 rounded-lg">Chưa bật</span>
              </div>
            </div>
          </motion.div>

          {/* ── Personal Info Form ── */}
          <motion.div className="glass-card p-6 bento-info" {...cardAnim(0.3)}>
            <div className="flex items-center justify-between mb-5">
              <div className="section-header !mb-0">
                <div className="section-header-icon bg-orange-50 text-orange-500"><i className="bi bi-pencil-square" /></div>
                <h3>Thông tin cá nhân</h3>
              </div>
              {!isEditingProfile && (
                <Button onClick={() => setIsEditingProfile(true)} type="text" className="!text-[12px] !font-bold !text-black/40 hover:!text-[var(--profile-accent)]">
                  <i className="bi bi-pen mr-1" /> Chỉnh sửa
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
              <div>
                <label className="input-label">Họ và Tên</label>
                <input type="text" value={profileData.fullname || ''} onChange={(e) => setProfileData({ ...profileData, fullname: e.target.value })} disabled={!isEditingProfile} className="profile-input" />
              </div>
              <div>
                <label className="input-label">Email liên kết</label>
                <input type="email" value={profileData.email || ''} disabled className="profile-input" style={{ cursor: 'not-allowed' }} />
              </div>
              <div className="md:col-span-2">
                <label className="input-label">Tên trường học</label>
                <input type="text" value={profileData.school || ''} onChange={(e) => setProfileData({ ...profileData, school: e.target.value })} disabled={!isEditingProfile} placeholder="VD: Đại học Công nghệ Thông tin..." className="profile-input" />
              </div>
            </div>
            <AnimatePresence>
              {isEditingProfile && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                  <div className="save-actions">
                    <Button onClick={() => setIsEditingProfile(false)} className="!h-9 !rounded-xl !text-[13px] !font-semibold">Hủy</Button>
                    <Button type="primary" onClick={handleSaveSettings} className="!h-9 !rounded-xl !text-[13px] !font-semibold !border-none hover:!brightness-110" style={{ background: accentColor }}>
                      Lưu thay đổi
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Storage + Stats ── */}
          <motion.div className="bento-storage grid grid-cols-1 sm:grid-cols-2 gap-4" {...cardAnim(0.4)}>
            {/* Storage Ring */}
            <div className="glass-card p-5 flex flex-col items-center justify-center text-center">
              <StorageRing percentage={storagePercentage} accentColor={accentColor || '#ff5c00'} />
              <div className="mt-3">
                <span className="text-[13px] font-bold text-[#1a1a2e]">Bộ nhớ đám mây</span>
                <p className="text-[11px] text-black/35 m-0 mt-0.5">
                  {totalStorageMB < 1 ? `${(totalStorageMB * 1024).toFixed(1)} KB` : `${totalStorageMB.toFixed(1)} MB`} / {maxStorageMB} MB
                </p>
              </div>
            </div>
            {/* Docs Count */}
            <div className="glass-card p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                  <i className="bi bi-file-earmark-text text-[22px]" />
                </div>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">Tổng cộng</span>
              </div>
              <div className="mt-3">
                <motion.span className="stats-number block" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}>
                  {documentsCount}
                </motion.span>
                <span className="block text-[12px] font-medium text-black/40 mt-1">Tài liệu đã đóng góp</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ══ Change Password Modal ══ */}
      <Modal title={null} open={isPasswordModalVisible} onCancel={() => { setIsPasswordModalVisible(false); passwordForm.resetFields(); }} footer={null} width={420} destroyOnClose centered className="profile-password-modal">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
            <i className="bi bi-shield-lock-fill text-[22px]" />
          </div>
          <h3 className="text-[20px] font-extrabold text-[#1a1a2e] m-0">Đổi mật khẩu</h3>
          <p className="text-[13px] text-black/40 m-0 mt-1">Đảm bảo tài khoản của bạn luôn an toàn</p>
        </div>
        <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
          <Form.Item name="oldPassword" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}>
            <Input.Password placeholder="Mật khẩu hiện tại" size="large" className="!rounded-xl" prefix={<i className="bi bi-lock text-gray-400 mr-1" />} />
          </Form.Item>
          <Form.Item name="newPassword" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }, { min: 6, message: 'Ít nhất 6 ký tự!' }]}>
            <Input.Password placeholder="Mật khẩu mới" size="large" className="!rounded-xl" prefix={<i className="bi bi-key-fill text-gray-400 mr-1" />} />
          </Form.Item>
          <Form.Item name="confirmPassword" rules={[{ required: true, message: 'Xác nhận mật khẩu!' }]}>
            <Input.Password placeholder="Xác nhận mật khẩu mới" size="large" className="!rounded-xl" prefix={<i className="bi bi-check-circle-fill text-gray-400 mr-1" />} />
          </Form.Item>
          <div className="flex gap-3 mt-6">
            <Button className="flex-1 !h-11 !rounded-xl !font-semibold" onClick={() => setIsPasswordModalVisible(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={passwordLoading} className="flex-1 !h-11 !rounded-xl !font-semibold !border-none" style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}>Cập nhật</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

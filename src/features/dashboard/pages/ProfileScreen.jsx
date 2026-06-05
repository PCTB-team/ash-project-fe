import { useState, useEffect } from 'react';
import { Button, message, Tooltip, Spin } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';

const USER_PROFILE_API_URL = 'http://localhost:8080/api/v1/user/profile';

export default function ProfileScreen({
  currentUser,
  documentsCount,
  storagePercentage,
  avatarUrl,
  onAvatarChange,
  accentColor,
  onAccentColorChange,
}) {
  const [profileData, setProfileData] = useState(() => {
    const cached = localStorage.getItem('cachedProfile');
    if (cached) {
      try { return JSON.parse(cached); } catch(e) {}
    }
    return { id: '', username: '', email: '', fullname: '', avatarUrl: avatarUrl || '', school: '' };
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);

  // Xử lý các loại định dạng đường dẫn ảnh trả về từ Backend
  const getDisplayAvatar = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:image')) return url;
    if (url.startsWith('/')) return `http://localhost:8080${url}`;
    // Nếu là mã Base64 thô (không có tiền tố data:image...)
    if (/^[A-Za-z0-9+/=]{50,}$/.test(url.trim())) return `data:image/jpeg;base64,${url.trim()}`;
    return `http://localhost:8080/${url}`; // Fallback cho relative path không có dấu /
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(USER_PROFILE_API_URL, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
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
            localStorage.setItem('cachedProfile', JSON.stringify(mappedData));
            if (mappedData.avatarUrl && onAvatarChange) {
              onAvatarChange(mappedData.avatarUrl);
              localStorage.setItem('cachedAvatar', mappedData.avatarUrl);
            }
          }
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin hồ sơ:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [onAvatarChange]);

  const handleSaveSettings = async () => {
    if (!profileData.fullname?.trim()) {
      message.error("Họ và Tên không được để trống!");
      return;
    }
    try {
      const token = localStorage.getItem('accessToken');
      
      const formData = new FormData();
      formData.append('fullname', profileData.fullname || '');
      formData.append('school', profileData.school || '');
      formData.append('username', profileData.username || '');
      // Chỉ gửi file ảnh nếu người dùng có chọn ảnh mới
      if (avatarFile) {
        formData.append('avatar', avatarFile); // Backend thường dùng tên field là 'avatar' hoặc 'file'
      }

      const response = await fetch(USER_PROFILE_API_URL, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      let data = {};
      try {
        data = await response.json();
      } catch (e) {
        console.warn('Cannot parse JSON from response', e);
      }

      if (response.ok || data.code === 0 || data.code === 1000) {
        if ((data.code === 0 || data.code === 1000) && data.result) {
          const mappedData = {
            ...data.result,
            avatarUrl: data.result.avatarUrl || data.result.avatar || ''
          };
          setProfileData(mappedData);
          localStorage.setItem('cachedProfile', JSON.stringify(mappedData));
          if (mappedData.avatarUrl && onAvatarChange) {
            onAvatarChange(mappedData.avatarUrl);
            localStorage.setItem('cachedAvatar', mappedData.avatarUrl);
          }
          setIsEditingProfile(false);
          message.success('Đã lưu thông tin hồ sơ thành công!');
        } else if (response.ok && !data.code) {
          // Fallback if backend doesn't return code
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
      setAvatarFile(file); // Lưu file thực tế để gửi qua FormData
      
      // Update UI immediately (Optimistic)
      const reader = new FileReader();
      reader.onloadend = () => {
        onAvatarChange(reader.result);
        setProfileData(prev => ({ ...prev, avatarUrl: reader.result }));
      };
      reader.readAsDataURL(file);

      // Auto-save logic
      message.loading({ content: 'Đang đồng bộ ảnh đại diện...', key: 'avatar-upload' });
      try {
        const token = localStorage.getItem('accessToken');
        const formData = new FormData();
        formData.append('fullname', profileData.fullname || '');
        formData.append('school', profileData.school || '');
        formData.append('username', profileData.username || '');
        formData.append('avatar', file);

        const response = await fetch(USER_PROFILE_API_URL, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        let data = {};
        try { data = await response.json(); } catch (err) {}

        if (response.ok || data.code === 0 || data.code === 1000) {
          message.success({ content: 'Đã lưu ảnh đại diện thành công!', key: 'avatar-upload' });
          if ((data.code === 0 || data.code === 1000) && data.result) {
            const mappedData = {
              ...data.result,
              avatarUrl: data.result.avatarUrl || data.result.avatar || ''
            };
            setProfileData(mappedData);
            localStorage.setItem('cachedProfile', JSON.stringify(mappedData));
            if (mappedData.avatarUrl && onAvatarChange) {
              onAvatarChange(mappedData.avatarUrl);
              localStorage.setItem('cachedAvatar', mappedData.avatarUrl);
            }
          }
        } else {
          message.error({ content: data.message || 'Lỗi lưu ảnh', key: 'avatar-upload' });
        }
      } catch (error) {
        message.error({ content: 'Lỗi kết nối khi lưu ảnh', key: 'avatar-upload' });
      }
    }
  };

  const colorOptions = [
    { name: 'Cam Thương Hiệu', value: '#ff5c00', glowClass: 'bg-[#ff5c00]', bg: 'bg-[#ff5c00]/10', border: 'border-[#ff5c00]/20' },
    { name: 'Tím Tinh Tú', value: '#a855f7', glowClass: 'bg-[#a855f7]', bg: 'bg-[#a855f7]/10', border: 'border-[#a855f7]/20' },
    { name: 'Xanh Electric', value: '#007aff', glowClass: 'bg-[#007aff]', bg: 'bg-[#007aff]/10', border: 'border-[#007aff]/20' },
    { name: 'Xanh Apple', value: '#34c759', glowClass: 'bg-[#34c759]', bg: 'bg-[#34c759]/10', border: 'border-[#34c759]/20' },
  ];

  const currentTheme = colorOptions.find(c => c.value === accentColor) || colorOptions[0];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const achievements = [
    { icon: 'bi-lightning-charge-fill', label: 'Tốc độ', desc: 'Đăng tải 10 file đầu tiên', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { icon: 'bi-chat-heart-fill', label: 'Sôi nổi', desc: 'Tạo 5 nhóm thảo luận', color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { icon: 'bi-shield-check', label: 'Xác thực', desc: 'Liên kết email sinh viên', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ];



  return (
    <div className="flex-1 w-full h-full overflow-y-auto px-4 md:px-8 pb-12 pt-4 text-left select-none relative bg-transparent max-w-[1400px] mx-auto">
      {/* Title Block */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-[28px] md:text-[32px] font-semibold text-[#1d1d1f] tracking-tight">Hồ sơ</h2>
        <p className="text-[13px] text-black/55 mt-1 font-medium">
          Quản lý định danh số, không gian làm việc và thống kê học tập
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start"
      >
        {/* Left Column: Premium Overview & Theme (xl:col-span-4) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          
          {/* Glowing Profile Overview Card */}
          <motion.div variants={itemVariants} className="bg-white rounded-[32px] p-6 shadow-sm border border-black/[0.03] flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-[var(--color-primary)]/10 to-transparent pointer-events-none" />
            
            <div className="relative mb-6 mt-4">
              <div className="absolute inset-0 bg-[var(--color-primary)] blur-2xl opacity-20 rounded-full scale-110 group-hover:opacity-30 transition-opacity" />
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-[4px] border-white shadow-xl bg-[#f5f5f7]">
                <img
                  alt="Avatar"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src={getDisplayAvatar(profileData.avatarUrl) || getDisplayAvatar(avatarUrl) || 'https://ui-avatars.com/api/?name=User&background=random'}
                />
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-semibold transition-opacity duration-300 cursor-pointer backdrop-blur-sm">
                  <i className="bi bi-camera-fill text-[20px] mb-1" />
                  <span>Đổi ảnh</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-1.5 mb-5 relative z-10">
              <div className="flex justify-center mb-2">
                <div className="px-3 py-1 bg-gradient-to-r from-gray-900 to-black rounded-full flex items-center gap-1.5 shadow-lg border border-white/10">
                  <i className="bi bi-stars text-amber-400 text-[12px]" />
                  <span className="text-[10px] font-semibold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">
                    Ultra
                  </span>
                </div>
              </div>
              <h3 className="text-[22px] font-semibold text-[#1d1d1f] tracking-tight">
                {profileData.fullname || currentUser || 'User'}
              </h3>
              <p className="text-[14px] font-semibold text-black/55">{profileData.email || 'Đang tải...'}</p>
            </div>
          </motion.div>

          {/* Theme Selector */}
          <motion.div variants={itemVariants} className="bg-white rounded-[32px] border border-black/[0.03] p-6 shadow-sm">
            <h4 className="text-[14px] font-semibold text-[#1d1d1f] mb-1">Theme hệ thống</h4>
            <p className="text-[12px] font-medium text-black/55 mb-5">Đồng bộ màu sắc toàn bộ dashboard</p>

            <div className="flex justify-between">
              {colorOptions.map((opt) => {
                const isSelected = accentColor === opt.value;
                return (
                  <Tooltip key={opt.value} title={opt.name}>
                    <button
                      onClick={() => {
                        onAccentColorChange(opt.value);
                        message.success(`Đã đồng bộ sang "${opt.name}"!`);
                      }}
                      className={`w-12 h-12 rounded-full ${opt.glowClass} transition-all duration-300 cursor-pointer relative flex items-center justify-center hover:scale-110 shadow-sm
                        ${isSelected ? 'ring-[3px] ring-offset-4 ring-black/10 scale-110 shadow-lg' : 'opacity-80 hover:opacity-100'}
                      `}
                    >
                      {isSelected && (
                        <motion.i 
                          initial={{ scale: 0 }} 
                          animate={{ scale: 1 }} 
                          className="bi bi-check-lg text-white text-[18px] font-medium" 
                        />
                      )}
                    </button>
                  </Tooltip>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Dashboard Layout (xl:col-span-8) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          
          {/* Stats Row */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-[32px] bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-500/20 relative overflow-hidden group shadow-sm">
              <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-widest block mb-1">Chuỗi học tập</span>
                  <span className="text-[36px] font-semibold text-[#1d1d1f] tracking-tight leading-none">14 <span className="text-[14px] text-black/55 font-medium ml-1">ngày</span></span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-amber-500 shadow-sm border border-amber-500/10">
                  <i className="bi bi-fire text-[20px]" />
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-[32px] ${currentTheme.bg} border ${currentTheme.border} relative overflow-hidden group shadow-sm`}>
              <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-[var(--color-primary)]/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <span className="text-[11px] font-semibold text-[var(--color-primary)] uppercase tracking-widest block mb-1">Tài liệu đóng góp</span>
                  <span className="text-[36px] font-semibold text-[#1d1d1f] tracking-tight leading-none">{documentsCount} <span className="text-[14px] text-black/55 font-medium ml-1">file</span></span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[var(--color-primary)] shadow-sm border border-[var(--color-primary)]/10">
                  <i className="bi bi-folder-check text-[20px]" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Settings / Information Form */}
          <motion.div variants={itemVariants} className="bg-white rounded-[32px] border border-black/[0.03] p-8 shadow-sm">
            <h4 className="text-[16px] font-semibold text-[#1d1d1f] mb-6 flex items-center gap-2">
              <i className="bi bi-person-vcard text-[var(--color-primary)]" /> Thông tin cá nhân
            </h4>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-black/55 uppercase tracking-widest block">Họ và Tên</label>
                  <input
                    type="text"
                    value={profileData.fullname || ''}
                    onChange={(e) => setProfileData({ ...profileData, fullname: e.target.value })}
                    disabled={!isEditingProfile}
                    className={`w-full h-12 rounded-[16px] px-4 text-[#1d1d1f] text-[14px] font-medium outline-none transition-all shadow-none ${isEditingProfile ? 'bg-white border-2 border-[var(--color-primary)] shadow-[0_0_0_4px_var(--color-primary)]/10' : 'bg-[#f9f9fb] border-2 border-transparent hover:border-black/5 cursor-not-allowed opacity-80'}`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-black/55 uppercase tracking-widest block">Email liên kết</label>
                  <input
                    type="text"
                    value={profileData.email || ''}
                    placeholder="Đang tải..."
                    disabled
                    className="w-full h-12 bg-black/[0.02] border border-transparent rounded-[16px] px-4 text-black/55 text-[14px] font-medium outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Editable School Name Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-black/55 uppercase tracking-widest block">Tên trường học</label>
                <div className={`flex items-center w-full min-h-[48px] rounded-[16px] transition-all px-4 ${isEditingProfile ? 'bg-white border-2 border-[var(--color-primary)] shadow-[0_0_0_4px_var(--color-primary)]/10' : 'bg-[#f9f9fb] border-2 border-transparent hover:border-black/5 cursor-not-allowed opacity-80'}`}>
                  <i className="bi bi-bank text-[16px] text-black/55 mr-3 shrink-0" />
                  <input
                    type="text"
                    value={profileData.school || ''}
                    onChange={(e) => setProfileData({ ...profileData, school: e.target.value })}
                    disabled={!isEditingProfile}
                    className={`flex-1 bg-transparent border-none outline-none text-[#1d1d1f] text-[14px] font-medium py-3 ${!isEditingProfile ? 'cursor-not-allowed' : ''}`}
                    placeholder="Nhập tên trường..."
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-black/[0.04] flex justify-end gap-3">
              {!isEditingProfile ? (
                <Button
                  onClick={() => setIsEditingProfile(true)}
                  className="!h-12 !rounded-full !font-medium !text-[14px] !px-8 !border !border-black/10 hover:!border-black/20 !bg-black/[0.02] hover:!bg-black/[0.06] !text-black/60 hover:!text-black transition-all duration-300"
                >
                  <i className="bi bi-pencil-square mr-1" /> Chỉnh sửa hồ sơ
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => setIsEditingProfile(false)}
                    className="!h-12 !rounded-full !font-medium !text-[14px] !px-8 !border !border-black/10 hover:!border-black/20 !bg-black/[0.02] hover:!bg-black/[0.06] !text-black/60 hover:!text-black transition-all duration-300"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="primary"
                    onClick={handleSaveSettings}
                    className="!h-12 !rounded-full !font-medium !text-[14px] !px-8 !bg-gradient-to-b !from-[#ff7a00] !to-[#ff5c00] !border-none !text-white !shadow-[0_1px_3px_rgba(255,92,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] hover:!brightness-110 hover:!shadow-[0_8px_24px_rgba(255,92,0,0.4)] transition-all duration-300 group"
                  >
                    Lưu cài đặt
                  </Button>
                </>
              )}
            </div>
          </motion.div>

          {/* Achievement Badges Area */}
          <motion.div variants={itemVariants} className="bg-white rounded-[32px] border border-black/[0.03] p-8 shadow-sm">
            <h4 className="text-[16px] font-semibold text-[#1d1d1f] mb-6 flex items-center gap-2">
              <i className="bi bi-trophy-fill text-amber-500" /> Huy hiệu đạt được
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {achievements.map((ach, idx) => (
                <div key={idx} className="bg-[#f9f9fb] border border-black/[0.03] rounded-[20px] p-5 flex flex-col items-center text-center hover:bg-white hover:shadow-md transition-all group">
                  <div className={`w-14 h-14 rounded-2xl ${ach.bg} ${ach.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <i className={`bi ${ach.icon} text-[24px]`} />
                  </div>
                  <span className="text-[14px] font-semibold text-[#1d1d1f] mb-1">{ach.label}</span>
                  <span className="text-[11px] font-semibold text-black/55">{ach.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}

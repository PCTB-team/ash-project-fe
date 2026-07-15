/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Badge, Popover, Tooltip, notification } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { formatRelativeTime } from '../utils/dateUtils.js';
import logoAvatarDefault from '../../../assets/logo_avatar_default.jpg';
import { getNotifications, markNotificationsAsRead } from '../../notifications/api/notifications.api.js';
import { useSelector } from 'react-redux';

/**
 * Shared Header Toolbar — Ultra-Premium Minimalist Stripe/Linear style.
 * Includes elegant keyboard shortcut badge (⌘K), dynamic border glows using accentColor,
 * and a premium double ringed avatar layout.
 */
import { useNavigate } from 'react-router-dom';

export default function AppHeader({
  searchTerm,
  onSearchChange,
  accentColor = '#ff5c00',
  onToggleMobileMenu,
  children,
}) {
  const { avatarUrl } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const lastNotificationIdRef = useRef(null);

  // Xử lý các loại định dạng đường dẫn ảnh trả về từ Backend
  const getDisplayAvatar = (url) => {
    if (!url || url === logoAvatarDefault) return logoAvatarDefault;
    if (url.startsWith('http') || url.startsWith('data:image')) return url;
    if (url.startsWith('res.cloudinary.com')) return `https://${url}`;
    if (url.startsWith('/')) return `https://ash-project-be.onrender.com${url}`;
    if (/^[A-Za-z0-9+/=]{50,}$/.test(url.trim())) return `data:image/jpeg;base64,${url.trim()}`;
    return `https://ash-project-be.onrender.com/${url}`;
  };

  const fetchNotis = async (isPolling = false) => {
    try {
      const data = await getNotifications({ page: 0, size: 20 });
      setNotificationsList(data.items || []);
      setUnreadCount(data.unreadCount || 0);

      const newest = data.items && data.items[0];
      if (isPolling && newest && newest.id !== lastNotificationIdRef.current && !newest.read) {
        notification.info({
          title: newest.title,
          description: newest.message,
          placement: 'bottomRight',
          duration: 4,
          onClick: () => handleNotificationClick(newest)
        });
      }
      if (newest) {
        lastNotificationIdRef.current = newest.id;
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  useEffect(() => {
    fetchNotis();
    const interval = setInterval(() => {
      fetchNotis(true);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  const markAllAsRead = async () => {
    try {
      await markNotificationsAsRead({ all: true });
      await fetchNotis();
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const handleNotificationClick = async (noti) => {
    if (!noti.read) {
      try {
        await markNotificationsAsRead({ notificationIds: [noti.id] });
        await fetchNotis();
      } catch (error) {
        console.error('Failed to mark notification as read', error);
      }
    }

    if (noti.resourceType === 'GROUP' || noti.resourceType === 'GROUP_FILE') {
      const tab = noti.resourceType === 'GROUP_FILE' ? 'documents' : 'overview';
      navigate(`/dashboard/group/${noti.groupId}?tab=${tab}`);
    }
  };

  const iconByType = {
    GROUP_MEMBER_JOINED: 'bi-person-plus',
    GROUP_UPLOAD_PERMISSION_GRANTED: 'bi-cloud-arrow-up',
    GROUP_UPLOAD_PERMISSION_REVOKED: 'bi-cloud-slash',
    GROUP_FILE_UPLOADED: 'bi-file-earmark-arrow-up',
    GROUP_FILE_MOVED_TO_TRASH: 'bi-trash',
    GROUP_FILE_RESTORED: 'bi-arrow-counterclockwise',
    GROUP_MEMBER_KICKED: 'bi-person-x',
    GROUP_MEMBER_LEFT: 'bi-box-arrow-right',
    GROUP_PASSWORD_CHANGED: 'bi-key',
  };

  const notificationContent = (
    <div className="w-[340px] p-1 font-sans flex flex-col transition-all duration-300">
      <div className="flex items-center justify-between px-3 py-2 border-b border-black/5 mb-2 shrink-0">
        <h3 className="font-bold text-[14px] text-black">Thông báo</h3>
        <button
          onClick={markAllAsRead}
          className="text-[11px] font-semibold text-[#ff5c00] hover:text-[#ff8a00] transition-colors cursor-pointer"
        >
          Đánh dấu đã đọc
        </button>
      </div>

      <div className={`flex flex-col overflow-y-auto px-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black/10 hover:[&::-webkit-scrollbar-thumb]:bg-black/20 [&::-webkit-scrollbar-thumb]:rounded-full transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[450px]' : 'max-h-[260px]'}`}>
        <AnimatePresence>
          {notificationsList.map((noti) => (
            <motion.div
              key={noti.id}
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 4 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              onClick={() => handleNotificationClick(noti)}
              className={`flex gap-3 items-start p-3 rounded-xl cursor-pointer transition-colors ${noti.read ? 'hover:bg-black/5' : 'bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${noti.read ? 'bg-black/5 text-black/50' : 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'}`}>
                <i className={`bi ${iconByType[noti.type] || 'bi-bell'} text-[14px]`} />
              </div>
              <div className="flex-1">
                <p className={`text-[12.5px] ${noti.read ? 'text-black/60 font-medium' : 'text-[var(--color-on-surface)] font-bold'}`}>
                  {noti.title}
                </p>
                <p className={`text-[11px] mt-0.5 ${noti.read ? 'text-black/50' : 'text-black/70 font-medium'}`}>
                  {noti.message}
                </p>
                <p className="text-[10px] font-bold text-black/30 uppercase mt-1">
                  {formatRelativeTime(noti.createdAt)}
                </p>
              </div>
              {!noti.read && (
                <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] shrink-0 mt-1.5 shadow-[0_0_8px_rgba(255,92,0,0.6)]" />
              )}
            </motion.div>
          ))}
          {notificationsList.length === 0 && (
            <div className="text-center py-6 text-black/40 text-[13px] font-medium">
              Không có thông báo nào.
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-2 pt-2 mt-1 border-t border-black/5 shrink-0">
        <button
          onClick={handleToggleExpand}
          className="w-full py-2.5 text-[12px] font-bold text-black/40 hover:text-black hover:bg-black/[0.03] rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          {isExpanded ? (
            <>Thu gọn <i className="bi bi-chevron-up text-[10px]" /></>
          ) : (
            <>Xem tất cả <i className="bi bi-chevron-down text-[10px]" /></>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <motion.header
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-4 justify-between items-center w-full bg-transparent select-none"
    >
      {/* Background radial accent glow light */}
      <div
        className="absolute top-0 right-1/4 w-80 h-80 rounded-full blur-[110px] pointer-events-none -z-10 transition-colors duration-500"
        style={{ backgroundColor: `${accentColor}06` }}
      />

      <div className="flex items-center gap-3 w-full max-w-sm">
        {/* Mobile Hamburger Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleMobileMenu}
          className="md:hidden w-10 h-10 rounded-full flex items-center justify-center bg-white border border-black/5 shadow-sm text-black/60 hover:text-black shrink-0 cursor-pointer"
        >
          <i className="bi bi-list text-[18px]" />
        </motion.button>

        {/* Modern Capsule Search Bar */}
        <div className="relative w-full">
          <motion.div
            animate={{
              borderColor: isFocused ? accentColor : 'rgba(0, 0, 0, 0.05)',
              boxShadow: isFocused
                ? `0 0 20px ${accentColor}12`
                : '0 0 0px rgba(0, 0, 0, 0)',
              scale: isFocused ? 1.015 : 1
            }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white border shadow-sm transition-all relative"
          >
            <i
              className="bi bi-search transition-colors duration-300 text-[13px] shrink-0"
              style={{ color: isFocused ? accentColor : 'rgba(0, 0, 0, 0.35)' }}
            />

            <input
              type="text"
              placeholder="Tìm kiếm theo tên tài liệu,giáo trình..."
              value={searchTerm || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full bg-transparent border-none text-black text-[12.5px] font-semibold placeholder-black/30 outline-none pr-12"
            />

            <div className="absolute right-4 flex items-center gap-1.5 pointer-events-none">
              <AnimatePresence mode="wait">
                {searchTerm ? (
                  <motion.button
                    key="clear-btn"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => onSearchChange('')}
                    className="text-black/35 hover:text-black pointer-events-auto cursor-pointer flex items-center justify-center mr-1"
                  >
                    <i className="bi bi-x-circle-fill text-[12.5px]" />
                  </motion.button>
                ) : (
                  <motion.div
                    key="k-badge"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    className="px-2 py-0.5 rounded-md bg-black/[0.04] border border-black/[0.03] text-[9.5px] font-bold text-black/30 flex items-center gap-0.5 select-none"
                  >
                    <span>⌘</span>
                    <span>K</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex items-center gap-4.5">
        {children}

        {/* Premium Notifications Bell */}
        <Popover
          content={notificationContent}
          trigger="click"
          placement="bottomRight"
          styles={{ body: { borderRadius: '20px', padding: '8px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' } }}
        >
          <Badge count={unreadCount} overflowCount={99} color={accentColor} offset={[-1.5, 1.5]}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8.5 h-8.5 bg-white hover:bg-black/[0.015] rounded-full text-black/60 hover:text-black transition-colors border border-black/[0.04] shadow-sm flex items-center justify-center cursor-pointer relative"
            >
              <i className="bi bi-bell text-[14px]" />
            </motion.button>
          </Badge>
        </Popover>

        <div className="h-4.5 w-[1.5px] bg-black/[0.06] mx-0.5" />

        {/* Premium Double Ringed Circular Profile Avatar */}
        <Tooltip title="Cài đặt hệ thống" placement="bottom">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard/profile')}
            className="w-8.5 h-8.5 rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-white cursor-pointer relative p-[1.5px] transition-all"
            style={{ border: `1.5px solid ${accentColor}30` }}
          >
            <div className="w-full h-full rounded-full overflow-hidden">
              <img
                src={imgError ? logoAvatarDefault : getDisplayAvatar(avatarUrl)}
                alt="Avatar"
                className="w-full h-full object-cover object-center"
                onError={() => setImgError(true)}
              />
            </div>
          </motion.div>
        </Tooltip>
      </div>
    </motion.header>
  );
}

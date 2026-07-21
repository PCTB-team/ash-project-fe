/**
 * AdminSidebar — Light theme matching User Sidebar.
 */
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from 'antd';
import logoImg from '../../../assets/logo.png';
import { useAuthContext } from '../../../contexts/AuthContext';

const menuItems = [
  { key: '', icon: 'bi-grid-1x2', label: 'Tổng quan' },
  { key: 'users', icon: 'bi-people', label: 'Người dùng' },
  { key: 'documents', icon: 'bi-file-earmark', label: 'Tài liệu' },
  { key: 'groups', icon: 'bi-collection', label: 'Nhóm học tập' },
  { key: 'payments', icon: 'bi-credit-card', label: 'Thanh toán' },
];

const bottomItems = [];

export default function AdminSidebar({ isCollapsed = false, onToggleCollapse, isMobileMenuOpen, onCloseMobileMenu }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthContext();
  const currentKey = location.pathname.replace('/admin/', '').replace('/admin', '') || '';

  const handleNav = (key) => {
    navigate(key ? `/admin/${key}` : '/admin');
    onCloseMobileMenu?.();
  };

  const renderItem = (item, isActive) => {
    const btn = (
      <motion.button
        key={item.key}
        whileHover={{ x: isCollapsed ? 0 : 4, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleNav(item.key)}
        className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} gap-3 py-3 rounded-xl transition-all w-full text-left cursor-pointer text-[13px] relative overflow-hidden group ${isActive ? 'bg-black/[0.04] text-[#ff5c00] font-semibold' : 'text-black/60 hover:text-black hover:bg-black/[0.02] font-medium' }`}
      >
        {isActive && (
          <motion.div
            layoutId="adminActiveIndicator"
            className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff5c00]"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
        <i className={`bi ${item.icon} text-[16px] transition-transform duration-300 group-hover:scale-110 shrink-0 ${isActive ? 'text-[#ff5c00]' : 'text-black/55 group-hover:text-[#ff5c00]'}`} />
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="whitespace-nowrap overflow-hidden"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    );
    return isCollapsed ? (
      <Tooltip key={item.key} title={item.label} placement="right">{btn}</Tooltip>
    ) : <div key={item.key}>{btn}</div>;
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      className={`bg-white border-r border-black/5 flex flex-col fixed md:relative h-full left-0 top-0 md:left-auto md:top-auto z-[100] shrink-0 select-none sidebar-transition ${isMobileMenuOpen ? 'translate-x-0 shadow-md !w-[260px]' : '-translate-x-full md:translate-x-0' }`}
    >
      {/* Desktop Toggle Button */}
      <Tooltip title={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"} placement="right">
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex absolute top-7 -right-[14px] w-[28px] h-[28px] items-center justify-center rounded-full bg-white text-black/55 hover:text-[#ff5c00] transition-all z-[60] cursor-pointer border border-black/[0.08] shadow-md hover:shadow-lg hover:border-[#ff5c00]/30 hover:scale-110 active:scale-95 group"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        >
          <i className={`bi ${isCollapsed ? 'bi-layout-sidebar-inset-reverse' : 'bi-layout-sidebar-inset'} text-[13px] transition-all duration-300 group-hover:text-[#ff5c00]`} />
        </button>
      </Tooltip>

      <div className="flex flex-col h-full px-3 py-6 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobileMenu}
          className="md:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 text-black/55 hover:text-black hover:bg-black/10 transition-colors z-50 cursor-pointer"
        >
          <i className="bi bi-x-lg text-[14px]" />
        </button>

        {/* Brand Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => handleNav('')}
          className={`flex items-center gap-3 ${isCollapsed ? 'px-1.5 py-2.5 justify-center' : 'px-3 py-3'} mb-8 cursor-pointer group rounded-xl bg-black/[0.01] border border-black/5 hover:border-black/10 transition-all`}
        >
          <div className="relative w-10 h-10 shrink-0 group-hover:scale-105 transition-all duration-500">
            <div className="relative w-full h-full bg-gradient-to-b from-[#ffffff] to-[#fff5eb] border border-white rounded-xl shadow-sm overflow-hidden flex items-center justify-center z-10">
              <img src={logoImg} alt="Logo" className="w-full h-full object-cover object-[center_2%] scale-[1.6]" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
              <i className="bi bi-book text-[16px] text-[#ff5c00] hidden" />
            </div>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <span className="text-xl font-semibold drop-shadow-sm mt-0.5 ml-1 group-hover:opacity-80 transition-opacity block">
                  <span className="bg-clip-text text-transparent bg-gradient-to-br from-[#432c1a] to-[#734b2f]">Capy</span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-br from-[#ff5c00] to-[#ffaa00] ml-1">Study</span>
                </span>
                <span className="text-[9px] font-semibold text-white bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] px-2 py-0.5 rounded-full inline-block mt-1 uppercase shadow-sm">
                  Admin Panel
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation List */}
        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => renderItem(item, currentKey === item.key))}
        </nav>

        {/* Bottom actions section */}
        <div className="mt-auto space-y-1 pt-5 border-t border-black/5 relative">
          {bottomItems.map(item => renderItem(item, currentKey === item.key))}

          {/* Về Dashboard */}
          {(() => {
            const btn = (
              <motion.button
                whileHover={{ x: isCollapsed ? 0 : 4, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/dashboard')}
                className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} gap-3 py-2.5 rounded-xl transition-all w-full text-left cursor-pointer text-[12px] font-medium text-black/55 hover:text-[#ff5c00]`}
              >
                <i className="bi bi-arrow-left-circle text-[14px] shrink-0" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      Về User Dashboard
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
            return isCollapsed ? (
              <Tooltip title="Về User Dashboard" placement="right">{btn}</Tooltip>
            ) : btn;
          })()}

          {/* Logout */}
          {(() => {
            const btn = (
              <motion.button
                whileHover={{ backgroundColor: 'rgba(255, 59, 48, 0.08)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { logout(); navigate('/', { replace: true }); }}
                className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} gap-3 py-2.5 text-red-500 hover:text-red-400 rounded-xl transition-all w-full text-left cursor-pointer text-[12px] font-medium mt-2`}
              >
                <i className="bi bi-box-arrow-left text-[14px] shrink-0" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      Đăng xuất Admin
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
            return isCollapsed ? (
              <Tooltip title="Đăng xuất" placement="right">{btn}</Tooltip>
            ) : btn;
          })()}
        </div>
      </div>
    </motion.aside>
  );
}

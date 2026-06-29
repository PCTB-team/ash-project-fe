/**
 * AdminSidebar — Premium dark theme sidebar với mesh gradient, glow effects, animated indicators.
 */
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from 'antd';
import logoImg from '../../../assets/logo.png';

const menuItems = [
  { key: '', icon: 'bi-grid-1x2-fill', label: 'Tổng quan', color: '#ff5c00' },
  { key: 'users', icon: 'bi-people-fill', label: 'Người dùng', color: '#6366f1' },
  { key: 'documents', icon: 'bi-file-earmark-fill', label: 'Tài liệu', color: '#10b981' },
  { key: 'groups', icon: 'bi-collection-fill', label: 'Nhóm học tập', color: '#8b5cf6' },
  { key: 'payments', icon: 'bi-credit-card-fill', label: 'Thanh toán', color: '#f43f5e' },
  { key: 'ai', icon: 'bi-stars', label: 'Thống kê AI', color: '#0ea5e9' },
];

const bottomItems = [
  { key: 'settings', icon: 'bi-gear-fill', label: 'Cài đặt', color: '#94a3b8' },
];

export default function AdminSidebar({ isCollapsed = false, onToggleCollapse, isMobileMenuOpen, onCloseMobileMenu }) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentKey = location.pathname.replace('/admin/', '').replace('/admin', '') || '';

  const handleNav = (key) => {
    navigate(key ? `/admin/${key}` : '/admin');
    onCloseMobileMenu?.();
  };

  const renderItem = (item, isActive) => {
    const btn = (
      <motion.button
        key={item.key}
        whileHover={{ x: isCollapsed ? 0 : 4 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => handleNav(item.key)}
        className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} gap-3 py-3 rounded-xl transition-all w-full text-left cursor-pointer text-[13px] relative overflow-hidden group
          ${isActive
            ? 'font-semibold'
            : 'text-white/45 hover:text-white/80 font-medium'
          }`}
        style={isActive ? {
          background: `linear-gradient(135deg, ${item.color}25, ${item.color}08)`,
          color: item.color,
          boxShadow: `0 0 20px ${item.color}15, inset 0 0 20px ${item.color}05`,
        } : {}}
      >
        {/* Active indicator — glowing bar */}
        {isActive && (
          <motion.div 
            layoutId="adminActiveIndicator" 
            className="absolute left-0 top-[15%] bottom-[15%] w-[3px] rounded-r-full"
            style={{ 
              background: item.color,
              boxShadow: `0 0 8px ${item.color}80, 0 0 16px ${item.color}40`,
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }} 
          />
        )}

        {/* Icon with glow on active */}
        <div className="relative">
          <i className={`bi ${item.icon} text-[15px] shrink-0 transition-all duration-300 group-hover:scale-110 ${isActive ? '' : 'group-hover:text-white/80'}`}
            style={isActive ? { color: item.color, filter: `drop-shadow(0 0 6px ${item.color}60)` } : {}} />
        </div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="whitespace-nowrap overflow-hidden">
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Hover shimmer effect */}
        {!isActive && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)' }} />
        )}
      </motion.button>
    );
    return isCollapsed ? <Tooltip key={item.key} title={item.label} placement="right">{btn}</Tooltip> : <div key={item.key}>{btn}</div>;
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 76 : 270 }}
      transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
      className={`flex flex-col fixed md:relative h-full left-0 top-0 md:left-auto md:top-auto z-[100] shrink-0 select-none
        ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl !w-[270px]' : '-translate-x-full md:translate-x-0'}`}
      style={{ 
        background: 'linear-gradient(180deg, #141428 0%, #0f0f20 50%, #0a0a18 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Ambient glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-r-2xl">
        <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #ff5c00, transparent 70%)' }} />
        <div className="absolute -bottom-20 -right-10 w-40 h-40 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-[0.02]"
          style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)' }} />
      </div>

      {/* Toggle Button */}
      <Tooltip title={isCollapsed ? 'Mở rộng' : 'Thu gọn'} placement="right">
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex absolute top-7 -right-[14px] w-[28px] h-[28px] items-center justify-center rounded-full bg-[#1a1a2e] text-white/40 hover:text-[#ff5c00] transition-all z-[60] cursor-pointer border border-white/10 shadow-lg hover:shadow-[0_0_12px_rgba(255,92,0,0.3)] hover:border-[#ff5c00]/40 hover:scale-110 active:scale-95"
        >
          <i className={`bi ${isCollapsed ? 'bi-layout-sidebar-inset-reverse' : 'bi-layout-sidebar-inset'} text-[12px]`} />
        </button>
      </Tooltip>

      <div className="flex flex-col h-full px-3 py-6 overflow-y-auto overflow-x-hidden custom-scrollbar relative z-10">
        {/* Mobile Close */}
        <button onClick={onCloseMobileMenu} className="md:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:text-white cursor-pointer z-50">
          <i className="bi bi-x-lg text-[14px]" />
        </button>

        {/* Brand — with animated ring */}
        <motion.div whileHover={{ scale: 1.02 }} onClick={() => handleNav('')}
          className={`flex items-center gap-3 ${isCollapsed ? 'px-1.5 py-2.5 justify-center' : 'px-3 py-3'} mb-8 cursor-pointer group rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-all relative overflow-hidden`}
        >
          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, transparent 30%, rgba(255,92,0,0.05) 50%, transparent 70%)' }} />
          
          <div className="relative w-10 h-10 shrink-0 group-hover:scale-105 transition-all duration-500">
            {/* Animated ring */}
            <div className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'conic-gradient(from 0deg, #ff5c00, #ffaa00, #ff5c00)', filter: 'blur(4px)' }} />
            <div className="relative w-full h-full bg-gradient-to-b from-[#2a2a40] to-[#1e1e30] border border-white/10 rounded-xl shadow-sm overflow-hidden flex items-center justify-center">
              <img src={logoImg} alt="Logo" className="w-full h-full object-cover object-[center_2%] scale-[1.6]" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="overflow-hidden whitespace-nowrap">
                <span className="text-lg font-bold block">
                  <span className="text-white/90">Capy</span>
                  <span className="text-[#ff5c00] ml-1">Study</span>
                </span>
                <span className="text-[9px] font-bold text-[#ff5c00] bg-[#ff5c00]/15 px-2 py-0.5 rounded-full inline-block mt-0.5 uppercase tracking-wider">
                  Admin Panel
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Section Label */}
        {!isCollapsed && (
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-[9px] font-bold text-white/15 uppercase tracking-[0.2em] px-4 mb-3"
          >
            Quản lý
          </motion.p>
        )}

        {/* Main Nav */}
        <nav className="flex-1 space-y-1">
          {menuItems.map(item => renderItem(item, currentKey === item.key))}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto space-y-1 pt-4 border-t border-white/[0.04] relative">
          {/* Separator glow */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          {!isCollapsed && (
            <p className="text-[9px] font-bold text-white/15 uppercase tracking-[0.2em] px-4 mb-2 mt-2">
              Hệ thống
            </p>
          )}
          
          {bottomItems.map(item => renderItem(item, currentKey === item.key))}

          {/* Back to Dashboard */}
          {(() => {
            const btn = (
              <motion.button whileHover={{ x: isCollapsed ? 0 : 4 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/dashboard')}
                className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} gap-3 py-2.5 rounded-xl transition-all w-full text-left cursor-pointer text-[12px] font-medium text-white/30 hover:text-[#ff5c00] hover:bg-white/[0.03] group`}
              >
                <i className="bi bi-arrow-left-circle text-[14px] shrink-0 group-hover:animate-[pulseLeft_1s_ease-in-out_infinite]" />
                <AnimatePresence>
                  {!isCollapsed && <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="whitespace-nowrap overflow-hidden">Về Dashboard</motion.span>}
                </AnimatePresence>
              </motion.button>
            );
            return isCollapsed ? <Tooltip title="Về User Dashboard" placement="right">{btn}</Tooltip> : btn;
          })()}

          {/* Logout */}
          {(() => {
            const btn = (
              <motion.button 
                whileHover={{ backgroundColor: 'rgba(255, 59, 48, 0.08)' }} 
                whileTap={{ scale: 0.97 }}
                onClick={() => { localStorage.removeItem('accessToken'); localStorage.removeItem('refreshToken'); navigate('/', { replace: true }); }}
                className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} gap-3 py-2.5 text-red-400/60 hover:text-red-400 rounded-xl transition-all w-full text-left cursor-pointer text-[12px] font-medium mt-1 group relative overflow-hidden`}
              >
                {/* Red glow on hover */}
                <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/[0.04] transition-colors duration-300 rounded-xl" />
                <i className="bi bi-box-arrow-left text-[14px] shrink-0 relative z-10" />
                <AnimatePresence>
                  {!isCollapsed && <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="whitespace-nowrap overflow-hidden relative z-10">Đăng xuất</motion.span>}
                </AnimatePresence>
              </motion.button>
            );
            return isCollapsed ? <Tooltip title="Đăng xuất" placement="right">{btn}</Tooltip> : btn;
          })()}

          {/* Version tag */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center pt-4 pb-1"
              >
                <span className="text-[9px] text-white/10 font-medium tracking-wider">v2.0.0 — Capy Study Platform</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* CSS for custom animations */}
      <style>{`
        @keyframes pulseLeft {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-3px); }
        }
      `}</style>
    </motion.aside>
  );
}

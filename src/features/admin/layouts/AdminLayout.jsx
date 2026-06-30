/**
 * AdminLayout — Layout chính cho Admin Panel.
 * Premium dark sidebar + Glassmorphism header + Gradient mesh content area.
 */
import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from './AdminSidebar.jsx';

const PAGE_TITLES = {
  '': 'Tổng quan',
  'users': 'Quản lý người dùng',
  'documents': 'Quản lý tài liệu',
  'groups': 'Quản lý nhóm học tập',
  'payments': 'Quản lý thanh toán',
  'ai': 'Thống kê AI',
  'settings': 'Cài đặt hệ thống',
  'intro-config': 'Cấu hình Trang chủ',
};

const PAGE_ICONS = {
  '': 'bi-grid-1x2-fill',
  'users': 'bi-people-fill',
  'documents': 'bi-file-earmark-fill',
  'groups': 'bi-collection-fill',
  'payments': 'bi-credit-card-fill',
  'ai': 'bi-stars',
  'settings': 'bi-gear-fill',
  'intro-config': 'bi-layout-text-window',
};

const PAGE_DESCRIPTIONS = {
  '': 'Theo dõi hoạt động và thống kê hệ thống',
  'users': 'Quản lý tài khoản và phân quyền người dùng',
  'documents': 'Giám sát tài liệu được tải lên hệ thống',
  'groups': 'Quản lý các nhóm học tập và hoạt động nhóm',
  'payments': 'Theo dõi doanh thu và giao dịch thanh toán',
  'ai': 'Phân tích và thống kê sử dụng AI Chatbot',
  'settings': 'Cấu hình và tùy chỉnh hệ thống',
  'intro-config': 'Tùy chỉnh nội dung và hình ảnh của trang Giới thiệu (Intro).',
};

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="hidden sm:flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-black/[0.04]">
      <i className="bi bi-clock text-[12px] text-black/40" />
      <span className="text-[12px] font-medium text-black/50 tabular-nums">
        {time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Chào buổi sáng', icon: '☀️' };
  if (h < 18) return { text: 'Chào buổi chiều', icon: '🌤️' };
  return { text: 'Chào buổi tối', icon: '🌙' };
}

export default function AdminLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const currentKey = location.pathname.replace('/admin/', '').replace('/admin', '') || '';
  const pageTitle = PAGE_TITLES[currentKey] || 'Admin';
  const pageIcon = PAGE_ICONS[currentKey] || 'bi-grid';
  const pageDesc = PAGE_DESCRIPTIONS[currentKey] || '';
  const greeting = getGreeting();

  return (
    <div className="flex h-screen max-h-screen bg-[#f0f0f3] text-[#1d1d1f] font-sans overflow-hidden relative">
      {/* Animated background mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[300px] -right-[200px] w-[600px] h-[600px] rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #ff5c00 0%, transparent 70%)' }} />
        <div className="absolute -bottom-[200px] -left-[200px] w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
        <div className="absolute top-[40%] right-[30%] w-[400px] h-[400px] rounded-full opacity-[0.02]"
          style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }} />
      </div>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(p => !p)}
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Header — Glassmorphism */}
        <header className="sticky top-0 z-20 h-[72px] bg-white/70 backdrop-blur-2xl border-b border-black/[0.06] flex items-center justify-between px-4 md:px-8 shrink-0"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.02)' }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(p => !p)} className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-black/[0.03] text-black/50 hover:text-black cursor-pointer transition-colors">
              <i className="bi bi-list text-[18px]" />
            </button>
            
            {/* Page Icon + Title */}
            <div className="flex items-center gap-3">
              <motion.div 
                key={currentKey}
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff5c00]/10 to-[#ffaa00]/10 flex items-center justify-center border border-[#ff5c00]/10"
              >
                <i className={`bi ${pageIcon} text-[16px] text-[#ff5c00]`} />
              </motion.div>
              <div>
                <motion.h1 
                  key={pageTitle}
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[15px] font-bold text-[#1d1d1f] m-0 leading-tight"
                >
                  {pageTitle}
                </motion.h1>
                <motion.p 
                  key={pageDesc}
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-[11px] text-black/40 font-medium m-0"
                >
                  {pageDesc}
                </motion.p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Greeting */}
            <div className="hidden lg:flex items-center gap-1.5 text-[12px] text-black/40 font-medium">
              <span>{greeting.icon}</span>
              <span>{greeting.text}, Admin</span>
            </div>

            <div className="hidden sm:block w-px h-6 bg-black/[0.06]" />

            {/* Live Clock */}
            <LiveClock />

            {/* Notification Bell */}
            <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/60 backdrop-blur-sm border border-black/[0.04] text-black/40 hover:text-[#ff5c00] hover:border-[#ff5c00]/20 transition-all cursor-pointer group">
              <i className="bi bi-bell text-[16px] group-hover:animate-[wiggle_0.5s_ease-in-out]" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#f43f5e] rounded-full flex items-center justify-center text-white text-[8px] font-bold border-2 border-white">3</span>
            </button>

            {/* Admin Badge */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-[#ff5c00]/10 to-[#ffaa00]/10 px-3 py-1.5 rounded-xl border border-[#ff5c00]/10">
              <div className="w-2 h-2 rounded-full bg-[#ff5c00] animate-pulse" />
              <span className="text-[11px] font-bold text-[#ff5c00] uppercase tracking-wider">Admin</span>
            </div>

            {/* Avatar */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff5c00] to-[#ffaa00] flex items-center justify-center text-white text-[14px] font-bold shadow-lg shadow-[#ff5c00]/20 cursor-pointer border-2 border-white"
            >
              A
            </motion.div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <motion.div 
            key={currentKey}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto w-full"
          >
            <Outlet />
          </motion.div>
        </div>
      </main>

      {/* Global keyframes */}
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
          75% { transform: rotate(-5deg); }
        }
      `}</style>
    </div>
  );
}

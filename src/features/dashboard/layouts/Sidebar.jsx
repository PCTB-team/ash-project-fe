import { Progress, Tooltip } from 'antd';
import { motion } from 'framer-motion';
import logoImg from "../../../assets/logo.png";

/**
 * Main Sidebar Navigation for Authenticated Views.
 * Apple-inspired sleek light design with glowing features.
 * Supports collapse/expand toggle on desktop.
 * Profile widget removed as requested.
 */
export default function Sidebar({
  currentView,
  onNavigate,
  onLogout,
  currentUser,
  storagePercentage,
  totalStorageMB = 0,
  deletedDocsCount = 0,
  accentColor,
  isMobileMenuOpen,
  onCloseMobileMenu,
  isCollapsed = false,
  onToggleCollapse,
}) {
  const menuItems = [
    {
      key: 'dashboard',
      icon: 'bi-folder2',
      label: 'Trang chủ',
    },
    {
      key: 'community',
      icon: 'bi-people',
      label: 'Nhóm học tập',
    },
    {
      key: 'ai',
      icon: 'bi-stars',
      label: 'Trợ lý AI',
    },
  ];

  // Removed admin tab for standard user sidebar
  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`bg-white border-r border-black/5 flex flex-col fixed md:relative h-full left-0 top-0 md:left-auto md:top-auto z-[100] shrink-0 select-none sidebar-transition ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl !w-[260px]' : '-translate-x-full md:translate-x-0'
        }`}
    >
      {/* Desktop Toggle Button — Premium floating edge button */}
      <Tooltip title={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"} placement="right">
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex absolute top-7 -right-[14px] w-[28px] h-[28px] items-center justify-center rounded-full bg-white text-black/55 hover:text-[#ff5c00] transition-all z-[60] cursor-pointer border border-black/[0.08] shadow-md hover:shadow-lg hover:shadow-[#ff5c00]/10 hover:border-[#ff5c00]/30 hover:scale-110 active:scale-95 group"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        >
          <i className={`bi ${isCollapsed ? 'bi-layout-sidebar-inset-reverse' : 'bi-layout-sidebar-inset'} text-[13px] transition-all duration-300 group-hover:text-[#ff5c00]`} />
        </button>
      </Tooltip>

      <div className="flex flex-col h-full px-3 py-6 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {/* Background ambient lighting */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#ff5c00]/2 rounded-full blur-[80px] pointer-events-none" />

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
          onClick={() => onNavigate('dashboard')}
          className={`flex items-center gap-3 ${isCollapsed ? 'px-1.5 py-2.5 justify-center' : 'px-3 py-3'} mb-8 cursor-pointer group rounded-xl bg-black/[0.01] border border-black/5 hover:border-black/10 transition-all`}
        >
          <div className="relative w-10 h-10 shrink-0 group-hover:scale-105 transition-all duration-500">
            {/* Glowing Aura */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff8a00] to-[#ff5c00] rounded-[14px] blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
            {/* Main Logo Container */}
            <div className="relative w-full h-full bg-gradient-to-b from-[#ffffff] to-[#fff5eb] border-[1.5px] border-white rounded-[14px] shadow-sm overflow-hidden flex items-center justify-center z-10">
              <img src={logoImg} alt="Capybara Logo" className="w-full h-full object-cover object-[center_2%] scale-[1.6]" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
              <i className="bi bi-book text-[16px] text-[#ff5c00] hidden" />
            </div>
          </div>
          {!isCollapsed && (
            <div className="sidebar-text-fade">
              <span className="text-[24px] font-extrabold tracking-tighter drop-shadow-sm mt-0.5 ml-1 group-hover:opacity-80 transition-opacity block leading-none">
                <span className="bg-clip-text text-transparent bg-gradient-to-br from-[#432c1a] to-[#734b2f]">Capy</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-br from-[#ff5c00] to-[#ffaa00] ml-1">Study</span>
              </span>
              <span className="text-[9px] font-semibold text-white bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] px-2 py-0.5 rounded-full inline-block mt-1 tracking-wide uppercase shadow-sm">
                Học tập 4.0
              </span>
            </div>
          )}
        </motion.div>

        {/* Navigation List */}
        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = currentView === item.key;
            const button = (
              <motion.button
                key={item.key}
                whileHover={{ x: isCollapsed ? 0 : 4, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onNavigate(item.key);
                  onCloseMobileMenu && onCloseMobileMenu();
                }}
                className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} gap-3 py-3 rounded-xl transition-all w-full text-left cursor-pointer text-[13px] relative overflow-hidden group ${isActive
                  ? 'text-white font-semibold shadow-md orange-glow'
                  : 'text-black/60 hover:text-black font-medium'
                  }`}
                style={{
                  background: isActive ? `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)` : 'transparent',
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-white"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <i className={`bi ${item.icon} text-[16px] transition-transform duration-300 group-hover:scale-110 shrink-0 ${isActive ? 'text-white' : 'text-black/55 group-hover:text-[#ff5c00]'}`} />
                {!isCollapsed && (
                  <span className="tracking-tight sidebar-text-fade">{item.label}</span>
                )}
              </motion.button>
            );

            return isCollapsed ? (
              <Tooltip key={item.key} title={item.label} placement="right">
                {button}
              </Tooltip>
            ) : (
              <div key={item.key}>{button}</div>
            );
          })}
        </nav>

        {/* Bottom info section */}
        <div className="mt-auto space-y-4 pt-5 border-t border-black/5 relative">

          {/* Storage limit card */}
          {!isCollapsed ? (
            <div className="bg-black/[0.01] rounded-2xl p-4 border border-black/5 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-[#ff5c00]/2 rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-semibold text-black/55 tracking-wider uppercase">
                  Bộ nhớ đám mây
                </span>
                <span className="text-[11px] font-medium text-[#ff5c00] bg-[#ff5c00]/10 px-2 py-0.5 rounded-full">
                  {storagePercentage.toFixed(0)}%
                </span>
              </div>
              <Progress
                percent={storagePercentage}
                showInfo={false}
                strokeColor={accentColor}
                railColor="rgba(0, 0, 0, 0.04)"
                size="small"
                className="mb-2"
              />
              <p className="text-[10px] font-medium text-black/55">
                {totalStorageMB < 1 ? `${(totalStorageMB * 1024).toFixed(1)} KB` : `${totalStorageMB.toFixed(1)} MB`} / 1.0 GB
              </p>

              {/* Upgrade CTA */}
              <button
                onClick={() => {
                  onNavigate('payment');
                  onCloseMobileMenu && onCloseMobileMenu();
                }}
                className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] text-white text-[11px] font-medium cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all shadow-md shadow-[#ff5c00]/15 flex items-center justify-center gap-1.5"
              >
                <i className="bi bi-lightning-charge-fill text-[12px]" />
                Nâng cấp bộ nhớ
              </button>
            </div>
          ) : (
            <Tooltip title={`Bộ nhớ: ${storagePercentage.toFixed(0)}%`} placement="right">
              <div className="flex justify-center py-2">
                <div className="w-10 h-10 rounded-xl bg-black/[0.01] border border-black/5 flex items-center justify-center">
                  <i className="bi bi-cloud text-[16px] text-black/55" />
                </div>
              </div>
            </Tooltip>
          )}

          {/* Extra actions */}
          <div className="space-y-1">
            {/* Cài đặt */}
            {(() => {
              const settingsBtn = (
                <motion.button
                  whileHover={{ x: isCollapsed ? 0 : 4, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onNavigate('profile');
                    onCloseMobileMenu && onCloseMobileMenu();
                  }}
                  className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} gap-3 py-2.5 rounded-xl transition-all w-full text-left cursor-pointer text-[12px] font-medium ${currentView === 'profile'
                    ? 'bg-black/[0.02] text-[#ff5c00] border border-[#ff5c00]/20'
                    : 'text-black/55 hover:text-black'
                    }`}
                >
                  <i className="bi bi-gear text-[14px] shrink-0" />
                  {!isCollapsed && <span className="sidebar-text-fade">Hồ sơ</span>}
                </motion.button>
              );
              return isCollapsed ? (
                <Tooltip title="Cài đặt hệ thống" placement="right">{settingsBtn}</Tooltip>
              ) : settingsBtn;
            })()}

            {/* Thùng rác */}
            {(() => {
              const trashBtn = (
                <motion.button
                  whileHover={{ x: isCollapsed ? 0 : 4, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onNavigate('trash');
                    onCloseMobileMenu && onCloseMobileMenu();
                  }}
                  className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} gap-3 py-2.5 rounded-xl transition-all w-full text-left cursor-pointer text-[12px] font-medium ${currentView === 'trash'
                    ? 'bg-black/[0.02] text-[#ff5c00] border border-[#ff5c00]/20'
                    : 'text-black/55 hover:text-black'
                    }`}
                >
                  <i className="bi bi-trash3 text-[14px] shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 sidebar-text-fade">Thùng rác</span>
                      {deletedDocsCount > 0 && (
                        <span className="text-[9px] font-medium text-white bg-red-500 rounded-full px-1.5 py-0.5">
                          {deletedDocsCount}
                        </span>
                      )}
                    </>
                  )}
                  {isCollapsed && deletedDocsCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 text-[8px] font-medium text-white bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
                      {deletedDocsCount}
                    </span>
                  )}
                </motion.button>
              );
              return isCollapsed ? (
                <Tooltip title={`Thùng rác ${deletedDocsCount > 0 ? `(${deletedDocsCount})` : ''}`} placement="right">
                  <div className="relative">{trashBtn}</div>
                </Tooltip>
              ) : trashBtn;
            })()}

            {/* Đăng xuất */}
            {(() => {
              const logoutBtn = (
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(255, 59, 48, 0.08)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onLogout}
                  className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} gap-3 py-2.5 text-red-500 hover:text-red-400 rounded-xl transition-all w-full text-left cursor-pointer text-[12px] font-medium mt-2`}
                >
                  <i className="bi bi-box-arrow-left text-[14px] shrink-0" />
                  {!isCollapsed && (
                    <span className="sidebar-text-fade">Đăng xuất ({currentUser?.split('@')[0] || 'guest'})</span>
                  )}
                </motion.button>
              );
              return isCollapsed ? (
                <Tooltip title={`Đăng xuất (${currentUser?.split('@')[0] || 'guest'})`} placement="right">{logoutBtn}</Tooltip>
              ) : logoutBtn;
            })()}
          </div>
        </div>
      </div>
    </motion.aside>
  );
}


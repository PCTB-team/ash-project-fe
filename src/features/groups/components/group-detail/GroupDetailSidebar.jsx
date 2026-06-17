import { motion } from 'framer-motion';

const tabs = [
  { key: 'overview', icon: 'bi-grid-1x2', label: 'Tổng quan' },
  { key: 'documents', icon: 'bi-folder2-open', label: 'Tài liệu' },
  { key: 'members', icon: 'bi-people', label: 'Thành viên' },
  { key: 'trash', icon: 'bi-trash3', label: 'Thùng rác' },
  { key: 'settings', icon: 'bi-gear', label: 'Cài đặt' },
];

export default function GroupDetailSidebar({ activeTab, onTabChange, isOwner, trashCount = 0 }) {
  const visibleTabs = tabs.filter(t => {
    if (t.key === 'settings' && !isOwner) return false;
    return true;
  });

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden xl:flex flex-col gap-1.5 bg-[var(--color-surface)] border border-black/[0.04] rounded-[24px] p-2.5 shadow-sm sticky top-4">
        {visibleTabs.map(tab => {
          const isActive = activeTab === tab.key;
          const badge = tab.key === 'trash' ? trashCount : 0;

          return (
            <motion.button
              key={tab.key}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onTabChange(tab.key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-[14px] font-medium text-[13px] transition-all w-full text-left cursor-pointer relative
                ${isActive
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] shadow-sm'
                  : 'text-black/55 hover:bg-[var(--color-surface-container-high)] hover:text-[var(--color-on-surface)]'
                }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActiveIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[var(--color-primary)] rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <i className={`bi ${tab.icon} text-[15px]`} />
              <span className="flex-1">{tab.label}</span>
              {badge > 0 && (
                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center bg-black/10 text-black/50">
                  {badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Tablet/Mobile Horizontal Tabs */}
      <div className="xl:hidden flex gap-1.5 bg-[var(--color-surface)] border border-black/[0.04] rounded-[20px] p-2 shadow-sm overflow-x-auto hide-scrollbar">
        {visibleTabs.map(tab => {
          const isActive = activeTab === tab.key;
          const badge = tab.key === 'trash' ? trashCount : 0;

          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-[12px] font-medium text-[12px] transition-all whitespace-nowrap cursor-pointer relative
                ${isActive
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] shadow-sm'
                  : 'text-black/50 hover:bg-[var(--color-surface-container-high)]'
                }`}
            >
              <i className={`bi ${tab.icon} text-[14px]`} />
              <span className="hidden sm:inline">{tab.label}</span>
              {badge > 0 && (
                <span className="text-[8px] font-bold bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}

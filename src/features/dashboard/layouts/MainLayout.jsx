import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../layouts/Sidebar.jsx';
import AppHeader from '../layouts/AppHeader.jsx';

/**
 * Main Layout — Ultra-Premium Minimalist Light theme (Admin Style)
 * Full flexbox structure with sticky header and scrollable content area.
 */
export default function MainLayout({
  currentView,
  onLogout,
  currentUser,
  storagePercentage,
  totalStorageMB,
  maxStorageMB,
  documentsCount,
  deletedDocsCount = 0,
  searchTerm,
  onSearchChange,
  avatarUrl,
  accentColor,
  isAdmin,
  children,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen max-h-screen bg-[#fafafb] text-[#1d1d1f] font-sans overflow-hidden relative">
      
      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Modern Sidebar (Flex Sibling) */}
      <Sidebar
        currentView={currentView}
        onLogout={onLogout}
        currentUser={currentUser}
        storagePercentage={storagePercentage}
        totalStorageMB={totalStorageMB}
        maxStorageMB={maxStorageMB}
        documentsCount={documentsCount}
        deletedDocsCount={deletedDocsCount}
        avatarUrl={avatarUrl}
        accentColor={accentColor}
        isAdmin={isAdmin}
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
      />

      {/* Central Content Panel */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#fafafb] relative">
        {/* App Header (Sticky Top) */}
        <header className="sticky top-0 z-20 h-[64px] bg-white/80 backdrop-blur-xl border-b border-black/[0.04] flex items-center justify-between px-4 md:px-8 shrink-0">
          <AppHeader 
            searchTerm={searchTerm} 
            onSearchChange={onSearchChange}
            avatarUrl={avatarUrl}
            accentColor={accentColor}
            onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
          />
        </header>

        {/* Independent Page Viewport Container */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}


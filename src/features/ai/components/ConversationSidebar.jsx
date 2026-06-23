import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConversationSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isOpen,
  onClose,
}) {
  const [hoveredId, setHoveredId] = useState(null);

  const sorted = [...conversations].sort((a, b) => {
    return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
  });

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 h-[54px] border-b border-black/[0.04] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#ff8a00] to-[#ff5c00] flex items-center justify-center">
            <i className="bi bi-chat-dots-fill text-white text-[10px]" />
          </div>
          <h3 className="text-[13px] font-bold text-[#1d1d1f]">Hội thoại</h3>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg hover:bg-black/[0.04] flex items-center justify-center md:hidden cursor-pointer"
        >
          <i className="bi bi-x-lg text-[11px] text-black/35" />
        </button>
      </div>

      {/* New Chat */}
      <div className="px-3 pt-3 pb-1 flex-shrink-0">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] text-white font-semibold text-[11.5px] shadow-sm shadow-[#ff5c00]/15 hover:shadow-md hover:shadow-[#ff5c00]/25 hover:brightness-105 transition-all duration-200 cursor-pointer"
        >
          <i className="bi bi-plus-lg text-[12px]" />
          Trò chuyện mới
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-px hide-scrollbar">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-10 h-10 rounded-xl bg-black/[0.02] flex items-center justify-center mb-2">
              <i className="bi bi-chat-left text-[18px] text-black/8" />
            </div>
            <p className="text-[11px] text-black/20 font-medium">Chưa có hội thoại</p>
            <p className="text-[10px] text-black/12 font-medium mt-0.5">Hỏi CapyAI bất cứ điều gì</p>
          </div>
        ) : (
          sorted.map((conv) => {
            const id = conv.id || conv.conversationId;
            const isActive = id === activeConversationId;
            const title = conv.title || conv.name || 'Cuộc trò chuyện';
            return (
              <div
                key={id}
                onMouseEnter={() => setHoveredId(id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelectConversation(id)}
                className={`group flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-150
                  ${isActive
                    ? 'bg-[#ff5c00]/[0.05] text-[#ff5c00]'
                    : 'hover:bg-black/[0.02] text-black/50'
                  }`}
              >
                <i className={`bi bi-chat-left-text text-[10px] flex-shrink-0 ${isActive ? 'text-[#ff5c00]' : 'text-black/20'}`} />
                <span className={`text-[11.5px] truncate flex-1 ${isActive ? 'font-semibold text-[#ff5c00]' : 'font-medium'}`}>
                  {title}
                </span>
                {hoveredId === id && onDeleteConversation && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={(e) => { e.stopPropagation(); onDeleteConversation(id); }}
                    className="w-5 h-5 rounded hover:bg-red-50 flex items-center justify-center flex-shrink-0 cursor-pointer"
                  >
                    <i className="bi bi-trash3 text-[9px] text-black/20 hover:text-red-500" />
                  </motion.button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2.5 border-t border-black/[0.03] flex-shrink-0">
        <div className="flex items-center gap-2 px-1.5">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-[#ff8a00] to-[#ff5c00] flex items-center justify-center">
            <i className="bi bi-stars text-white text-[8px]" />
          </div>
          <div className="leading-tight">
            <p className="text-[10px] font-bold text-black/25">Capy Study</p>
            <p className="text-[8.5px] text-black/12 font-medium">Powered by CapyAI</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex w-[240px] flex-shrink-0 border-r border-black/[0.04] flex-col h-full">
        {sidebarContent}
      </div>

      {/* Mobile */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              className="fixed left-0 top-0 bottom-0 w-[260px] shadow-2xl z-50 md:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

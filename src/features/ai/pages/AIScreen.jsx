import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { useAIChat } from '../hooks/useAIChat.js';
import MessageList from '../components/MessageList.jsx';
import ChatInput from '../components/ChatInput.jsx';
import ConversationSidebar from '../components/ConversationSidebar.jsx';

const SCOPES = [
  { key: 'all', icon: 'bi-collection', label: 'Tất cả tài liệu', desc: 'Tìm kiếm toàn bộ kho tài liệu' },
  { key: 'document', icon: 'bi-file-earmark-text', label: 'Theo tài liệu', desc: 'Hỏi đáp dựa trên 1 tài liệu cụ thể' },
  { key: 'folder', icon: 'bi-folder2-open', label: 'Theo thư mục', desc: 'Tìm trong toàn bộ thư mục' },
];

export default function AIScreen() {
  const outletContext = useOutletContext() || {};
  const { fullName } = outletContext;

  const {
    messages,
    conversations,
    activeConversationId,
    isLoading,
    isSending,
    error,
    chatContext,
    setChatContext,
    fetchConversations,
    loadConversation,
    createNewConversation,
    sendMessage,
    deleteConversation,
  } = useAIChat();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showScopeDropdown, setShowScopeDropdown] = useState(false);
  const scopeRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (scopeRef.current && !scopeRef.current.contains(e.target)) {
        setShowScopeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSend = (text) => sendMessage(text);
  const handleSelectPrompt = (prompt) => sendMessage(prompt);
  const handleClearContext = () => {
    setChatContext({ scope: 'all', documentId: null, folderId: null, contextName: null });
  };

  const activeScope = SCOPES.find(s => s.key === chatContext.scope) || SCOPES[0];

  return (
    <div className="flex h-full w-full overflow-hidden bg-white">
      {/* ─── Sidebar ─── */}
      <ConversationSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={loadConversation}
        onNewConversation={createNewConversation}
        onDeleteConversation={deleteConversation}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* ─── Main Chat Panel ─── */}
      <div className="flex-1 flex flex-col min-w-0 relative bg-[#fafafa]">

        {/* ═══ Header ═══ */}
        <div className="flex items-center justify-between px-4 sm:px-5 h-[54px] border-b border-black/[0.04] bg-white flex-shrink-0 relative z-20">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="w-8 h-8 rounded-lg hover:bg-black/[0.04] flex items-center justify-center md:hidden transition-colors cursor-pointer"
            >
              <i className="bi bi-layout-sidebar text-[15px] text-black/40" />
            </button>

            {/* CapyAI Identity */}
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ff8a00] to-[#ff5c00] flex items-center justify-center shadow-sm shadow-[#ff5c00]/15">
                  <i className="bi bi-stars text-white text-[14px]" />
                </div>
                <div className="absolute -bottom-px -right-px w-[9px] h-[9px] bg-emerald-400 rounded-full border-[1.5px] border-white" />
              </div>
              <div className="leading-tight">
                <h2 className="text-[13px] font-bold text-[#1d1d1f] tracking-[-0.01em] flex items-center gap-1.5">
                  CapyAI
                  <span className="text-[8px] font-bold text-[#ff5c00] bg-[#ff5c00]/[0.08] px-1.5 py-[1px] rounded-md uppercase tracking-wide">Beta</span>
                </h2>
                <p className="text-[10px] text-black/30 font-medium flex items-center gap-1">
                  <span className="w-[5px] h-[5px] bg-emerald-400 rounded-full" />
                  Trợ lý học tập thông minh
                </p>
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Scope Dropdown */}
            <div ref={scopeRef} className="relative">
              <button
                onClick={() => setShowScopeDropdown(!showScopeDropdown)}
                className={`h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-[11px] font-semibold transition-all duration-200 cursor-pointer
                  ${showScopeDropdown
                    ? 'bg-[#ff5c00]/[0.06] text-[#ff5c00]'
                    : 'text-black/40 hover:bg-black/[0.03] hover:text-black/60'
                  }`}
              >
                <i className="bi bi-sliders2 text-[11px]" />
                <span className="hidden sm:inline">{activeScope.label}</span>
                <i className={`bi bi-chevron-down text-[8px] transition-transform duration-200 ${showScopeDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown (opens downward, z-50) */}
              <AnimatePresence>
                {showScopeDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.12 }}
                    className="absolute top-full right-0 mt-1.5 w-[260px] bg-white border border-black/[0.06] rounded-xl shadow-xl shadow-black/[0.08] py-1.5 px-1.5 z-50"
                  >
                    <p className="text-[9px] font-bold text-black/25 uppercase tracking-wider px-2.5 pt-1 pb-1.5">Phạm vi tìm kiếm</p>
                    {SCOPES.map((scope) => {
                      const isActive = chatContext.scope === scope.key;
                      return (
                        <button
                          key={scope.key}
                          onClick={() => {
                            setChatContext(scope.key === 'all'
                              ? { scope: 'all', documentId: null, folderId: null, contextName: null }
                              : prev => ({ ...prev, scope: scope.key })
                            );
                            setShowScopeDropdown(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left cursor-pointer transition-all duration-150 mb-0.5
                            ${isActive ? 'bg-[#ff5c00]/[0.05]' : 'hover:bg-black/[0.02]'}`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-[#ff5c00]/10 text-[#ff5c00]' : 'bg-black/[0.03] text-black/30'
                            }`}>
                            <i className={`bi ${scope.icon} text-[12px]`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[11.5px] font-semibold leading-tight ${isActive ? 'text-[#ff5c00]' : 'text-black/55'}`}>{scope.label}</p>
                            <p className="text-[9.5px] text-black/25 font-medium leading-tight">{scope.desc}</p>
                          </div>
                          {isActive && <i className="bi bi-check2 text-[13px] text-[#ff5c00] flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-px h-4 bg-black/[0.06] mx-0.5 hidden sm:block" />

            <button
              onClick={createNewConversation}
              className="h-8 px-2.5 rounded-lg hover:bg-black/[0.03] text-black/40 hover:text-black/60 flex items-center gap-1.5 text-[11px] font-semibold transition-all duration-200 cursor-pointer"
            >
              <i className="bi bi-plus-circle text-[13px]" />
              <span className="hidden sm:inline">Mới</span>
            </button>
          </div>
        </div>

        {/* ═══ Messages ═══ */}
        <MessageList
          messages={messages}
          onSelectPrompt={handleSelectPrompt}
        />

        {/* ═══ Input ═══ */}
        <ChatInput
          onSend={handleSend}
          isSending={isSending}
          chatContext={chatContext}
          onClearContext={handleClearContext}
        />
      </div>
    </div>
  );
}

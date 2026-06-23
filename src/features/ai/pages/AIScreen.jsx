import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { useAIChat } from '../hooks/useAIChat.js';
import MessageList from '../components/MessageList.jsx';
import ChatInput from '../components/ChatInput.jsx';
import ConversationSidebar from '../components/ConversationSidebar.jsx';
import KnowledgePickerModal from '../components/KnowledgePickerModal.jsx';
import logoAI from '../../../assets/logo_AI.png';

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
  const [pickerModal, setPickerModal] = useState({ open: false, type: 'document' }); // 'document' or 'folder'
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

  const handleScopeSelect = (scopeKey) => {
    if (scopeKey === 'all') {
      setChatContext({ scope: 'all', documentId: null, folderId: null, contextName: null });
      setShowScopeDropdown(false);
    } else {
      setPickerModal({ open: true, type: scopeKey });
      setShowScopeDropdown(false);
    }
  };

  const handlePickerSelect = (item) => {
    if (pickerModal.type === 'document') {
      setChatContext({ 
        scope: 'document', 
        documentId: item.documentId || item.id, 
        folderId: null, 
        contextName: item.fileName || item.name 
      });
    } else {
      setChatContext({ 
        scope: 'folder', 
        documentId: null, 
        folderId: item.folderId || item.id, 
        contextName: item.name 
      });
    }
    setPickerModal({ open: false, type: pickerModal.type });
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
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-black/[0.04] bg-white flex-shrink-0 relative z-20 min-h-[64px]">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="w-8 h-8 rounded-lg hover:bg-black/[0.04] flex items-center justify-center md:hidden transition-colors cursor-pointer"
            >
              <i className="bi bi-layout-sidebar text-[15px] text-black/40" />
            </button>

            {/* Giáo Sư Capy Identity */}
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm shadow-[#ff5c00]/15 overflow-hidden border border-black/5">
                  <img src={logoAI} alt="Giáo Sư Capy" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-px -right-px w-[10px] h-[10px] bg-emerald-400 rounded-full border-[1.5px] border-white z-10" />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-xl font-semibold text-[#1d1d1f] flex items-center gap-2 leading-none mb-1">
                  Giáo Sư Capy
                  <span className="text-[10px] font-semibold text-[#ff5c00] bg-[#ff5c00]/10 px-1.5 py-0.5 rounded-md uppercase border border-[#ff5c00]/20">Beta</span>
                </h2>
                <p className="text-[12px] text-black/55 font-medium flex items-center gap-1.5 leading-none">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
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
                className={`h-9 px-3 rounded-lg flex items-center gap-1.5 text-[13px] font-medium transition-all duration-200 cursor-pointer
                  ${showScopeDropdown || chatContext.scope !== 'all'
                    ? 'bg-[#ff5c00]/10 text-[#ff5c00]'
                    : 'text-black/55 hover:bg-black/[0.03] hover:text-black'
                  }`}
              >
                <i className={`bi ${activeScope.icon} text-[13px]`} />
                <span className="hidden sm:inline max-w-[150px] truncate">
                  {chatContext.contextName ? chatContext.contextName : activeScope.label}
                </span>
                <i className={`bi bi-chevron-down text-[10px] transition-transform duration-200 ml-1 ${showScopeDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown (opens downward, z-50) */}
              <AnimatePresence>
                {showScopeDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.12 }}
                    className="absolute top-full right-0 mt-1.5 w-[260px] bg-white border border-black/5 rounded-xl shadow-lg py-1.5 px-1.5 z-50"
                  >
                    <p className="text-[10px] font-semibold text-black/40 uppercase px-2.5 pt-1 pb-1.5">Phạm vi tìm kiếm</p>
                    {SCOPES.map((scope) => {
                      const isActive = chatContext.scope === scope.key;
                      return (
                        <button
                          key={scope.key}
                          onClick={() => handleScopeSelect(scope.key)}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left cursor-pointer transition-all duration-150 mb-0.5
                            ${isActive ? 'bg-[#ff5c00]/10' : 'hover:bg-black/[0.03]'}`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-[#ff5c00]/10 text-[#ff5c00]' : 'bg-black/[0.03] text-black/55'
                            }`}>
                            <i className={`bi ${scope.icon} text-[13px]`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[12px] font-medium leading-tight mb-0.5 ${isActive ? 'text-[#ff5c00]' : 'text-[#1d1d1f]'}`}>{scope.label}</p>
                            <p className="text-[11px] text-black/55 font-medium leading-tight">{scope.desc}</p>
                          </div>
                          {isActive && <i className="bi bi-check2 text-[14px] text-[#ff5c00] flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-px h-5 bg-black/5 mx-1 hidden sm:block" />

            <button
              onClick={createNewConversation}
              className="h-9 px-3 rounded-lg hover:bg-black/[0.03] text-black/55 hover:text-black flex items-center gap-1.5 text-[13px] font-medium transition-all duration-200 cursor-pointer"
            >
              <i className="bi bi-plus-circle text-[14px]" />
              <span className="hidden sm:inline">Trò chuyện mới</span>
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

      <KnowledgePickerModal
        open={pickerModal.open}
        type={pickerModal.type}
        onCancel={() => setPickerModal(prev => ({ ...prev, open: false }))}
        onSelect={handlePickerSelect}
      />
    </div>
  );
}

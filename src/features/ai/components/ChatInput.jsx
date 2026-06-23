import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatInput({
  onSend,
  isSending,
  chatContext,
  onClearContext,
}) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleSubmit = () => {
    if (!input.trim() || isSending) return;
    onSend(input);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const scopeIcon = chatContext?.scope === 'document'
    ? 'bi-file-earmark-text'
    : chatContext?.scope === 'folder'
      ? 'bi-folder2-open'
      : null;

  const scopeLabel = chatContext?.scope === 'document'
    ? (chatContext.contextName || 'Tài liệu')
    : chatContext?.scope === 'folder'
      ? (chatContext.contextName || 'Thư mục')
      : null;

  const hasInput = input.trim().length > 0;

  return (
    <div className="flex-shrink-0 border-t border-black/[0.04] bg-gradient-to-t from-white via-white to-[#fafafa]">
      <div className="max-w-[700px] mx-auto px-4 sm:px-5 pt-3 pb-3">
        {/* Context Badge */}
        <AnimatePresence>
          {scopeLabel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#ff5c00]/[0.06] border border-[#ff5c00]/10">
                <i className={`bi ${scopeIcon} text-[11px] text-[#ff5c00]`} />
                <span className="text-[11px] font-semibold text-[#ff5c00]">{scopeLabel}</span>
                <button
                  onClick={onClearContext}
                  className="w-[18px] h-[18px] rounded-full bg-[#ff5c00]/10 hover:bg-[#ff5c00]/20 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <i className="bi bi-x text-[10px] text-[#ff5c00]/70" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ Input Box ═══ */}
        <div className={`relative rounded-xl border-2 transition-all duration-300 overflow-hidden ${isFocused
          ? 'border-[#ff5c00]/30 bg-white shadow-lg shadow-[#ff5c00]/[0.06]'
          : 'border-black/[0.06] bg-white hover:border-black/[0.1]'
          }`}>
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Hỏi Giáo Sư Capy bất cứ điều gì..."
            rows={1}
            disabled={isSending}
            className="w-full bg-transparent px-4 pt-3 pb-2 text-[13.5px] text-[#1d1d1f] font-medium placeholder:text-black/25 outline-none resize-none max-h-[120px] disabled:opacity-40 leading-relaxed"
          />

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-3 pb-2.5">
            {/* Left hints */}
            <div className="flex items-center gap-2.5">
              <span className="text-[9.5px] text-black/20 font-medium flex items-center gap-1">
                <kbd className="inline-flex items-center justify-center w-4 h-4 rounded bg-black/[0.04] text-black/30 font-bold text-[8px]">↵</kbd>
                gửi
              </span>
              <span className="text-[9.5px] text-black/20 font-medium flex items-center gap-1">
                <kbd className="inline-flex items-center justify-center px-1 h-4 rounded bg-black/[0.04] text-black/30 font-bold text-[8px]">⇧↵</kbd>
                dòng mới
              </span>
            </div>

            {/* Send Button */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={handleSubmit}
              disabled={!hasInput || isSending}
              className={`h-8 rounded-lg flex items-center gap-1.5 transition-all duration-200 cursor-pointer font-semibold text-[12px] ${hasInput && !isSending
                ? 'bg-gradient-to-r from-[#ff7a00] to-[#ff5c00] text-white px-4 shadow-md shadow-[#ff5c00]/20 hover:shadow-lg hover:shadow-[#ff5c00]/30 hover:brightness-110'
                : 'bg-black/[0.04] text-black/20 px-3 cursor-not-allowed'
                }`}
            >
              {isSending ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <i className="bi bi-send-fill text-[11px]" />
                  <span className="hidden sm:inline">Gửi</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[9px] text-black/15 font-medium mt-2">
          Giáo Sư Capy có thể tạo ra thông tin không chính xác. Hãy kiểm tra lại các thông tin quan trọng.
        </p>
      </div>
    </div>
  );
}

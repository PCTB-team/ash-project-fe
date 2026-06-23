import { motion } from 'framer-motion';
import logoAI from '../../../assets/logo_AI.png';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const isError = message.isError;
  const isLoading = message.isLoading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 overflow-hidden shadow-sm ${isUser
        ? 'bg-gradient-to-br from-[#ff8a00] to-[#ff5c00]'
        : 'bg-white border border-black/5 shadow-[#ff5c00]/10'
        }`}>
        {isUser ? (
          <i className="bi bi-person-fill text-white text-[13px]" />
        ) : (
          <img src={logoAI} alt="AI" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Content */}
      <div className={`max-w-[80%] min-w-0 flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Name + time */}
        <div className={`flex items-center gap-2 mb-1 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="text-[12px] font-semibold text-black/40">{isUser ? 'Bạn' : 'CapyAI'}</span>
          <span className="text-[11px] text-black/30 font-medium">
            {new Date(message.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Bubble */}
        <div className={`rounded-2xl px-4 py-3 ${isUser
          ? 'bg-gradient-to-br from-[#ff8a00] to-[#ff5c00] text-white rounded-tr-md'
          : isError
            ? 'bg-red-50 border border-red-100 text-red-600 rounded-tl-md'
            : 'bg-white border border-black/[0.05] text-[#1d1d1f] rounded-tl-md shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
          }`}>
          {isLoading ? (
            <div className="flex items-center gap-2 py-0.5">
              <div className="flex gap-[4px]">
                {[0, 1, 2].map(i => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.13, ease: 'easeInOut' }}
                    className="w-[5px] h-[5px] bg-[#ff5c00]/30 rounded-full"
                  />
                ))}
              </div>
              <span className="text-[12px] text-black/30 font-medium">Đang phân tích...</span>
            </div>
          ) : (
            <div className={`text-[14px] leading-relaxed whitespace-pre-wrap break-words ${isUser ? 'font-medium' : ''}`}>
              {isError && <i className="bi bi-exclamation-triangle-fill text-[12px] mr-1.5" />}
              {message.content}
            </div>
          )}
        </div>

        {/* Sources */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-2 flex items-center flex-wrap gap-1.5">
            <span className="text-[10px] font-semibold text-black/40 uppercase">Nguồn:</span>
            {message.sources.map((src, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#ff5c00] bg-[#ff5c00]/[0.06] px-2 py-0.5 rounded-md border border-[#ff5c00]/10">
                <i className="bi bi-file-earmark-text text-[10px]" />
                {src.name || src.fileName || `Tài liệu ${i + 1}`}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

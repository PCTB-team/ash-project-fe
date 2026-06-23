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
          <span className="text-[12px] font-semibold text-black/40">{isUser ? 'Bạn' : 'Giáo Sư Capy'}</span>
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

        {/* Sources & Badge */}
        {!isUser && !isLoading && !isError && (
          <div className="mt-2 flex flex-col gap-1.5">
            {message.answerSource === 'DOCUMENT' && (
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded border border-emerald-100">
                <i className="bi bi-shield-check" />
                DỰA TRÊN TÀI LIỆU CỦA BẠN
              </div>
            )}
            
            {message.sources && message.sources.length > 0 && (
              <div className="flex items-start flex-wrap gap-1.5 mt-0.5">
                <span className="text-[10px] font-semibold text-black/40 uppercase mt-1">Nguồn tham khảo:</span>
                <div className="flex flex-wrap gap-1.5">
                  {message.sources.map((src, i) => (
                    <div 
                      key={i} 
                      title={src.excerpt}
                      className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#ff5c00] bg-[#ff5c00]/[0.06] px-2.5 py-1 rounded-md border border-[#ff5c00]/15 hover:bg-[#ff5c00]/10 transition-colors cursor-help"
                    >
                      <i className="bi bi-file-earmark-text text-[10px]" />
                      <span className="max-w-[150px] truncate">{src.fileName || src.name || `Tài liệu ${i + 1}`}</span>
                      {src.chunkIndex !== undefined && (
                        <span className="text-[9px] bg-[#ff5c00]/10 px-1 rounded text-[#ff5c00]/70">#{src.chunkIndex}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

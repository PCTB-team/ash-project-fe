import { motion } from 'framer-motion';
import logoAI from '../../../assets/logo_AI.png';

const SUGGESTIONS = [
  {
    icon: 'bi-book',
    title: 'Hỏi đáp tài liệu',
    description: 'Đặt câu hỏi về nội dung tài liệu bạn đã upload',
    prompt: 'Giải thích nội dung chính của tài liệu gần nhất tôi đã tải lên',
    color: 'blue',
  },
  {
    icon: 'bi-file-earmark-text',
    title: 'Tóm tắt tài liệu',
    description: 'AI phân tích và tóm tắt nội dung nhanh chóng',
    prompt: 'Hãy tóm tắt ngắn gọn tài liệu của tôi',
    color: 'emerald',
  },
  {
    icon: 'bi-lightbulb',
    title: 'Hỗ trợ học tập',
    description: 'Giải đáp câu hỏi và gợi ý phương pháp',
    prompt: 'Gợi ý phương pháp học hiệu quả cho môn học của tôi',
    color: 'amber',
  },
  {
    icon: 'bi-question-circle',
    title: 'Hướng dẫn sử dụng',
    description: 'Tìm hiểu cách sử dụng Capy Study',
    prompt: 'Hướng dẫn tôi cách sử dụng hệ thống Capy Study',
    color: 'purple',
  },
];

export default function WelcomePrompts({ onSelectPrompt }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-10 select-none">
      {/* ─── Hero ─── */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        className="mb-8 text-center"
      >
        {/* Logo */}
        <div className="relative inline-flex items-center justify-center mb-5">
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.25, 0.1, 0.25] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-20 h-20 rounded-full bg-[#ff5c00]/20 blur-xl"
          />
          <div className="relative w-[60px] h-[60px] rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-[#ff5c00]/20 ring-4 ring-white overflow-hidden border border-black/5">
            <img src={logoAI} alt="CapyAI" className="w-full h-full object-cover" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-2 flex items-center justify-center gap-2">
          Xin chào! Tôi là CapyAI <i className="bi bi-robot text-[#ff5c00] text-[22px]" />
        </h2>
        <p className="text-[13px] text-black/55 font-medium max-w-[420px] leading-relaxed mx-auto">
          Trợ lý học tập thông minh của Capy Study — hỏi đáp, tóm tắt, và hỗ trợ bạn mọi lúc.
        </p>
      </motion.div>

      {/* ─── Suggestion Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-[480px]">
        {SUGGESTIONS.map((item, idx) => {
          const colorStyles = {
            blue: 'bg-blue-50 text-blue-500 group-hover:bg-blue-100 border-blue-100',
            emerald: 'bg-emerald-50 text-emerald-500 group-hover:bg-emerald-100 border-emerald-100',
            amber: 'bg-amber-50 text-amber-500 group-hover:bg-amber-100 border-amber-100',
            purple: 'bg-purple-50 text-purple-500 group-hover:bg-purple-100 border-purple-100',
          }[item.color];

          return (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 + idx * 0.06, type: 'spring', stiffness: 240, damping: 24 }}
              whileHover={{ y: -1 }}
              onClick={() => onSelectPrompt(item.prompt)}
              className="group text-left px-3.5 py-3 rounded-xl border border-black/[0.05] bg-white hover:border-[#ff5c00]/20 hover:shadow-md hover:shadow-[#ff5c00]/[0.04] transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${colorStyles.split(' ').slice(0, 3).join(' ')}`}>
                  <i className={`bi ${item.icon} text-[14px]`} />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <h4 className="text-[14px] font-semibold text-[#1d1d1f] mb-0.5 group-hover:text-[#ff5c00] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[12px] text-black/55 font-medium leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* ─── Footer ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex items-center gap-2"
      >
        <i className="bi bi-shield-lock text-[13px] text-black/30" />
        <span className="text-[12px] text-black/40 font-medium">
          CapyAI chỉ truy cập tài liệu bạn có quyền
        </span>
      </motion.div>
    </div>
  );
}

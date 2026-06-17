import { Button } from 'antd';
import { motion } from 'framer-motion';

export default function NotFoundScreen({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden relative">
      {/* Background glowing blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 25 }}
        className="max-w-md w-full"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1, type: "spring", bounce: 0.5 }}
          className="text-[120px] md:text-[150px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1d1d1f] to-black/30 leading-none tracking-tighter mb-4"
        >
          404
        </motion.div>

        <h1 className="text-[24px] md:text-[32px] font-semibold text-[#1d1d1f] tracking-tight mb-3">
          Không tìm thấy trang
        </h1>
        <p className="text-[15px] text-black/50 font-medium mb-10 leading-relaxed">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại, đã bị gỡ bỏ hoặc tạm thời không thể truy cập.
        </p>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="primary"
            onClick={() => onNavigate ? onNavigate('landing') : window.location.href = '/'}
            className="h-12 px-8 rounded-full font-semibold text-[15px] bg-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20 border-none transition-all hover:brightness-110"
          >
            Trở về Trang chủ
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

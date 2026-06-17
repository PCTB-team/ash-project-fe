import { motion } from 'framer-motion';

const errorMessages = {
  401: { icon: 'bi-shield-lock', title: 'Chưa đăng nhập', desc: 'Vui lòng đăng nhập để tiếp tục.' },
  403: { icon: 'bi-ban', title: 'Không có quyền truy cập', desc: 'Bạn không có quyền thực hiện hành động này.' },
  404: { icon: 'bi-search', title: 'Không tìm thấy', desc: 'Nội dung bạn tìm kiếm không tồn tại.' },
  400: { icon: 'bi-x-octagon', title: 'Yêu cầu không hợp lệ', desc: 'Thông tin gửi lên không chính xác.' },
  409: { icon: 'bi-exclamation-diamond', title: 'Xung đột dữ liệu', desc: 'Bạn đã là thành viên của nhóm này.' },
  413: { icon: 'bi-hdd-stack', title: 'Hết dung lượng', desc: 'Bạn đã sử dụng hết dung lượng lưu trữ.' },
  500: { icon: 'bi-cloud-slash', title: 'Lỗi hệ thống', desc: 'Đã xảy ra lỗi máy chủ. Vui lòng thử lại.' },
  network: { icon: 'bi-wifi-off', title: 'Mất kết nối', desc: 'Kiểm tra kết nối Internet và thử lại.' },
};

export default function ErrorState({ code = 500, title, description, onRetry }) {
  const config = errorMessages[code] || errorMessages[500];
  const displayTitle = title || config.title;
  const displayDesc = description || config.desc;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-red-500/5 rounded-full blur-2xl scale-150" />
        <div className="relative w-20 h-20 bg-gradient-to-br from-red-50 to-red-100 rounded-[22px] flex items-center justify-center border border-red-200/50 shadow-sm">
          <i className={`bi ${config.icon} text-[32px] text-red-400`} />
        </div>
      </div>

      <h4 className="text-[16px] font-semibold text-[var(--color-on-surface)] tracking-tight mb-1.5">
        {displayTitle}
      </h4>
      <p className="text-[13px] font-medium text-black/45 max-w-xs leading-relaxed mb-6">
        {displayDesc}
      </p>

      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onRetry}
          className="bg-[var(--color-surface-container-high)] hover:bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] font-medium text-[13px] px-6 py-2.5 rounded-xl border border-black/[0.06] cursor-pointer transition-all flex items-center gap-2"
        >
          <i className="bi bi-arrow-clockwise text-[14px]" /> Thử lại
        </motion.button>
      )}
    </motion.div>
  );
}

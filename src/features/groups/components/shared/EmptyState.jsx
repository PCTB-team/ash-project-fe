import { motion } from 'framer-motion';

const illustrations = {
  noGroups: 'bi-people',
  noMembers: 'bi-person-plus',
  noDocuments: 'bi-folder2-open',
  noRequests: 'bi-envelope-open',
  noStatistics: 'bi-bar-chart-line',
  noTrash: 'bi-trash3',
  default: 'bi-inbox',
};

export default function EmptyState({ type = 'default', title, description, actionText, onAction }) {
  const icon = illustrations[type] || illustrations.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-[var(--color-primary)]/5 rounded-full blur-2xl scale-150" />
        <div className="relative w-24 h-24 bg-gradient-to-br from-[var(--color-surface-container-high)] to-[var(--color-surface-container-low)] rounded-[28px] flex items-center justify-center border border-black/[0.04] shadow-sm">
          <i className={`bi ${icon} text-[36px] text-black/20`} />
        </div>
      </div>

      <h4 className="text-[17px] font-semibold text-[var(--color-on-surface)] mb-2">
        {title || 'Chưa có dữ liệu'}
      </h4>
      <p className="text-[13px] font-medium text-black/45 max-w-sm leading-relaxed mb-6">
        {description || 'Hiện tại không có nội dung nào để hiển thị.'}
      </p>

      {actionText && onAction && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAction}
          className="bg-gradient-to-b from-[var(--color-primary)] to-[#e05000] text-white font-medium text-[13px] px-6 py-3 rounded-2xl shadow-lg border-none cursor-pointer transition-all hover:shadow-sm hover:"
        >
          {actionText}
        </motion.button>
      )}
    </motion.div>
  );
}

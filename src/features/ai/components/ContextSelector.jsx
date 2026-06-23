import { motion, AnimatePresence } from 'framer-motion';

export default function ContextSelector({ chatContext, setChatContext, onClose }) {
  const scopes = [
    {
      key: 'all',
      icon: 'bi-collection',
      label: 'Tất cả tài liệu',
      description: 'AI sẽ tìm kiếm trên toàn bộ tài liệu cá nhân',
      bg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      borderActive: 'border-blue-200 bg-blue-50/50',
    },
    {
      key: 'document',
      icon: 'bi-file-earmark-text',
      label: 'Theo tài liệu',
      description: 'Hỏi đáp dựa trên một tài liệu cụ thể',
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
      borderActive: 'border-emerald-200 bg-emerald-50/50',
    },
    {
      key: 'folder',
      icon: 'bi-folder2-open',
      label: 'Theo thư mục',
      description: 'Tìm kiếm trong tất cả tài liệu của thư mục',
      bg: 'bg-purple-50',
      iconColor: 'text-purple-500',
      borderActive: 'border-purple-200 bg-purple-50/50',
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        className="absolute bottom-full left-0 right-0 mb-2 mx-3 bg-white border border-black/[0.06] rounded-2xl shadow-xl shadow-black/[0.08] p-3 z-30"
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[11px] font-bold text-black/40 uppercase tracking-wide">Phạm vi hỏi đáp</h4>
          <button onClick={onClose} className="w-6 h-6 rounded-lg hover:bg-black/[0.04] flex items-center justify-center transition-colors cursor-pointer">
            <i className="bi bi-x text-[14px] text-black/30" />
          </button>
        </div>
        <div className="space-y-1.5">
          {scopes.map((scope) => {
            const isActive = chatContext.scope === scope.key;
            return (
              <button
                key={scope.key}
                onClick={() => {
                  setChatContext(prev => ({ ...prev, scope: scope.key }));
                  if (scope.key === 'all') {
                    setChatContext({ scope: 'all', documentId: null, folderId: null, contextName: null });
                  }
                  onClose();
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left cursor-pointer
                  ${isActive ? scope.borderActive : 'border-transparent hover:bg-black/[0.02] hover:border-black/[0.04]'}`}
              >
                <div className={`w-9 h-9 rounded-xl ${scope.bg} flex items-center justify-center flex-shrink-0`}>
                  <i className={`bi ${scope.icon} ${scope.iconColor} text-[15px]`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[12px] font-semibold ${isActive ? 'text-[#1d1d1f]' : 'text-black/60'}`}>{scope.label}</p>
                  <p className="text-[10px] text-black/35 font-medium">{scope.description}</p>
                </div>
                {isActive && <i className="bi bi-check-circle-fill text-[14px] text-[#ff5c00] flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

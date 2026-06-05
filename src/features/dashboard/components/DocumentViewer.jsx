import { Modal, Button, Tag } from 'antd';
import { motion } from 'framer-motion';
import FileIcon from '../ui/FileIcon.jsx';
import { getFileTagColor, getFileTypeLabel } from '../utils/helpers.js';

/**
 * Premium Document Viewer Modal.
 * Displays file content in a beautiful glassmorphic modal with file metadata header.
 */
export default function DocumentViewer({
  document: doc,
  open,
  onClose,
  onAskAI,
  onDelete,
}) {
  if (!doc) return null;

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      styles={{ body: { padding: 0 } }}
      destroyOnHidden
      centered
      className="!p-0 overflow-hidden"
    >
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-[#1c1c1e] to-[#2c2c2e] px-6 py-5 flex items-center gap-4 relative overflow-hidden rounded-t-2xl">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-12 bg-white/[0.02] rounded-full blur-2xl pointer-events-none" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center backdrop-blur-md shadow-xl relative z-10"
        >
          <FileIcon type={doc.type} />
        </motion.div>

        <div className="text-left text-white z-10 flex-1 min-w-0">
          <h3 className="text-[16px] font-extrabold tracking-tight truncate drop-shadow-md leading-tight">
            {doc.name}
          </h3>
          <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
            <Tag color={getFileTagColor(doc.type)} className="font-bold text-[9px] uppercase rounded-full border-none px-2 py-0 m-0">
              {getFileTypeLabel(doc.type)}
            </Tag>
            <span className="text-[10px] font-bold text-white/50">{doc.size}</span>
            <span className="text-[10px] font-bold text-white/35">•</span>
            <span className="text-[10px] font-bold text-white/50">{doc.uploadedAt}</span>
          </div>
        </div>
      </div>

      {/* Document Content Body */}
      <div className="p-6 bg-[#fcfcfd] max-h-[55vh] overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <i className="bi bi-file-earmark-text text-[14px] text-black/30" />
          <span className="text-[10px] font-black text-black/35 uppercase tracking-widest">Nội dung tài liệu</span>
        </div>

        {doc.content ? (
          <div className="bg-white rounded-2xl border border-black/[0.04] p-5 shadow-sm">
            <p className="text-[13px] text-black/70 leading-relaxed font-medium whitespace-pre-line">
              {doc.content}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-black/[0.04] p-8 shadow-sm text-center">
            <i className="bi bi-file-earmark-x text-[36px] text-black/15 block mb-2" />
            <p className="text-[13px] text-black/35 font-semibold">
              Tài liệu chưa có nội dung xem trước.
            </p>
            <p className="text-[11px] text-black/25 font-medium mt-1">
              Hãy sử dụng Trợ lý AI để phân tích và tóm tắt tài liệu này.
            </p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-black/[0.04] bg-white rounded-b-2xl flex justify-between items-center gap-3">
        <Button
          type="text"
          danger
          size="small"
          onClick={() => { onDelete?.(doc.id); onClose(); }}
          className="text-[11px] font-bold rounded-lg h-8 px-3 flex items-center gap-1.5"
        >
          <i className="bi bi-trash3 text-[12px]" /> Xóa tài liệu
        </Button>

        <div className="flex gap-2.5">
          <Button
            onClick={onClose}
            className="rounded-xl font-bold text-[12px] h-9 px-4 border-black/10"
          >
            Đóng
          </Button>
          <Button
            type="primary"
            onClick={() => { onAskAI?.(doc); onClose(); }}
            className="rounded-xl font-extrabold text-[12px] h-9 px-5 shadow-md shadow-[#ff5c00]/20"
          >
            <i className="bi bi-chat-dots mr-1.5" /> Hỏi AI về tài liệu
          </Button>
        </div>
      </div>
    </Modal>
  );
}


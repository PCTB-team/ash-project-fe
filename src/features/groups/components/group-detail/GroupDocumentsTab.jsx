import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'antd';
import EmptyState from '../shared/EmptyState';

const fileTypeIcons = {
  pdf: { icon: 'bi-file-earmark-pdf-fill', color: 'text-red-500', bg: 'bg-red-50' },
  doc: { icon: 'bi-file-earmark-word-fill', color: 'text-blue-600', bg: 'bg-blue-50' },
  docx: { icon: 'bi-file-earmark-word-fill', color: 'text-blue-600', bg: 'bg-blue-50' },
  xls: { icon: 'bi-file-earmark-excel-fill', color: 'text-green-600', bg: 'bg-green-50' },
  xlsx: { icon: 'bi-file-earmark-excel-fill', color: 'text-green-600', bg: 'bg-green-50' },
  ppt: { icon: 'bi-file-earmark-ppt-fill', color: 'text-orange-500', bg: 'bg-orange-50' },
  pptx: { icon: 'bi-file-earmark-ppt-fill', color: 'text-orange-500', bg: 'bg-orange-50' },
  zip: { icon: 'bi-file-earmark-zip-fill', color: 'text-amber-600', bg: 'bg-amber-50' },
  jpg: { icon: 'bi-file-earmark-image-fill', color: 'text-pink-500', bg: 'bg-pink-50' },
  png: { icon: 'bi-file-earmark-image-fill', color: 'text-pink-500', bg: 'bg-pink-50' },
};

const getFileIcon = (type) => fileTypeIcons[type?.toLowerCase()] || { icon: 'bi-file-earmark-fill', color: 'text-[var(--color-primary)]', bg: 'bg-[var(--color-primary-container)]' };

export default function GroupDocumentsTab({ group, files = [], currentUser, isOwner, canUpload, onUpload, onDelete }) {
  const docs = files.length > 0 ? files : (group.documents || []);

  const sorted = [...docs].sort((a, b) => {
    return new Date(b.date || b.uploadedAt || 0) - new Date(a.date || a.uploadedAt || 0); // default server order (date)
  });

  const formatSize = (bytes) => {
    if (!bytes) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <motion.div key="docs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      {/* Toolbar */}
      {canUpload && (
        <div className="flex justify-end mb-4">
          <Button type="primary" icon={<i className="bi bi-cloud-arrow-up text-[15px]" />} onClick={onUpload}
            className="font-medium rounded-xl px-5 h-10 shadow-lg border-none bg-[var(--color-primary)] hover:-translate-y-0.5 transition-transform">
            Upload tài liệu
          </Button>
        </div>
      )}

      {/* File Grid */}
      {sorted.length === 0 ? (
        <div className="bg-[var(--color-surface)] border border-black/[0.04] rounded-2xl shadow-sm">
          <EmptyState type="noDocuments" title="Chưa có tài liệu" description="Chưa có tài liệu nào được chia sẻ. Hãy upload tài liệu đầu tiên!" actionText={canUpload ? 'Upload ngay' : undefined} onAction={canUpload ? onUpload : undefined} />
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {sorted.map((doc, idx) => {
              const ext = doc.type || doc.fileExtension?.replace('.', '') || 'file';
              const fi = getFileIcon(ext);
              const name = doc.name || doc.fileName || 'Untitled';
              const uploader = doc.uploader || doc.uploadedBy || '';
              const size = doc.fileSize || doc.size;
              const date = doc.date || doc.uploadedAt || doc.createdAt || '';

              return (
                <motion.div key={doc.id || doc.documentId || idx}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.04 }}
                  className="border border-black/[0.04] rounded-xl p-5 hover:border-[var(--color-primary)]/20 transition-all bg-[var(--color-surface)] hover:shadow-md hover:shadow-black/5 flex flex-col justify-between group">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-[14px] ${fi.bg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                      <i className={`bi ${fi.icon} ${fi.color} text-[20px]`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="font-medium text-[14px] text-[var(--color-on-surface)] truncate mb-1 group-hover:text-[var(--color-primary)] transition-colors">{name}</h5>
                      <div className="flex items-center gap-2 text-[11px] text-black/40 font-medium flex-wrap">
                        <span className="flex items-center gap-1"><i className="bi bi-hdd" />{typeof size === 'number' ? formatSize(size) : size}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><i className="bi bi-clock-history" />{date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-black/[0.03]">
                    <span className="text-[11px] font-medium text-black/45 truncate max-w-[120px]">
                      <i className="bi bi-person mr-1" />{uploader === currentUser ? 'Bạn' : (uploader?.split('@')[0] || 'N/A')}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-black/40 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all cursor-pointer" title="Tải xuống">
                        <i className="bi bi-download text-[13px]" />
                      </button>
                      {isOwner && (
                        <button onClick={() => onDelete(group.id, doc.id || doc.documentId)} className="w-8 h-8 rounded-lg flex items-center justify-center text-black/40 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer" title="Xóa">
                          <i className="bi bi-trash3 text-[13px]" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}

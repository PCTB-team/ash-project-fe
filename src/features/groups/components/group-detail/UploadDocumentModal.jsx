import { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal, Upload, Button, Progress } from 'antd';

export default function UploadDocumentModal({ open, onCancel, onUpload }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const uploadProps = {
    beforeUpload: (f) => { setFile(f); return false; },
    onRemove: () => setFile(null),
    maxCount: 1,
    accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.txt,.csv,.md',
  };

  const handleUpload = async () => {
    if (!file) return;

    const fileToSend = file.originFileObj || file;

    setUploading(true);
    try { await onUpload(fileToSend); setFile(null); }
    finally { setUploading(false); }
  };

  const handleCancel = () => { setFile(null); setUploading(false); onCancel(); };

  return (
    <Modal open={open} onCancel={handleCancel} footer={null} width={480} centered destroyOnHidden
      closeIcon={<i className="bi bi-x-circle-fill text-[20px] text-white/50 hover:text-white transition-colors" />}
      className="modern-glass-modal p-0">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}>
        <div className="bg-gradient-to-br from-[var(--color-primary)] to-[#1a1a1a] px-8 py-8 flex flex-col items-center relative overflow-hidden text-center">
          <div className="absolute top-[-50%] right-[-10%] w-[150%] h-[200%] bg-white/5 rounded-full blur-[80px] pointer-events-none transform rotate-45" />
          <div className="w-16 h-16 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-white backdrop-blur-md shadow-sm relative z-10 mb-4">
            <i className="bi bi-cloud-arrow-up-fill text-[32px]" />
          </div>
          <h3 className="text-[20px] font-semibold text-white relative z-10">Upload Tài liệu</h3>
          <p className="text-[12px] font-medium text-white/70 mt-1 relative z-10">Đóng góp tài liệu cho nhóm học tập</p>
        </div>

        <div className="p-8 bg-[var(--color-surface)]">
          <Upload.Dragger {...uploadProps}
            className="!rounded-2xl !border-2 !border-dashed !border-[var(--color-primary)]/25 hover:!border-[var(--color-primary)] !bg-[var(--color-surface-container-low)] hover:!bg-[var(--color-primary)]/5 mb-6 transition-all duration-300 py-10 group overflow-hidden relative shadow-none hover:shadow-inner">
            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-[var(--color-surface)] shadow-md rounded-full flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform duration-300 border border-black/5">
                <i className="bi bi-file-earmark-arrow-up text-[var(--color-primary)] text-[20px]" />
              </div>
              <h4 className="text-[14px] font-medium text-[var(--color-on-surface)] mb-1">Click hoặc kéo thả file vào đây</h4>
              <p className="text-[11px] text-black/40 font-medium">PDF, DOCX, XLSX, PPTX, ZIP (Max 10MB)</p>
            </div>
          </Upload.Dragger>

          {file && (
            <div className="mb-6 p-4 rounded-xl bg-[var(--color-surface-container-low)] border border-black/[0.04] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                <i className="bi bi-file-earmark-check text-[var(--color-primary)] text-[16px]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-[var(--color-on-surface)] truncate">{file.name}</div>
                <div className="text-[11px] text-black/40 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
              {uploading && <Progress type="circle" percent={75} size={36} strokeColor="var(--color-primary)" />}
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={handleCancel} disabled={uploading}
              className="flex-1 !rounded-xl !font-medium !text-[13px] !h-12 !bg-black/5 !border-none hover:!bg-black/10 !text-black/60">
              Hủy bỏ
            </Button>
            <Button type="primary" onClick={handleUpload} loading={uploading} disabled={!file}
              className="flex-1 !rounded-xl !font-medium !text-[13px] !h-12 !shadow-lg ! !border-none !bg-[var(--color-primary)]">
              {uploading ? 'Đang tải lên...' : 'Xác nhận Upload'}
            </Button>
          </div>
        </div>
      </motion.div>
    </Modal>
  );
}

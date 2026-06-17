import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Modal } from 'antd';
import EmptyState from '../shared/EmptyState';

export default function GroupTrashTab({ group, trashFiles = [], fetchTrashFiles, onRestore }) {
  useEffect(() => {
    if (group?.id) fetchTrashFiles(group.id);
  }, [group?.id, fetchTrashFiles]);

  const handleRestore = (fileId, fileName) => {
    Modal.confirm({
      title: 'Khôi phục tài liệu',
      content: `Bạn muốn khôi phục "${fileName}" về kho tài liệu?`,
      okText: 'Khôi phục',
      cancelText: 'Hủy',
      okButtonProps: { className: '!rounded-xl !bg-[var(--color-primary)] !border-none' },
      cancelButtonProps: { className: '!rounded-xl' },
      centered: true,
      onOk: () => onRestore(group.id, fileId),
    });
  };

  if (trashFiles.length === 0) {
    return (
      <motion.div key="trash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
        className="bg-[var(--color-surface)] border border-black/[0.04] rounded-[24px] shadow-sm">
        <EmptyState type="noTrash" title="Thùng rác trống" description="Không có tài liệu nào trong thùng rác." />
      </motion.div>
    );
  }

  return (
    <motion.div key="trash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="bg-[var(--color-surface)] border border-black/[0.04] rounded-[20px] p-4 shadow-sm">
        <h4 className="font-semibold text-[16px] text-[var(--color-on-surface)] tracking-tight flex items-center gap-2">
          <i className="bi bi-trash3 text-black/40" /> Thùng rác
          <span className="text-[12px] font-normal text-black/40">({trashFiles.length} tài liệu)</span>
        </h4>
      </div>

      <div className="space-y-3">
        {trashFiles.map((file, idx) => {
          const name = file.fileName || file.name || 'Untitled';
          const deletedAt = file.deletedAt || file.deletedDate || '—';
          const deletedBy = file.deletedBy || file.uploader || '—';
          const fileId = file.fileId || file.id || file.documentId;

          return (
            <motion.div key={fileId || idx}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-[18px] border border-black/[0.04] bg-[var(--color-surface)] hover:border-red-200/50 hover:bg-red-50/30 transition-all group">
              <div className="w-11 h-11 rounded-[14px] bg-red-50 flex items-center justify-center shrink-0">
                <i className="bi bi-file-earmark-x text-red-400 text-[18px]" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-[13.5px] text-[var(--color-on-surface)] truncate mb-0.5">{name}</h5>
                <div className="flex items-center gap-3 text-[11px] text-black/35 font-medium">
                  <span className="flex items-center gap-1"><i className="bi bi-calendar3" /> {deletedAt}</span>
                  <span className="flex items-center gap-1"><i className="bi bi-person" /> {typeof deletedBy === 'string' ? deletedBy.split('@')[0] : deletedBy}</span>
                </div>
              </div>
              <Button onClick={() => handleRestore(fileId, name)}
                className="!rounded-xl !font-medium !text-[12px] !h-9 !px-4 !border-[var(--color-primary)]/20 !text-[var(--color-primary)] hover:!bg-[var(--color-primary)]/10 opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="bi bi-arrow-counterclockwise mr-1" /> Khôi phục
              </Button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

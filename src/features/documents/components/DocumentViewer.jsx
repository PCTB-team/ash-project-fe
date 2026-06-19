import { Modal, Button, Tag, message } from 'antd';
import { motion } from 'framer-motion';
import FileIcon from './FileIcon.jsx';
import { getFileTagColor, getFileTypeLabel } from "../../dashboard/utils/helpers.js";
import { axiosClient } from '../../../utils/apiClient.js';

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

  const handleDownload = async () => {
    try {
      const response = await axiosClient.get(`https://ash-project-be.onrender.com/api/v1/documents/${doc.id}/download`, {
        responseType: 'blob'
      });
      if (response.status === 200) {
        const contentType = response.headers['content-type'] || '';
        
        if (contentType.includes('application/json')) {
          // Because we requested blob, we need to read the blob as text and parse JSON
          const text = await response.data.text();
          const data = JSON.parse(text);
          const url = data.result || data.storageUrl || data;
          if (typeof url === 'string' && url.startsWith('http')) {
            window.open(url, '_blank');
          } else if (typeof url === 'string') {
            window.open(`https://ash-project-be.onrender.com${url.startsWith('/') ? '' : '/'}${url}`, '_blank');
          }
        } else if (contentType.includes('text/plain')) {
          const textUrl = await response.data.text();
          if (textUrl.startsWith('http')) {
            window.open(textUrl, '_blank');
          } else {
            window.open(`https://ash-project-be.onrender.com${textUrl.startsWith('/') ? '' : '/'}${textUrl}`, '_blank');
          }
        } else {
          // Binary blob (PDF, image, docx, etc)
          const blob = response.data;
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = doc.name;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        }
      } else {
        // Fallback to storageUrl if API fails
        if (doc.storageUrl) {
           const fallbackUrl = doc.storageUrl.startsWith('http') ? doc.storageUrl : `https://ash-project-be.onrender.com${doc.storageUrl.startsWith('/') ? '' : '/'}${doc.storageUrl}`;
           window.open(fallbackUrl, '_blank');
        } else {
           console.error("Lỗi download:", response.status);
        }
      }
    } catch (e) {
      console.error(e);
      // Fallback
      if (doc.storageUrl) {
         const fallbackUrl = doc.storageUrl.startsWith('http') ? doc.storageUrl : `https://ash-project-be.onrender.com${doc.storageUrl.startsWith('/') ? '' : '/'}${doc.storageUrl}`;
         window.open(fallbackUrl, '_blank');
      }
    }
  };

  const handleView = async () => {
    if (doc.viewUrl) {
      window.open(doc.viewUrl.startsWith('http') ? doc.viewUrl : `https://ash-project-be.onrender.com${doc.viewUrl.startsWith('/') ? '' : '/'}${doc.viewUrl}`, '_blank');
      return;
    }

    try {
      const response = await axiosClient.get(`https://ash-project-be.onrender.com/api/v1/documents/${doc.id}/view`, {
        responseType: 'blob'
      });
      if (response.status === 200) {
         const contentType = response.headers['content-type'] || '';
         if (contentType.includes('application/json')) {
            const text = await response.data.text();
            const data = JSON.parse(text);
            const url = data.result || data.viewUrl || data;
            if (typeof url === 'string') {
               window.open(url.startsWith('http') ? url : `https://ash-project-be.onrender.com${url.startsWith('/') ? '' : '/'}${url}`, '_blank');
            }
         } else if (contentType.includes('text/plain')) {
            const textUrl = await response.data.text();
            window.open(textUrl.startsWith('http') ? textUrl : `https://ash-project-be.onrender.com${textUrl.startsWith('/') ? '' : '/'}${textUrl}`, '_blank');
         } else {
             // If binary file is returned directly for viewing
             const blob = response.data;
             const url = window.URL.createObjectURL(blob);
             window.open(url, '_blank');
         }
      } else {
         message.error("Lỗi khi mở tài liệu!");
      }
    } catch (e) {
      console.error(e);
      message.error("Lỗi kết nối khi mở tài liệu!");
    }
  };

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
          className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center backdrop-blur-md shadow-sm relative z-10"
        >
          <FileIcon type={doc.type} />
        </motion.div>

        <div className="text-left text-white z-10 flex-1 min-w-0">
          <h3 className="text-[16px] font-semibold truncate drop-shadow-sm">
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
          <span className="text-[10px] font-bold text-black/35 uppercase">Nội dung tài liệu</span>
        </div>

        {doc.content ? (
          <div className="bg-white rounded-2xl border border-black/[0.04] p-5 shadow-sm">
            <p className="text-[13px] text-black/70 leading-relaxed font-medium whitespace-pre-line">
              {doc.content}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-black/[0.04] p-8 shadow-sm text-center">
            <i className="bi bi-file-earmark-pdf text-[42px] text-black/15 block mb-3" />
            <p className="text-[13px] text-black/70 font-semibold mb-1">
              Bạn muốn xem hoặc tải bản gốc?
            </p>
            <p className="text-[11px] text-black/45 font-medium mb-5 px-4">
              Nhấn nút bên dưới để tải hoặc mở tệp này trong thẻ mới của trình duyệt.
            </p>
            <div className="flex justify-center gap-3">
              <Button
                type="primary"
                onClick={handleView}
                className="rounded-xl font-bold text-[12px] h-10 px-6 bg-blue-500 hover:bg-blue-600 border-none shadow-md"
              >
                <i className="bi bi-eye mr-1.5" /> Xem trực tuyến
              </Button>
              <Button
                type="default"
                onClick={handleDownload}
                className="rounded-xl font-bold text-[12px] h-10 px-6 border-blue-500 text-blue-500 hover:bg-blue-50"
              >
                <i className="bi bi-download mr-1.5" /> Tải xuống
              </Button>
            </div>
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
            className="rounded-xl font-semibold text-[12px] h-9 px-5 shadow-md"
          >
            <i className="bi bi-chat-dots mr-1.5" /> Hỏi AI về tài liệu
          </Button>
        </div>
      </div>
    </Modal>
  );
}


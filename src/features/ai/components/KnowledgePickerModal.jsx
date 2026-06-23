import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Modal, Input, Spin, Empty } from 'antd';
import { documentsApi } from '../../documents/api/documents.api';

const AI_READABLE_EXTENSIONS = ['pdf', 'docx', 'txt', 'ppt', 'pptx', 'xls', 'xlsx', 'csv', 'md'];

export default function KnowledgePickerModal({ open, type, onCancel, onSelect }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (open) {
      fetchItems();
    } else {
      setSearchQuery('');
      setItems([]);
    }
  }, [open, type]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      if (type === 'folder') {
        const data = await documentsApi.getFolders();
        if (data?.code === 0 || data?.code === 1000) {
          setItems(data.result || []);
        }
      } else if (type === 'document') {
        const params = new URLSearchParams();
        params.append('size', '100'); // Fetch enough items for selection
        const data = await documentsApi.getDocuments(params, 'all');
        if (data?.code === 0 || data?.code === 1000) {
          const allDocs = data.result?.content || [];
          // Filter out folders and only keep completed, un-deleted, AI-readable files
          const validDocs = allDocs.filter(doc => {
            if (doc.type === 'FOLDER') return false;
            if (doc.status !== 'COMPLETED') return false;
            if (doc.deleted) return false;
            
            const ext = doc.fileExtension?.replace('.', '').toLowerCase() || 
                        doc.fileName?.split('.').pop()?.toLowerCase();
            return AI_READABLE_EXTENSIONS.includes(ext);
          });
          setItems(validDocs);
        }
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const name = item.fileName || item.name || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getFileIcon = (ext) => {
    switch (ext) {
      case 'pdf': return 'bi-file-earmark-pdf text-red-500';
      case 'docx': case 'doc': return 'bi-file-earmark-word text-blue-500';
      case 'xlsx': case 'xls': case 'csv': return 'bi-file-earmark-excel text-green-500';
      case 'pptx': case 'ppt': return 'bi-file-earmark-ppt text-orange-500';
      case 'txt': case 'md': return 'bi-file-earmark-text text-gray-500';
      default: return 'bi-file-earmark text-[#ff5c00]';
    }
  };

  return (
    <Modal 
      open={open} 
      onCancel={onCancel} 
      footer={null} 
      width={480} 
      centered 
      destroyOnHidden
      closeIcon={<i className="bi bi-x-circle-fill text-[20px] text-black/20 hover:text-black/40 transition-colors" />}
      className="p-0 overflow-hidden"
    >
      <div className="p-6">
        <h3 className="text-[18px] font-bold text-[#1d1d1f] mb-1">
          {type === 'folder' ? 'Chọn Thư mục' : 'Chọn Tài liệu'}
        </h3>
        <p className="text-[13px] font-medium text-black/50 mb-5">
          {type === 'folder' 
            ? 'AI sẽ đọc tất cả tài liệu bên trong thư mục này.' 
            : 'AI sẽ chỉ đọc và trả lời dựa trên tài liệu này.'}
        </p>

        <Input 
          placeholder="Tìm kiếm..." 
          prefix={<i className="bi bi-search text-black/30 mr-1" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="!rounded-xl !bg-[#f5f5f5] !border-none !h-10 hover:!bg-[#f0f0f0] focus:!bg-white focus:!ring-2 focus:!ring-[#ff5c00]/20 mb-4"
        />

        <div className="h-[320px] overflow-y-auto custom-scrollbar pr-1 -mr-1 space-y-2">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center">
              <Spin />
              <p className="text-[12px] font-medium text-black/40 mt-3">Đang tải dữ liệu...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-60">
              <Empty description={<span className="text-[13px] font-medium">Không tìm thấy {type === 'folder' ? 'thư mục' : 'tài liệu hợp lệ'}</span>} />
            </div>
          ) : (
            filteredItems.map(item => {
              const isFolder = type === 'folder';
              const name = item.fileName || item.name;
              const ext = isFolder ? null : (item.fileExtension?.replace('.', '').toLowerCase() || name?.split('.').pop()?.toLowerCase());
              const date = new Date(item.uploadedAt || item.createdAt || Date.now()).toLocaleDateString('vi-VN');

              return (
                <div 
                  key={item.id || item.documentId || item.folderId}
                  onClick={() => onSelect(item)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#ff5c00]/5 border border-transparent hover:border-[#ff5c00]/10 cursor-pointer transition-all duration-200"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isFolder ? 'bg-purple-50' : 'bg-gray-50'}`}>
                    <i className={`bi text-[18px] ${isFolder ? 'bi-folder2 text-purple-500' : getFileIcon(ext)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-[#1d1d1f] truncate leading-tight mb-0.5">{name}</p>
                    <p className="text-[11px] text-black/40 font-medium leading-tight">
                      {isFolder ? 'Thư mục' : `${ext ? ext.toUpperCase() : 'Tệp'} • ${date}`}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
}

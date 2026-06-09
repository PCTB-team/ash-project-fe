import { useState } from 'react';
import { message, Tooltip, Modal } from 'antd';
import FileIcon from '../components/FileIcon.jsx';
import { formatRelativeTime } from '../utils/dateUtils.js';
import { fetchWithAuth } from '../../../utils/apiClient.js';

const DOCUMENTS_API_URL = 'http://localhost:8080/api/v1/documents';

export default function TrashScreen({
  trashDocuments,
  searchTerm,
  onRefreshDocuments,
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  // Lọc theo tìm kiếm
  const filteredDocs = trashDocuments.filter(doc => 
    !searchTerm || doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRestore = async (docId) => {
    try {
      setIsProcessing(true);
      const response = await fetchWithAuth(`${DOCUMENTS_API_URL}/${docId}/restore`, {
        method: 'PUT'
      });
      if (response.ok) {
        message.success('Đã khôi phục tài liệu thành công!');
        if (onRefreshDocuments) onRefreshDocuments();
      } else {
        message.error('Khôi phục thất bại!');
      }
    } catch (e) {
      console.error(e);
      message.error('Lỗi kết nối server!');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePermanentDelete = (doc) => {
    Modal.confirm({
      title: 'Xóa vĩnh viễn tài liệu?',
      content: `Bạn có chắc chắn muốn xóa vĩnh viễn "${doc.name}" không? Hành động này không thể hoàn tác.`,
      okText: 'Xóa vĩnh viễn',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setIsProcessing(true);
          const response = await fetchWithAuth(`${DOCUMENTS_API_URL}/${doc.id}/permanent`, {
            method: 'DELETE'
          });
          if (response.ok) {
            message.success('Đã xóa vĩnh viễn!');
            if (onRefreshDocuments) onRefreshDocuments();
          } else {
            message.error('Xóa thất bại!');
          }
        } catch (e) {
          console.error(e);
          message.error('Lỗi kết nối server!');
        } finally {
          setIsProcessing(false);
        }
      }
    });
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto px-4 md:px-8 pb-10 pt-5 text-left select-none relative max-w-[1400px] mx-auto">
      {/* Title + Action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div>
          <h1 className="text-[22px] font-semibold text-[#1d1d1f] tracking-tight text-red-500">Thùng rác</h1>
          <p className="text-[12px] text-black/55 font-medium mt-0.5">Quản lý các tài liệu đã bị xóa tạm thời</p>
        </div>
      </div>

      <div className="flex-1 bg-white border border-black/[0.04] rounded-2xl shadow-sm overflow-hidden relative flex flex-col" style={{ minHeight: '420px' }}>
        {filteredDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4 m-auto">
            <div className="w-16 h-16 rounded-2xl bg-black/[0.02] flex items-center justify-center mb-4">
              <i className="bi bi-trash3 text-[28px] text-black/12" />
            </div>
            <p className="text-[13px] font-medium text-black/30 mb-1">Thùng rác trống</p>
            <p className="text-[11px] font-semibold text-black/20">Không có tài liệu nào trong thùng rác</p>
          </div>
        ) : (
          <>
            <div className="hidden sm:flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-black/[0.03] text-[10px] font-medium text-black/30 uppercase tracking-wider select-none bg-black/[0.01]">
              <div className="w-10 flex-shrink-0" />
              <span className="flex-1 min-w-0">Tên tài liệu</span>
              <span className="w-[120px] text-center hidden md:block">Ngày xóa</span>
              <span className="w-[85px] text-right hidden md:block whitespace-nowrap">Dung lượng</span>
              <span className="w-[104px] text-right">Hành động</span>
            </div>

            <div className="divide-y divide-black/[0.025] overflow-y-auto">
              {filteredDocs.map((doc) => (
                <div key={doc.id} className="group flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 hover:bg-red-50/30 transition-all duration-200">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/[0.02] border border-black/[0.04] flex items-center justify-center flex-shrink-0">
                    <FileIcon type={doc.type} style={{ fontSize: 16 }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-[12.5px] sm:text-[13px] font-semibold text-black/60 line-through decoration-black/20 truncate">
                      {doc.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 sm:hidden">
                      <span className="text-[10px] text-black/35 font-medium">{doc.timeSinceUpload || formatRelativeTime(doc.uploadedAt)}</span>
                    </div>
                  </div>

                  <span className="w-[120px] text-center text-[11px] text-black/45 font-medium hidden md:block flex-shrink-0">
                    {doc.timeSinceUpload || formatRelativeTime(doc.uploadedAt)}
                  </span>

                  <span className="w-[85px] text-right text-[11px] text-black/45 font-semibold hidden md:block flex-shrink-0 whitespace-nowrap">
                    {doc.size}
                  </span>

                  <div className="w-auto sm:w-[104px] flex items-center justify-end gap-2 flex-shrink-0">
                    <Tooltip title="Khôi phục">
                      <button
                        disabled={isProcessing}
                        onClick={() => handleRestore(doc.id)}
                        className="w-7 h-7 rounded-lg bg-green-50 text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center transition-all cursor-pointer text-[12px] disabled:opacity-50"
                      >
                        <i className="bi bi-arrow-counterclockwise" />
                      </button>
                    </Tooltip>
                    
                    <Tooltip title="Xóa vĩnh viễn">
                      <button
                        disabled={isProcessing}
                        onClick={() => handlePermanentDelete(doc)}
                        className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all cursor-pointer text-[12px] disabled:opacity-50"
                      >
                        <i className="bi bi-trash3-fill" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Button, Modal, Form, Select, Upload, message } from 'antd';
import { motion } from 'framer-motion';
import DocumentViewer from '../components/DocumentViewer.jsx';
import DocumentManager from '../components/DocumentManager.jsx';
import { detectFileType } from '../utils/helpers.js';
import { UPLOAD_TYPE_OPTIONS } from '../utils/fileConfig.js';
import { fetchWithAuth } from '../../../utils/apiClient.js';


import { useNavigate, useOutletContext } from 'react-router-dom';

const UPLOAD_DOCUMENT_API_URL = 'https://ash-project-be.onrender.com/api/v1/documents/uploads';
const DOCUMENTS_API_URL = 'https://ash-project-be.onrender.com/api/v1/documents';

const { Dragger } = Upload;

export default function DashboardScreen() {
  const navigate = useNavigate();
  const { 
    searchTerm, 
    refreshKey: refreshTrigger, 
    setDocumentsCount: onUpdateDocumentsCount, 
    refreshAll: onRefreshDocuments 
  } = useOutletContext();
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [folderPath, setFolderPath] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [form] = Form.useForm();



  const handleUploadSubmit = async (values) => {
    if (!selectedFile) {
      message.error("Vui lòng chọn tài liệu để tải lên!");
      return;
    }

    let finalName = values.name;
    if (!finalName.includes('.')) finalName += `.${values.type}`;

    const executeUpload = async (replaceExisting = false) => {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('name', finalName);
      formData.append('type', values.type);
      formData.append('content', values.content || '');

      const params = new URLSearchParams();
      const currentFolder = folderPath.length > 0 ? folderPath[folderPath.length - 1] : null;
      if (currentFolder) {
        params.append('folderId', currentFolder.id);
      }
      if (replaceExisting) {
        params.append('replaceExisting', 'true');
      }

      try {
        const uploadUrl = `${UPLOAD_DOCUMENT_API_URL}${params.toString() ? '?' + params.toString() : ''}`;
        
        const response = await fetchWithAuth(uploadUrl, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          let data = {};
          try { data = await response.json(); } catch { /* ignore */ }

          if ((data.code === 0 || data.code === 1000) && data.result) {
            // Success
          } else {
            message.error("Tải lên thành công nhưng lỗi phân tích dữ liệu trả về!");
          }

          if (onRefreshDocuments) onRefreshDocuments();
          form.resetFields();
          setSelectedFile(null);
          setShowUploadModal(false);
          const uploadedName = (data.result && data.result.fileName) || finalName;
          message.success(`Đã tải lên "${uploadedName}" thành công!`);
        } else {
          const errorData = await response.json();
          const errMsg = errorData.message || "";
          
          if (errMsg.toLowerCase().includes('tồn tại') || errMsg.toLowerCase().includes('exist')) {
            Modal.confirm({
              title: 'Tài liệu đã tồn tại',
              content: 'Một tài liệu với tên này đã tồn tại trong thư mục. Bạn có muốn ghi đè lên tài liệu cũ không?',
              okText: 'Ghi đè',
              cancelText: 'Hủy',
              centered: true,
              onOk: () => {
                executeUpload(true);
              }
            });
          } else {
            message.error(errMsg || "Tải lên thất bại từ server!");
          }
        }
      } catch (error) {
        console.error("Upload error:", error);
        message.error("Lỗi kết nối máy chủ khi tải lên!");
      }
    };

    executeUpload(false);
  };

  const handleRenameDocument = async (docId, newName) => {
    try {
      const response = await fetchWithAuth(`${DOCUMENTS_API_URL}/${docId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileName: newName })
      });
      if (response.ok) {
        message.success('Đổi tên thành công!');
        if (onRenameDocument) onRenameDocument(docId, newName);
        if (onRefreshDocuments) onRefreshDocuments();
      } else {
        // Không được phép đổi tên cục bộ ở đây
        message.error('Đổi tên thất bại từ server!');
      }
    } catch (e) {
      console.error(e);
      message.error('Lỗi kết nối server, không thể đổi tên!');
    }
  };

  const handleRemoveDocument = async (docId) => {
    try {
      const response = await fetchWithAuth(`${DOCUMENTS_API_URL}/${docId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        message.success('Đã chuyển tài liệu vào Thùng rác.');
        if (onRemoveDocument) onRemoveDocument(docId);
        if (onRefreshDocuments) onRefreshDocuments();
      } else {
        // Không được phép xóa cục bộ ở đây
        message.error('Xóa thất bại từ server!');
      }
    } catch (e) {
      console.error(e);
      message.error('Lỗi kết nối server, không thể xóa!');
    }
  };

  const handleAskAIOnDoc = () => {
    // TODO: Khi có trang AI, truyền doc vào context/state trước khi navigate
    navigate('/dashboard/ai');
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto px-4 md:px-8 pb-10 pt-5 text-left select-none relative max-w-[1400px] mx-auto">
      <div>

        {/* Title + Action bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div>
            <h1 className="text-[22px] font-semibold text-[#1d1d1f] tracking-tight">Thư viện của tôi</h1>
            <p className="text-[12px] text-black/55 font-medium mt-0.5">Quản lý và số hóa học phần học thuật cùng Trợ lý AI</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={() => setShowUploadModal(true)}
              className="group bg-gradient-to-b from-[#ff7a00] to-[#ff5c00] text-white rounded-full font-medium text-[12px] sm:text-[13px] px-5 h-10 flex items-center gap-1.5 shadow-[0_1px_3px_rgba(255,92,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] cursor-pointer hover:brightness-110 hover:shadow-[0_8px_24px_rgba(255,92,0,0.4)] transition-all duration-300"
            >
              <i className="bi bi-cloud-arrow-up text-[14px]" /> Tải lên tài liệu
            </button>
          </div>
        </div>

        {/* ═══ Document Manager Container ═══ */}
        <div className="flex-1 bg-white border border-black/[0.04] rounded-2xl shadow-sm overflow-hidden relative flex flex-col" style={{ minHeight: '420px' }}>
          <DocumentManager
            searchTerm={searchTerm}
            folderPath={folderPath}
            onFolderChange={(folder) => {
              if (folder === null) {
                setFolderPath([]);
              } else {
                setFolderPath(prev => [...prev, folder]);
              }
            }}
            onBreadcrumbClick={(index) => {
              setFolderPath(prev => prev.slice(0, index + 1));
            }}
            onPreviewDoc={(doc) => setPreviewDoc(doc)}
            onAskAI={(doc) => handleAskAIOnDoc(doc)}
            onRemoveDocument={handleRemoveDocument}
            onRenameDocument={handleRenameDocument}
            onRefreshDocuments={onRefreshDocuments}
            onUpdateDocumentsCount={onUpdateDocumentsCount}
            refreshTrigger={refreshTrigger}
          />
        </div>


      </div>

      {/* Document Viewer Modal */}
      <DocumentViewer
        document={previewDoc}
        open={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        onAskAI={handleAskAIOnDoc}
        onDelete={handleRemoveDocument}
      />

      {/* Upload Modal (Premium Glassmorphism) */}
      <Modal
        title={null}
        open={showUploadModal}
        onCancel={() => setShowUploadModal(false)}
        footer={null}
        width={720}
        styles={{ body: { padding: 0 } }}
        destroyOnHidden
        centered
        className="!p-0 overflow-hidden"
      >
        <div className="bg-gradient-to-br from-[#ff8a00] to-[#ff5c00] px-6 py-5 flex items-center gap-4 relative overflow-hidden rounded-t-2xl shadow-inner">
          {/* Decorative Background Elements */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-overlay" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white backdrop-blur-md shadow-xl relative z-10"
          >
            <i className="bi bi-cloud-arrow-up-fill text-[24px]" />
          </motion.div>
          <div className="text-left text-white z-10">
            <h3 className="text-[18px] font-semibold tracking-tight drop-shadow-md leading-tight">Tải tài liệu lên</h3>
            <p className="text-[10.5px] font-medium text-white/90 uppercase tracking-widest mt-0.5">Đồng bộ & phân tích bằng AI</p>
          </div>
        </div>

        <div className="p-6 bg-[#fcfcfd] rounded-b-2xl relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">

            {/* Dragger Column */}
            <div className="md:col-span-5 h-full">
              <Dragger
                beforeUpload={(file) => {
                  setSelectedFile(file);
                  form.setFieldsValue({
                    name: file.name,
                    type: detectFileType(file.name),
                    size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                  });
                  return false;
                }}
                showUploadList={false}
                className="!rounded-2xl !border-2 !border-dashed !border-[#ff5c00]/20 hover:!border-[#ff5c00] !bg-gradient-to-b !from-[#ff5c00]/[0.03] !to-transparent hover:!from-[#ff5c00]/10 transition-all duration-500 group overflow-hidden relative shadow-sm h-full flex flex-col justify-center py-6"
                style={{ height: '100%' }}
              >
                <div className="relative z-10 flex flex-col items-center justify-center px-2">
                  <div className="w-14 h-14 bg-white shadow-md shadow-[#ff5c00]/10 rounded-full flex items-center justify-center mb-3 group-hover:-translate-y-1 transition-transform duration-500 border border-black/5">
                    <i className="bi bi-cloud-upload text-[#ff5c00] text-[26px] group-hover:scale-110 group-hover:text-[#ff8a00] transition-all duration-500" />
                  </div>
                  <h4 className="text-[14px] font-semibold text-black mb-1 leading-tight px-1">Kéo thả tài liệu học tập</h4>
                  <p className="text-[11.5px] text-black/55 font-medium mb-4 leading-tight">
                    hoặc <span className="text-[#ff5c00] underline decoration-[#ff5c00]/30 underline-offset-4 hover:decoration-[#ff5c00] transition-colors">chọn từ máy tính</span>
                  </p>

                  <div className="flex gap-1.5 flex-wrap justify-center px-2">
                    {['PDF', 'DOCX', 'XLSX'].map(ext => (
                      <span key={ext} className="text-[9px] font-semibold text-black/55 bg-white border border-black/5 shadow-sm rounded-md px-1.5 py-0.5 tracking-wide">{ext}</span>
                    ))}
                  </div>
                </div>
              </Dragger>
            </div>

            {/* Form Column */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <Form form={form} layout="vertical" onFinish={handleUploadSubmit} initialValues={{ type: 'pdf', size: '1.5 MB' }} className="h-full flex flex-col">
                <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm space-y-1 flex-1">
                  <Form.Item
                    label={<span className="text-[10.5px] font-medium text-black/55 uppercase tracking-widest flex items-center gap-1.5"><i className="bi bi-file-earmark-text text-[#ff5c00]" /> Tên tài liệu</span>}
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng điền tên tệp!' }]}
                    className="mb-3.5"
                  >
                    <input
                      type="text"
                      placeholder="Ví dụ: Giao_Trinh.pdf"
                      className="w-full bg-black/[0.02] border-2 border-transparent hover:border-black/5 rounded-xl px-4 py-2 text-black text-[12.5px] font-semibold outline-none focus:border-[#ff5c00] focus:bg-white focus:ring-4 focus:ring-[#ff5c00]/10 transition-all"
                    />
                  </Form.Item>

                  <div className="grid grid-cols-2 gap-4 mb-3.5">
                    <Form.Item label={<span className="text-[10.5px] font-medium text-black/55 uppercase tracking-widest flex items-center gap-1.5"><i className="bi bi-tags text-[#ff5c00]" /> Định dạng</span>} name="type" className="mb-0">
                      <Select className="font-semibold text-[12.5px] h-[34px]" classNames={{ popup: "rounded-xl font-semibold" }} options={UPLOAD_TYPE_OPTIONS} />
                    </Form.Item>

                    <Form.Item label={<span className="text-[10.5px] font-medium text-black/55 uppercase tracking-widest flex items-center gap-1.5"><i className="bi bi-hdd text-[#ff5c00]" /> Dung lượng</span>} name="size" className="mb-0">
                      <input
                        type="text"
                        readOnly
                        className="w-full bg-black/[0.02] border-2 border-transparent rounded-xl px-3 py-[5px] text-black/60 text-[12.5px] font-medium outline-none cursor-not-allowed h-[34px]"
                      />
                    </Form.Item>
                  </div>

                  <Form.Item label={<span className="text-[10.5px] font-medium text-black/55 uppercase tracking-widest flex items-center gap-1.5"><i className="bi bi-body-text text-[#ff5c00]" /> Nội dung tóm tắt</span>} name="content" className="mb-0">
                    <textarea
                      rows={2}
                      placeholder="Ghi chú nhanh để AI có thêm ngữ cảnh phân tích..."
                      className="w-full bg-black/[0.02] border-2 border-transparent hover:border-black/5 rounded-xl px-3.5 py-2 text-black text-[12.5px] font-semibold outline-none focus:border-[#ff5c00] focus:bg-white focus:ring-4 focus:ring-[#ff5c00]/10 transition-all resize-none"
                    />
                  </Form.Item>
                </div>

                <div className="flex gap-2.5 justify-end mt-4">
                  <Button
                    onClick={() => setShowUploadModal(false)}
                    className="!rounded-full !font-medium !text-[13px] !h-10 !px-6 !border !border-black/10 hover:!border-black/20 !bg-black/[0.02] hover:!bg-black/[0.06] !text-black/60 hover:!text-black transition-all duration-300"
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="!rounded-full !font-medium !text-[13px] !h-10 !px-8 !bg-gradient-to-b !from-[#ff7a00] !to-[#ff5c00] !border-none !text-white !shadow-[0_1px_3px_rgba(255,92,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] hover:!brightness-110 hover:!shadow-[0_8px_24px_rgba(255,92,0,0.4)] transition-all duration-300 group"
                  >
                    <i className="bi bi-cloud-arrow-up-fill mr-1" /> Xác nhận Tải lên
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}


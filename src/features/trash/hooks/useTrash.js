import { useState, useCallback } from 'react';
import { trashApi } from '../api/trash.api.js';

export const useTrash = () => {
  const [trashDocuments, setTrashDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTrashDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await trashApi.getTrash();
      if ((data.code === 0 || data.code === 1000) && data.result) {
        const mappedDocs = data.result.map(d => ({
          id: d.documentId,
          name: d.fileName || 'Untitled',
          type: d.fileExtension?.replace('.', '') || 'unknown',
          fileSizeBytes: d.fileSize || 0,
          size: d.fileSize ? `${(d.fileSize / (1024 * 1024)).toFixed(2)} MB` : '0 MB',
          uploadedAt: d.deletedAt || new Date().toISOString(),
          timeSinceUpload: d.timeSinceUpload,
          status: d.status,
          storageUrl: d.storageUrl
        }));
        setTrashDocuments(mappedDocs);
        return mappedDocs;
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách thùng rác:", error);
    } finally {
      setIsLoading(false);
    }
    return [];
  }, []);

  const restoreDocument = async (docId) => {
    try {
      const data = await trashApi.restoreDocument(docId);
      if (data.code === 0 || data.code === 1000) {
        setTrashDocuments(prev => prev.filter(doc => doc.id !== docId));
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error("Lỗi khôi phục:", error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const deleteDocumentPermanent = async (docId) => {
    try {
      const data = await trashApi.deleteDocumentPermanent(docId);
      if (data.code === 0 || data.code === 1000) {
        setTrashDocuments(prev => prev.filter(doc => doc.id !== docId));
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error("Lỗi xóa vĩnh viễn:", error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  return {
    trashDocuments,
    isLoading,
    fetchTrashDocuments,
    restoreDocument,
    deleteDocumentPermanent
  };
};

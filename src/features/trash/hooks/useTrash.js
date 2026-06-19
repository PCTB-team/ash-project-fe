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
        const items = data.result.items || data.result;
        const mappedDocs = (Array.isArray(items) ? items : []).map(d => {
          const isFolder = d.type === 'FOLDER' || d.type === 'folder' || (!d.fileExtension && (d.folderId || !d.documentId));
          return {
            id: d.documentId || d.folderId || d.id,
            name: d.name || d.fileName || 'Untitled',
            type: isFolder ? 'folder' : (d.fileExtension?.replace('.', '') || d.type?.toLowerCase() || 'unknown'),
            fileSizeBytes: d.size || d.fileSize || 0,
            size: (d.size || d.fileSize) ? `${((d.size || d.fileSize) / (1024 * 1024)).toFixed(2)} MB` : '0 MB',
            uploadedAt: d.deletedAt || new Date().toISOString(),
            timeSinceUpload: d.timeSinceUpload || d.timeSinceDeleted,
            status: d.status,
            storageUrl: d.storageUrl
          };
        });
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

  const restoreDocument = async (doc) => {
    try {
      const isFolder = doc.type === 'folder';
      const data = await trashApi.restoreDocument(doc.id, isFolder);
      if (data.code === 0 || data.code === 1000) {
        setTrashDocuments(prev => prev.filter(d => d.id !== doc.id));
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error("Lỗi khôi phục:", error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const deleteDocumentPermanent = async (doc) => {
    try {
      const isFolder = doc.type === 'folder';
      const data = await trashApi.deleteDocumentPermanent(doc.id, isFolder);
      if (data.code === 0 || data.code === 1000) {
        setTrashDocuments(prev => prev.filter(d => d.id !== doc.id));
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

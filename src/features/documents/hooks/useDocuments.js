import { useState, useCallback } from 'react';
import { message } from 'antd';
import { documentsApi } from '../api/documents.api.js';
import { formatBytes } from '../../dashboard/utils/helpers.js';

export const useDocuments = () => {
  const [folders, setFolders] = useState([]);
  const [paginatedDocs, setPaginatedDocs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFolders = useCallback(async (currentFolderId) => {
    try {
      const data = await documentsApi.getFolders(currentFolderId);
      if ((data.code === 0 || data.code === 1000) && data.result) {
        const mappedFolders = data.result.map(f => ({
          id: f.folderId,
          name: f.name,
          type: 'folder',
          parentId: f.parentFolderId,
          size: formatBytes(f.size || 0),
          uploadedAt: f.createdAt || new Date().toISOString()
        }));
        setFolders(mappedFolders);
      }
    } catch (e) {
      console.error("Lỗi lấy danh sách thư mục:", e);
    }
  }, []);

  const createFolder = async (name, parentId) => {
    try {
      const data = await documentsApi.createFolder(name, parentId);
      if (data.code === 0 || data.code === 1000) {
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Tạo thư mục thất bại!' };
      }
    } catch (e) {
      console.error(e);
      let errorMsg = 'Lỗi kết nối khi tạo thư mục!';
      if (e.response?.data?.message) {
        errorMsg = e.response.data.message;
      }
      return { success: false, message: errorMsg };
    }
  };

  const fetchDocuments = useCallback(async (activeTab, currentPage, PAGE_SIZE, debouncedSearchTerm, currentFolderId, sortExt, onUpdateDocumentsCount) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage - 1,
        size: PAGE_SIZE,
      });
      if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
      if (currentFolderId) params.append('folderId', currentFolderId);
      if (sortExt) params.append('sortBy', sortExt);

      const data = await documentsApi.getDocuments(params, activeTab);

      if ((data.code === 0 || data.code === 1000) && data.result) {
        const content = data.result.content || data.result.documents || data.result || [];
        const totalElems = data.result.totalElements || data.result.total || content.length || 0;
        const tPages = data.result.totalPages || 1;

        const mappedDocs = content.map(d => {
          const isFolder = d.type === 'FOLDER' || d.type === 'folder';
          return {
            id: d.documentId || d.id || d.folderId,
            name: d.fileName || d.title || d.name || 'Untitled',
            type: isFolder ? 'folder' : (d.fileExtension?.replace('.', '') || d.type?.toLowerCase() || 'unknown'),
            fileSizeBytes: d.fileSize || d.size || 0,
            size: formatBytes(d.fileSize || d.size || 0),
            uploadedAt: d.createdAt || new Date().toISOString(),
            timeSinceUpload: d.timeSinceUpload || d.timeSinceCreated,
            status: d.status,
            storageUrl: d.storageUrl,
            viewUrl: d.viewUrl,
            downloadUrl: d.downloadUrl,
            parentId: d.folderId || d.parentFolderId
          };
        });
        setPaginatedDocs(mappedDocs);
        setTotalPages(tPages);
        setTotalElements(totalElems);
        if (onUpdateDocumentsCount) onUpdateDocumentsCount(totalElems);
      }
    } catch (e) {
      console.error("Lỗi lấy danh sách tài liệu:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const downloadDocument = async (doc) => {
    try {
      const response = await documentsApi.downloadDocument(doc.id);
      const contentType = response.headers['content-type'] || '';

      if (contentType.includes('application/json')) {
        const text = await response.data.text();
        const data = JSON.parse(text);
        const url = data.result || data.storageUrl || data;
        if (typeof url === 'string' && url.startsWith('http')) {
          window.open(url, '_blank');
        } else if (typeof url === 'string') {
          window.open(`https://ash-project-be.onrender.com${url.startsWith('/') ? '' : '/'}${url}`, '_blank');
        }
      } else {
        const blob = new Blob([response.data], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
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

  return {
    folders,
    paginatedDocs,
    totalPages,
    totalElements,
    isLoading,
    fetchFolders,
    createFolder,
    fetchDocuments,
    downloadDocument
  };
};

import { axiosClient } from '../../../utils/apiClient.js';

const DOCUMENTS_ITEMS_API = 'https://ash-project-be.onrender.com/api/v1/documents/items';
const DOCUMENTS_PAGE_API = 'https://ash-project-be.onrender.com/api/v1/documents/page';
const DOCUMENTS_FILTER_API = 'https://ash-project-be.onrender.com/api/v1/documents/filter';
const FOLDERS_API = 'https://ash-project-be.onrender.com/api/v1/folders';

export const documentsApi = {
  getFolders: async (currentFolderId) => {
    const params = new URLSearchParams();
    if (currentFolderId) {
      params.append('parentId', currentFolderId);
      params.append('parentFolderId', currentFolderId);
    }
    const response = await axiosClient.get(`${FOLDERS_API}${currentFolderId ? '?' + params.toString() : ''}`);
    return response.data;
  },

  createFolder: async (name, parentId) => {
    const response = await axiosClient.post(FOLDERS_API, {
      name: name,
      parentFolderId: parentId
    });
    return response.data;
  },

  getDocuments: async (params, activeTab) => {
    let url;
    if (activeTab === 'all') {
      url = `${DOCUMENTS_ITEMS_API}?${params.toString()}`;
    } else if (activeTab === 'document') {
      url = `${DOCUMENTS_FILTER_API}/documents?${params.toString()}`;
    } else {
      params.append('fileType', activeTab.toUpperCase());
      url = `${DOCUMENTS_FILTER_API}?${params.toString()}`;
    }
    const response = await axiosClient.get(url);
    return response.data;
  },

  downloadDocument: async (docId) => {
    const response = await axiosClient.get(`/api/v1/documents/${docId}/download`, {
      responseType: 'blob'
    });
    return response;
  }
};

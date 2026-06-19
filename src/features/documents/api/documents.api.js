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
    if (activeTab === 'folder') {
      const folderParams = new URLSearchParams();
      if (params.get('folderId')) {
        folderParams.append('parentId', params.get('folderId'));
        folderParams.append('parentFolderId', params.get('folderId'));
      }
      const response = await axiosClient.get(`${FOLDERS_API}${folderParams.toString() ? '?' + folderParams.toString() : ''}`);
      return {
        code: response.data?.code || 0,
        result: {
          content: (response.data?.result || []).map(f => ({ ...f, type: 'FOLDER' })),
          totalElements: (response.data?.result || []).length,
          totalPages: 1
        }
      };
    }

    let url;
    if (activeTab === 'all') {
      url = `${DOCUMENTS_ITEMS_API}?${params.toString()}`;
    } else if (activeTab === 'document') {
      url = `${DOCUMENTS_FILTER_API}/documents?${params.toString()}`;
    } else if (activeTab === 'other') {
      // The backend does not support fileType=OTHER. Fall back to getting all items.
      url = `${DOCUMENTS_ITEMS_API}?${params.toString()}`;
    } else {
      params.append('fileType', activeTab.toUpperCase());
      url = `${DOCUMENTS_FILTER_API}?${params.toString()}`;
    }
    const response = await axiosClient.get(url);
    
    // Client-side filtering for 'other' tab to approximate behavior
    if (activeTab === 'other' && response.data?.result?.content) {
      const excludedTypes = ['DOCUMENT', 'AUDIO', 'VIDEO', 'IMAGE', 'FOLDER'];
      const filteredContent = response.data.result.content.filter(
        item => !excludedTypes.includes(item.type?.toUpperCase())
      );
      response.data.result.content = filteredContent;
      response.data.result.totalElements = filteredContent.length;
      response.data.result.totalPages = 1;
    }
    
    return response.data;
  },

  downloadDocument: async (docId) => {
    const response = await axiosClient.get(`/api/v1/documents/${docId}/download`, {
      responseType: 'blob'
    });
    return response;
  }
};

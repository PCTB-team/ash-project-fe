import { axiosClient } from '../../../utils/apiClient.js';

const TRASH_API_URL = 'https://ash-project-be.onrender.com/api/v1/trash';
const RESTORE_DOCUMENT_API_URL = 'https://ash-project-be.onrender.com/api/v1/documents/{id}/restore';
const DELETE_DOCUMENT_API_URL = 'https://ash-project-be.onrender.com/api/v1/documents/{id}/permanent';

const RESTORE_FOLDER_API_URL = 'https://ash-project-be.onrender.com/api/v1/folders/{id}/restore';
const DELETE_FOLDER_API_URL = 'https://ash-project-be.onrender.com/api/v1/folders/{id}/permanent';

export const trashApi = {
  getTrash: async () => {
    try {
      const response = await axiosClient.get(TRASH_API_URL);
      return response.data;
    } catch (e) {
      console.error('Error fetching trash:', e);
      return { code: -1, result: { items: [], total: 0 } };
    }
  },
  
  restoreDocument: async (id, isFolder) => {
    const url = isFolder ? RESTORE_FOLDER_API_URL : RESTORE_DOCUMENT_API_URL;
    const response = await axiosClient.put(url.replace('{id}', id));
    return response.data;
  },
  
  deleteDocumentPermanent: async (id, isFolder) => {
    const url = isFolder ? DELETE_FOLDER_API_URL : DELETE_DOCUMENT_API_URL;
    const response = await axiosClient.delete(url.replace('{id}', id));
    return response.data;
  }
};

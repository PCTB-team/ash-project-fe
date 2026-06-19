import { axiosClient } from '../../../utils/apiClient.js';

const TRASH_API_URL = 'https://ash-project-be.onrender.com/api/v1/documents/trash';
const RESTORE_DOCUMENT_API_URL = 'https://ash-project-be.onrender.com/api/v1/documents/{documentId}/restore';
const DELETE_DOCUMENT_API_URL = 'https://ash-project-be.onrender.com/api/v1/documents/{documentId}/permanent';

export const trashApi = {
  getTrash: async () => {
    const response = await axiosClient.get(TRASH_API_URL);
    return response.data;
  },
  
  restoreDocument: async (docId) => {
    const response = await axiosClient.put(RESTORE_DOCUMENT_API_URL.replace('{documentId}', docId));
    return response.data;
  },
  
  deleteDocumentPermanent: async (docId) => {
    const response = await axiosClient.delete(DELETE_DOCUMENT_API_URL.replace('{documentId}', docId));
    return response.data;
  }
};

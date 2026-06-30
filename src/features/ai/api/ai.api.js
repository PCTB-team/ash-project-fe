import { axiosClient } from '../../../utils/apiClient.js';

const AI_API_URL = 'https://ash-project-be.onrender.com/api/v1/ai';
const CONVERSATIONS_API_URL = 'https://ash-project-be.onrender.com/api/v1/ai/conversations';

export const aiApi = {
  /**
   * Trò chuyện với AI dựa trên tài liệu đã lưu (tự động lưu lịch sử)
   * @param {Object} payload - { message, documentId?, folderId? }
   */
  chatWithKnowledge: async (payload) => {
    const response = await axiosClient.post(`${AI_API_URL}/knowledge/chat`, payload);
    return response.data;
  },

  /**
   * Lấy lịch sử chat AI (từng cặp Q&A)
   * @param {number} page 
   * @param {number} size 
   */
  getChatHistory: async (page = 0, size = 30) => {
    const response = await axiosClient.get(`${AI_API_URL}/knowledge/history`, {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Tóm tắt tài liệu bằng AI
   */
  summarizeDocument: async (documentId) => {
    const response = await axiosClient.post(`${AI_API_URL}/summarize`, { documentId });
    return response.data;
  },

  // ==========================================
  // CÁC API DƯỚI ĐÂY ĐÃ BỊ LOẠI BỎ Ở BACKEND
  // ==========================================

  /*
  sendMessage: async (payload) => {
    const response = await axiosClient.post(`${AI_API_URL}/chat`, payload);
    return response.data;
  },
  getConversations: async () => {
    const response = await axiosClient.get(CONVERSATIONS_API_URL);
    return response.data;
  },
  getConversationMessages: async (conversationId) => {
    const response = await axiosClient.get(`${CONVERSATIONS_API_URL}/${conversationId}/messages`);
    return response.data;
  },
  createConversation: async (title) => {
    const response = await axiosClient.post(CONVERSATIONS_API_URL, { title });
    return response.data;
  },
  deleteConversation: async (conversationId) => {
    const response = await axiosClient.delete(`${CONVERSATIONS_API_URL}/${conversationId}`);
    return response.data;
  },
  */
};

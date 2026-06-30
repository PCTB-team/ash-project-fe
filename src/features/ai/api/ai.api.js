import { axiosClient } from '../../../utils/apiClient.js';

const AI_API_URL = 'https://ash-project-be.onrender.com/api/v1/ai';

export const aiApi = {
  /**
   * Lấy danh sách các cuộc hội thoại AI
   * @param {number} page
   * @param {number} size
   */
  getAiKnowledgeConversations: async (page = 0, size = 30) => {
    const response = await axiosClient.get(`${AI_API_URL}/knowledge/conversations`, {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Lấy danh sách tin nhắn của một cuộc hội thoại cụ thể
   * @param {string} conversationId 
   */
  getAiKnowledgeConversationMessages: async (conversationId) => {
    const response = await axiosClient.get(`${AI_API_URL}/knowledge/conversations/${conversationId}/messages`);
    return response.data;
  },

  /**
   * Trò chuyện với AI (tiếp tục hoặc tạo mới cuộc hội thoại)
   * @param {Object} payload - { conversationId?, documentId?, folderId?, message }
   */
  chatWithKnowledge: async (payload) => {
    const response = await axiosClient.post(`${AI_API_URL}/knowledge/chat`, payload);
    return response.data;
  },

  /**
   * Tóm tắt tài liệu bằng AI
   */
  summarizeDocument: async (documentId) => {
    const response = await axiosClient.post(`${AI_API_URL}/summarize`, { documentId });
    return response.data;
  }
};


import { axiosClient } from '../../../utils/apiClient.js';

const AI_API_URL = 'https://ash-project-be.onrender.com/api/v1/ai';
const CONVERSATIONS_API_URL = 'https://ash-project-be.onrender.com/api/v1/ai/conversations';

export const aiApi = {
  /**
   * Gửi tin nhắn tới AI Chatbot
   * @param {Object} payload - { message, conversationId?, documentId?, folderId?, scope? }
   * scope: 'all' | 'document' | 'folder'
   */
  sendMessage: async (payload) => {
    const response = await axiosClient.post(`${AI_API_URL}/chat`, payload);
    return response.data;
  },

  /**
   * Trò chuyện với AI dựa trên tài liệu đã lưu
   * @param {Object} payload - { message, documentId?, folderId? }
   */
  chatWithKnowledge: async (payload) => {
    const response = await axiosClient.post(`${AI_API_URL}/knowledge/chat`, payload);
    return response.data;
  },

  /**
   * Lấy danh sách các cuộc trò chuyện (chat history)
   */
  getConversations: async () => {
    const response = await axiosClient.get(CONVERSATIONS_API_URL);
    return response.data;
  },

  /**
   * Lấy lịch sử tin nhắn của một cuộc trò chuyện
   */
  getConversationMessages: async (conversationId) => {
    const response = await axiosClient.get(`${CONVERSATIONS_API_URL}/${conversationId}/messages`);
    return response.data;
  },

  /**
   * Tạo cuộc trò chuyện mới
   */
  createConversation: async (title) => {
    const response = await axiosClient.post(CONVERSATIONS_API_URL, { title });
    return response.data;
  },

  /**
   * Xóa cuộc trò chuyện
   */
  deleteConversation: async (conversationId) => {
    const response = await axiosClient.delete(`${CONVERSATIONS_API_URL}/${conversationId}`);
    return response.data;
  },

  /**
   * Tóm tắt tài liệu bằng AI
   */
  summarizeDocument: async (documentId) => {
    const response = await axiosClient.post(`${AI_API_URL}/summarize`, { documentId });
    return response.data;
  },
};

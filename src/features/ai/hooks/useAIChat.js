import { useState, useCallback, useRef } from 'react';
import { aiApi } from '../api/ai.api.js';

/**
 * Hook quản lý state & logic cho AI Chatbot
 */
export const useAIChat = () => {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Context cho document/folder scope
  const [chatContext, setChatContext] = useState({
    scope: 'all', // 'all' | 'document' | 'folder'
    documentId: null,
    folderId: null,
    contextName: null, // tên doc/folder đang hỏi
  });

  /**
   * Lấy danh sách cuộc hội thoại
   */
  const fetchConversations = useCallback(async () => {
    try {
      const data = await aiApi.getConversations();
      if (data?.code === 0 || data?.code === 1000) {
        setConversations(data.result || []);
      }
    } catch (err) {
      console.error('Lỗi lấy danh sách hội thoại:', err);
    }
  }, []);

  /**
   * Tải tin nhắn của cuộc hội thoại
   */
  const loadConversation = useCallback(async (conversationId) => {
    setIsLoading(true);
    setActiveConversationId(conversationId);
    try {
      const data = await aiApi.getConversationMessages(conversationId);
      if (data?.code === 0 || data?.code === 1000) {
        setMessages(data.result || []);
      }
    } catch (err) {
      console.error('Lỗi tải cuộc trò chuyện:', err);
      setError('Không thể tải lịch sử trò chuyện');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Tạo cuộc hội thoại mới
   */
  const createNewConversation = useCallback(() => {
    setActiveConversationId(null);
    setMessages([]);
    setChatContext({ scope: 'all', documentId: null, folderId: null, contextName: null });
    setError(null);
  }, []);

  /**
   * Gửi tin nhắn
   */
  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isSending) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsSending(true);
    setError(null);

    // Placeholder cho AI response
    const aiPlaceholderId = `ai-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: aiPlaceholderId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isLoading: true,
    }]);

    try {
      const payload = {
        message: text.trim(),
        conversationId: activeConversationId, // Giữ lại nếu BE hỗ trợ
      };
      
      if (chatContext.scope === 'document' && chatContext.documentId) {
        payload.documentId = chatContext.documentId;
      } else if (chatContext.scope === 'folder' && chatContext.folderId) {
        payload.folderId = chatContext.folderId;
      }

      const data = await aiApi.chatWithKnowledge(payload);

      if (data?.code === 0 || data?.code === 1000) {
        const aiContent = data.result?.answer || data.result?.content || data.result?.message || data.result || 'Xin lỗi, tôi không thể tạo câu trả lời.';
        const newConvId = data.result?.conversationId || activeConversationId;

        if (newConvId && !activeConversationId) {
          setActiveConversationId(newConvId);
        }

        setMessages(prev => prev.map(m =>
          m.id === aiPlaceholderId
            ? { 
                ...m, 
                content: typeof aiContent === 'string' ? aiContent : JSON.stringify(aiContent), 
                isLoading: false, 
                sources: data.result?.sources,
                answerSource: data.result?.answerSource 
              }
            : m
        ));
      } else {
        throw new Error(data?.message || 'AI response failed');
      }
    } catch (err) {
      console.error('Lỗi gửi tin nhắn:', err);
      const errorMessage = err.response?.status === 500
        ? 'Dịch vụ AI hiện không khả dụng. Vui lòng thử lại sau.'
        : err.response?.data?.message || err.message || 'Không thể tạo câu trả lời';

      setMessages(prev => prev.map(m =>
        m.id === aiPlaceholderId
          ? { ...m, content: errorMessage, isLoading: false, isError: true }
          : m
      ));
      setError(errorMessage);
    } finally {
      setIsSending(false);
    }
  }, [isSending, activeConversationId, chatContext]);

  /**
   * Xóa cuộc hội thoại
   */
  const deleteConversation = useCallback(async (conversationId) => {
    try {
      await aiApi.deleteConversation(conversationId);
      setConversations(prev => prev.filter(c => (c.id || c.conversationId) !== conversationId));
      if (activeConversationId === conversationId) {
        createNewConversation();
      }
      return { success: true };
    } catch (err) {
      console.error('Lỗi xóa hội thoại:', err);
      return { success: false, message: err.message };
    }
  }, [activeConversationId, createNewConversation]);

  /**
   * Tóm tắt tài liệu
   */
  const summarizeDocument = useCallback(async (documentId, documentName) => {
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: `Tóm tắt tài liệu: ${documentName}`,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsSending(true);

    const aiPlaceholderId = `ai-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: aiPlaceholderId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isLoading: true,
    }]);

    try {
      const data = await aiApi.summarizeDocument(documentId);
      if (data?.code === 0 || data?.code === 1000) {
        const summary = data.result?.summary || data.result?.content || data.result || 'Không thể tóm tắt tài liệu.';
        setMessages(prev => prev.map(m =>
          m.id === aiPlaceholderId
            ? { ...m, content: typeof summary === 'string' ? summary : JSON.stringify(summary), isLoading: false }
            : m
        ));
      } else {
        throw new Error(data?.message || 'Summarize failed');
      }
    } catch (err) {
      setMessages(prev => prev.map(m =>
        m.id === aiPlaceholderId
          ? { ...m, content: 'Không thể tóm tắt tài liệu. Vui lòng thử lại.', isLoading: false, isError: true }
          : m
      ));
    } finally {
      setIsSending(false);
    }
  }, []);

  return {
    messages,
    conversations,
    activeConversationId,
    isLoading,
    isSending,
    error,
    chatContext,
    setChatContext,
    fetchConversations,
    loadConversation,
    createNewConversation,
    sendMessage,
    deleteConversation,
    summarizeDocument,
  };
};

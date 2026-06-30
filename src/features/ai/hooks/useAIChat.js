import { useState, useCallback, useRef } from 'react';
import { aiApi } from '../api/ai.api.js';

/**
 * Hook quản lý state & logic cho AI Chatbot dựa trên Conversations
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
   * Lấy danh sách các cuộc hội thoại
   */
  const fetchConversations = useCallback(async (page = 0, size = 30) => {
    try {
      const data = await aiApi.getAiKnowledgeConversations(page, size);
      if (data?.code === 0 || data?.code === 1000) {
        setConversations(data.result?.content || data.result?.items || []);
      }
    } catch (err) {
      console.error('Lỗi lấy danh sách hội thoại:', err);
    }
  }, []);

  /**
   * Tải chi tiết một cuộc hội thoại (lấy danh sách messages)
   */
  const loadConversation = useCallback(async (conversationId) => {
    setIsLoading(true);
    setActiveConversationId(conversationId);
    
    try {
      const data = await aiApi.getAiKnowledgeConversationMessages(conversationId);
      if (data?.code === 0 || data?.code === 1000) {
        // Backend trả về mảng messages: [{ messageId, role, content, answerSource, sources, createdAt }]
        const msgs = data.result?.messages || [];
        setMessages(msgs.map(m => ({
          id: m.messageId || m.id || Date.now() + Math.random(),
          role: m.role?.toLowerCase() === 'user' ? 'user' : 'assistant',
          content: m.content,
          sources: m.sources,
          answerSource: m.answerSource,
          timestamp: m.createdAt
        })));
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error('Lỗi tải tin nhắn:', err);
      setMessages([]);
      setError('Không thể tải tin nhắn của hội thoại này.');
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
      };
      
      if (activeConversationId) {
        payload.conversationId = activeConversationId;
      }
      
      // Không gửi cùng lúc cả documentId và folderId
      if (chatContext.scope === 'document' && chatContext.documentId) {
        payload.documentId = chatContext.documentId;
      } else if (chatContext.scope === 'folder' && chatContext.folderId) {
        payload.folderId = chatContext.folderId;
      }

      const data = await aiApi.chatWithKnowledge(payload);

      if (data?.code === 0 || data?.code === 1000) {
        const result = data.result || {};
        const aiContent = result.answer || result.content || result.message || 'Xin lỗi, tôi không thể tạo câu trả lời.';
        const newConversationId = result.conversationId;
        
        // Cập nhật lại UI message list
        setMessages(prev => prev.map(m =>
          m.id === aiPlaceholderId
            ? { 
                ...m, 
                content: typeof aiContent === 'string' ? aiContent : JSON.stringify(aiContent), 
                isLoading: false, 
                sources: result.sources,
                answerSource: result.answerSource 
              }
            : m
        ));
        
        if (newConversationId && !activeConversationId) {
          setActiveConversationId(newConversationId);
        }
        
        // Tải lại sidebar để cập nhật tiêu đề và updatedAt
        fetchConversations(0, 30);
        
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
  }, [isSending, chatContext, activeConversationId, fetchConversations]);

  /**
   * Xóa cuộc hội thoại (Tính năng chưa được hỗ trợ bởi BE)
   */
  const deleteConversation = useCallback(async (conversationId) => {
    return { success: false, message: 'Tính năng xóa hội thoại chưa được hỗ trợ' };
  }, []);

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
    setActiveConversationId(null); // Tạo một session mới logic wise

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

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Input, Button, Spin, message as antMessage } from 'antd';
import { Client } from '@stomp/stompjs';
import { getGroupMessages, sendGroupMessage } from '../../api/groups.api';

export default function GroupChatTab({ group, currentUser, profileData }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(true);
  
  const messagesEndRef = useRef(null);
  const stompClientRef = useRef(null);

  const currentUserId = profileData?.id || profileData?.userId;

  const isLeader = group.role === 'LEADER' || group.owner === currentUser;
  const canChat = isLeader || group.canChat !== false;

  useEffect(() => {
    let active = true;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await getGroupMessages(group.id, 0, 100);
        if (active && data?.items) {
          // Backend returns newest first, reverse for display
          setMessages([...data.items].reverse());
        }
      } catch (error) {
        if (active) antMessage.error('Không thể tải lịch sử trò chuyện.');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchHistory();

    const token = localStorage.getItem('accessToken');
    if (token) {
      const client = new Client({
        brokerURL: 'wss://ash-project-be.onrender.com/api/v1/ws',
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        reconnectDelay: 5000,
        onConnect: () => {
          if (active) setConnecting(false);
          client.subscribe(`/topic/groups/${group.id}/messages`, (frame) => {
            const newMessage = JSON.parse(frame.body);
            setMessages((prev) => {
              // Prevent duplicates
              if (prev.some((m) => m.messageId === newMessage.messageId)) return prev;
              return [...prev, newMessage];
            });
          });
        },
        onDisconnect: () => {
          if (active) setConnecting(true);
        },
      });

      stompClientRef.current = client;
      client.activate();
    }

    return () => {
      active = false;
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [group.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const content = inputValue.trim();
    setInputValue('');

    try {
      const sentMessage = await sendGroupMessage(group.id, content);
      setMessages((prev) => {
        if (prev.some((m) => m.messageId === sentMessage.messageId)) return prev;
        return [...prev, sentMessage];
      });
    } catch (error) {
      const errorCode = error.response?.data?.code;
      if (errorCode === 1237 || errorCode === 'GROUP_CHAT_NOT_ALLOWED') {
        antMessage.error('Bạn đã bị tắt quyền chat trong nhóm này.');
      } else {
        antMessage.error('Không thể gửi tin nhắn.');
      }
      setInputValue(content); // Restore input on failure
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      key="chat"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col h-[calc(100vh-160px)] min-h-[500px] bg-[var(--color-surface)] border border-black/[0.04] rounded-2xl shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-black/[0.04] bg-white/50 backdrop-blur-md flex justify-between items-center z-10">
        <h3 className="font-semibold text-[16px] text-[var(--color-on-surface)] flex items-center gap-2">
          <i className="bi bi-chat-dots text-[var(--color-primary)]"></i> Trò chuyện nhóm
        </h3>
        {connecting && !loading && (
          <span className="text-[12px] text-amber-500 font-medium flex items-center gap-1.5 bg-amber-50 px-2 py-0.5 rounded-full">
            <Spin size="small" /> Đang kết nối...
          </span>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 bg-[var(--color-surface-container-lowest)] hide-scrollbar space-y-4">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Spin />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
            <i className="bi bi-chat-square-text text-4xl mb-3 text-[var(--color-primary)]"></i>
            <p className="text-[14px] font-medium">Chưa có tin nhắn nào</p>
            <p className="text-[12px]">Hãy là người đầu tiên bắt đầu cuộc trò chuyện!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            // Check if isMine by currentUserId if available, else fallback to email check (currentUser is email)
            const isMine = currentUserId ? msg.senderId === currentUserId : (msg.senderEmail === currentUser || msg.senderName === profileData?.fullName);
            
            const isNextSameSender = idx < messages.length - 1 && messages[idx + 1].senderId === msg.senderId;
            const isPrevSameSender = idx > 0 && messages[idx - 1].senderId === msg.senderId;

            // Show avatar for both left and right sides on the last message of the block
            const showAvatar = !isNextSameSender;
            const showName = !isMine && !isPrevSameSender;
            const isLastInGroup = !isNextSameSender;

            // Bubble border radii based on position in group
            let bubbleClasses = 'px-4 py-2 text-[14.5px] leading-relaxed break-words max-w-full ';
            if (isMine) {
              bubbleClasses += 'bg-[var(--color-primary)] text-white shadow-sm ';
              bubbleClasses += 'rounded-l-[20px] ';
              if (!isPrevSameSender && !isNextSameSender) bubbleClasses += 'rounded-r-[20px] ';
              else if (!isPrevSameSender && isNextSameSender) bubbleClasses += 'rounded-tr-[20px] rounded-br-[5px] ';
              else if (isPrevSameSender && !isNextSameSender) bubbleClasses += 'rounded-tr-[5px] rounded-br-[20px] ';
              else bubbleClasses += 'rounded-r-[5px] ';
            } else {
              bubbleClasses += 'bg-white border border-black/[0.04] text-[var(--color-on-surface)] shadow-sm ';
              bubbleClasses += 'rounded-r-[20px] ';
              if (!isPrevSameSender && !isNextSameSender) bubbleClasses += 'rounded-l-[20px] ';
              else if (!isPrevSameSender && isNextSameSender) bubbleClasses += 'rounded-tl-[20px] rounded-bl-[5px] ';
              else if (isPrevSameSender && !isNextSameSender) bubbleClasses += 'rounded-tl-[5px] rounded-bl-[20px] ';
              else bubbleClasses += 'rounded-l-[5px] ';
            }

            return (
              <div key={msg.messageId || idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'} ${isLastInGroup ? 'mb-4' : 'mb-[2px]'}`}>
                {!isMine && (
                  <div className="w-[32px] shrink-0 mr-2.5 flex flex-col items-center justify-end">
                    {showAvatar ? (
                      msg.senderAvatarUrl ? (
                        <img src={msg.senderAvatarUrl} alt={msg.senderName} className="w-[32px] h-[32px] rounded-full object-cover border border-black/5" />
                      ) : (
                        <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 flex items-center justify-center font-bold text-[13px] border border-black/5">
                          {(msg.senderName || 'U').charAt(0).toUpperCase()}
                        </div>
                      )
                    ) : null}
                  </div>
                )}
                
                <div className={`max-w-[70%] flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  {showName && (
                    <span className="text-[11.5px] font-medium text-black/45 ml-1.5 mb-1">{msg.senderName}</span>
                  )}
                  <div className={bubbleClasses} title={new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}>
                    {msg.content}
                  </div>
                </div>

                {isMine && (
                  <div className="w-[32px] shrink-0 ml-2.5 flex flex-col items-center justify-end">
                    {showAvatar ? (
                      msg.senderAvatarUrl ? (
                        <img src={msg.senderAvatarUrl} alt={msg.senderName} className="w-[32px] h-[32px] rounded-full object-cover border border-black/5" />
                      ) : (
                        <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600 flex items-center justify-center font-bold text-[13px] border border-black/5">
                          {(msg.senderName || 'U').charAt(0).toUpperCase()}
                        </div>
                      )
                    ) : null}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-black/[0.04]">
        {canChat ? (
          <div className="flex items-end gap-2 relative">
            <Input.TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              className="!bg-[var(--color-surface-container-low)] !border-none !rounded-xl !px-4 !py-3 !text-[14px] !shadow-none focus:!bg-white focus:!ring-1 focus:!ring-[var(--color-primary)]/30 transition-all custom-scrollbar"
            />
            <Button
              type="primary"
              shape="circle"
              icon={<i className="bi bi-send-fill text-[13px] ml-0.5"></i>}
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="h-10 w-10 shrink-0 bg-[var(--color-primary)] hover:!bg-[var(--color-primary)]/90 border-none shadow-sm flex items-center justify-center"
            />
          </div>
        ) : (
          <div className="bg-red-50 text-red-500 font-medium text-[13px] text-center p-3 rounded-xl border border-red-100 flex items-center justify-center gap-2">
            <i className="bi bi-dash-circle-fill"></i> Bạn đã bị tắt quyền chat trong nhóm này.
          </div>
        )}
      </div>
    </motion.div>
  );
}

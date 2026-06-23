import { Client } from "@stomp/stompjs";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ash-project-be.onrender.com/api/v1';

function buildWebSocketUrl() {
  const apiBaseUrl = API_BASE_URL.replace(/\/$/, '');
  return `${apiBaseUrl.replace(/^http/i, 'ws')}/ws`;
}

export const connectGroupChatSocket = ({ groupId, accessToken, onMessage, onStatusChange }) => {
  const client = new Client({
    brokerURL: buildWebSocketUrl(),
    connectHeaders: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {},
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    reconnectDelay: 5000,
    debug: (value) => console.log('[GroupChatSocket]', value),

    onConnect: () => {
      onStatusChange?.('CONNECTED');

      client.subscribe(`/topic/groups/${groupId}/messages`, (frame) => {
        try {
          if (!frame.body) return;
          const payload = JSON.parse(frame.body);
          // Backend may wrap the message in an ApiResponse { code, message, result }
          const message = payload.result || payload.data || payload;
          onMessage(message);
        } catch (error) {
          console.error("Failed to parse STOMP message:", frame.body, error);
        }
      });
    },

    onDisconnect: () => {
      onStatusChange?.('DISCONNECTED');
    },

    onStompError: (frame) => {
      console.error('[GroupChatSocket] stomp error', {
        message: frame.headers.message,
        body: frame.body,
      });
      onStatusChange?.('ERROR');
    },

    onWebSocketError: (error) => {
      console.error('[GroupChatSocket] websocket error', error);
      onStatusChange?.('ERROR');
    },
  });

  onStatusChange?.('CONNECTING');
  client.activate();

  return () => {
    client.deactivate();
  };
};

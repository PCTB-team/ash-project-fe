import { Client } from "@stomp/stompjs";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ash-project-be.onrender.com/api/v1';
const CONNECT_TIMEOUT_MS = 12000;

function buildWebSocketUrl() {
  const apiBaseUrl = API_BASE_URL.replace(/\/$/, '');
  return `${apiBaseUrl.replace(/^http/i, 'ws')}/ws`;
}

export const connectGroupEventSocket = ({ groupId, accessToken, onEvent, onStatusChange }) => {
  let connected = false;
  let timeoutId;
  const authHeaders = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  const markStatus = (status) => {
    onStatusChange?.(status);
  };

  const client = new Client({
    brokerURL: buildWebSocketUrl(),
    connectHeaders: authHeaders,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    reconnectDelay: 5000,
    debug: (value) => {
      const safeValue = value.replace(/Authorization:Bearer [^\n]+/g, 'Authorization:Bearer ***');
      console.log('[GroupEventSocket]', safeValue);
    },

    onConnect: () => {
      connected = true;
      clearTimeout(timeoutId);
      markStatus('CONNECTED');

      client.subscribe(
        `/topic/groups/${groupId}/events`,
        (frame) => {
          try {
            if (!frame.body) return;

            const payload = JSON.parse(frame.body);
            const event = payload.result || payload.data || payload;

            onEvent(event);
          } catch (error) {
            console.error('Failed to parse STOMP message:', frame.body, error);
          }
        },
        authHeaders
      );
    },

    onDisconnect: () => {
      connected = false;
      clearTimeout(timeoutId);
      markStatus('DISCONNECTED');
    },

    onStompError: (frame) => {
      console.error('[GroupEventSocket] stomp error', {
        message: frame.headers.message,
        body: frame.body,
      });

      connected = false;
      clearTimeout(timeoutId);
      markStatus('ERROR');
    },

    onWebSocketError: (error) => {
      console.error('[GroupEventSocket] websocket error', error);

      connected = false;
      clearTimeout(timeoutId);
      markStatus('ERROR');
    },

    onWebSocketClose: (event) => {
      connected = false;
      clearTimeout(timeoutId);

      console.warn('[GroupEventSocket] websocket closed', {
        code: event.code,
        reason: event.reason,
      });

      markStatus('DISCONNECTED');
    },
  });

  markStatus('CONNECTING');

  console.log('[GroupEventSocket] connecting', {
    brokerURL: buildWebSocketUrl(),
    groupId,
    hasToken: Boolean(accessToken),
  });

  timeoutId = setTimeout(() => {
    if (!connected) {
      console.warn('[GroupEventSocket] connect timeout');
      markStatus('ERROR');
    }
  }, CONNECT_TIMEOUT_MS);

  try {
    client.activate();
  } catch (error) {
    console.error('[GroupEventSocket] activate failed', error);
    clearTimeout(timeoutId);
    markStatus('ERROR');
  }

  return () => {
    clearTimeout(timeoutId);
    client.deactivate().catch((error) => {
      console.warn('[GroupEventSocket] deactivate failed', error);
    });
  };
};

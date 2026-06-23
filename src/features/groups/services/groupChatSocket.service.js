import { Client } from "@stomp/stompjs";
import { axiosClient } from "../../../utils/apiClient";

const getWebSocketUrl = () => {
  // Extract baseURL from axiosClient, e.g. "https://ash-project-be.onrender.com"
  const baseUrl = axiosClient.defaults.baseURL || "https://ash-project-be.onrender.com";
  // The backend websocket endpoint is /api/v1/ws
  return baseUrl.replace(/^http/, "ws") + "/api/v1/ws";
};

export const connectGroupChatSocket = ({ groupId, accessToken, onMessage, onStatusChange }) => {
  const client = new Client({
    brokerURL: getWebSocketUrl(),
    connectHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    onConnect: () => {
      onStatusChange?.("CONNECTED");

      client.subscribe(`/topic/groups/${groupId}/messages`, (frame) => {
        const message = JSON.parse(frame.body);
        onMessage(message);
      });
    },
    onDisconnect: () => {
      onStatusChange?.("DISCONNECTED");
    },
    onStompError: (frame) => {
      console.error("STOMP error:", frame.headers, frame.body);
      onStatusChange?.("ERROR");
    },
    onWebSocketError: (error) => {
      console.error("WebSocket error:", error);
      onStatusChange?.("ERROR");
    },
  });

  onStatusChange?.("CONNECTING");
  client.activate();

  return () => {
    client.deactivate();
  };
};

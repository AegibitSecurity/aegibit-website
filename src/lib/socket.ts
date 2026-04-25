"use client";
// WebSocket client for dashboard real-time updates
// Only used in dashboard components

let _socket: WebSocket | null = null;
type SocketHandler = (event: MessageEvent) => void;
const handlers: Set<SocketHandler> = new Set();

export function getSocketClient(): WebSocket | null {
  if (typeof window === "undefined") return null;
  if (_socket && _socket.readyState === WebSocket.OPEN) return _socket;

  const wsUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/^http/, "ws") ?? "ws://localhost:3000";

  try {
    _socket = new WebSocket(`${wsUrl}/api/socket`);

    _socket.onmessage = (e) => handlers.forEach(h => h(e));

    _socket.onclose = () => {
      _socket = null;
      // Reconnect after 3s
      setTimeout(() => getSocketClient(), 3000);
    };

    _socket.onerror = () => { _socket?.close(); };
  } catch { _socket = null; }

  return _socket;
}

export function subscribeToSocket(handler: SocketHandler) {
  handlers.add(handler);
  return () => handlers.delete(handler);
}

export function emitSocketEvent(type: string, data: unknown) {
  const socket = getSocketClient();
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type, data }));
  }
}

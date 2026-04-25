"use client";
import { useEffect, useRef, useState } from "react";

export function useWebSocket(url?: string) {
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<unknown>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!url) return;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen    = () => setConnected(true);
    ws.onclose   = () => setConnected(false);
    ws.onerror   = () => setConnected(false);
    ws.onmessage = (e) => {
      try { setLastMessage(JSON.parse(e.data)); } catch { setLastMessage(e.data); }
    };

    return () => { ws.close(); };
  }, [url]);

  function send(data: unknown) {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }

  return { connected, lastMessage, send };
}

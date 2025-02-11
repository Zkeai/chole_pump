"use client";
import { useEffect, useState, useRef } from "react";

const WebSocketComponent = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const reconnectInterval = useRef<NodeJS.Timeout | null>(null);
  const reconnectDelay = 5000; // 5 秒后尝试重连

  const connectWebSocket = () => {
    if (ws.current) {
      ws.current.close(); // 确保之前的 WebSocket 连接关闭
    }

    ws.current = new WebSocket("ws://localhost:3000/ws"); // 你的 WebSocket 服务器地址

    ws.current.onopen = () => {
      console.log("✅ WebSocket 连接成功");
      setIsConnected(true);
      if (reconnectInterval.current) {
        clearInterval(reconnectInterval.current); // 连接成功后清除重连定时器
        reconnectInterval.current = null;
      }
    };

    ws.current.onmessage = (event) => {
      console.log("📩 收到数据:", event.data);
      setMessages((prev) => [...prev, event.data]);
    };

    ws.current.onerror = (error) => {
      console.error("❌ WebSocket 错误:", error);
    };

    ws.current.onclose = () => {
      console.log("🔴 WebSocket 连接关闭");
      setIsConnected(false);
      if (!reconnectInterval.current) {
        console.log(`⏳ ${reconnectDelay / 1000} 秒后尝试重连...`);
        reconnectInterval.current = setInterval(
          connectWebSocket,
          reconnectDelay
        );
      }
    };
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectInterval.current) {
        clearInterval(reconnectInterval.current);
      }
    };
  }, []);

  return (
    <div>
      <h2>WebSocket 状态: {isConnected ? "🟢 已连接" : "🔴 未连接"}</h2>
      <h3>收到的消息:</h3>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default WebSocketComponent;

import React, { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext();

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const url = "wss://m95cq5efai.execute-api.ca-central-1.amazonaws.com/production"; // WebSocket URL
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received WebSocket message:", data);
      setMessages((prevMessages) => [...prevMessages, data]); // Append new message
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, messages }}>
      {children}
    </WebSocketContext.Provider>
  );
};

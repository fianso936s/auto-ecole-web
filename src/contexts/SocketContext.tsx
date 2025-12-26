import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { resolveApiBaseUrl } from "../lib/api/apiUrl";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Pour Socket.IO, on a besoin d'une URL complète
  // Si API_URL est vide (proxy Vite), utiliser window.location.origin
  const getSocketUrl = (): string => {
    const apiUrl = resolveApiBaseUrl();
    if (!apiUrl) {
      // En développement avec proxy Vite, utiliser l'origine du frontend
      return window.location.origin;
    }
    return apiUrl;
  };

  useEffect(() => {
    const socketUrl = getSocketUrl();
    const socketInstance = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    socketInstance.on("connect", () => {
      console.log("WebSocket Connected");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("WebSocket Disconnected");
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};


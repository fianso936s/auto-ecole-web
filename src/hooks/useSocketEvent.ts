import { useEffect } from "react";
import { useSocket } from "../contexts/SocketContext";

export const useSocketEvent = (event: string, callback: (data: any) => void) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  }, [socket, event, callback]);
};


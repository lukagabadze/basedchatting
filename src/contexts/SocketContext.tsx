import React, { ReactElement, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { Socket } from "socket.io-client";

const SocketContext = React.createContext<Socket | null>(null);

export function useSocket() {
  return useContext(SocketContext);
}

interface Props {
  children: React.ReactNode;
}

export function SocketProvider({ children }: Props): ReactElement {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(
      // "https://basedchatting-server.herokuapp.com/",
      "localhost:4000",
      {
        transports: ["websocket"],
      }
    );
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {socket && children}
    </SocketContext.Provider>
  );
}

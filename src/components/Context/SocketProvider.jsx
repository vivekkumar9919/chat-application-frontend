import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SocketContext } from "./SocketContext";


const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);


  useEffect(() => {
    // Create connection
    const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      transports: ["websocket"],
      withCredentials: true, // optional if you need cookies/auth
    });
    setSocket(newSocket);
    // Cleanup on unmount
    // return () => {
    //   newSocket.disconnect();
    // };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"],
});

function Chat() {
  const { userId } = useParams();
  const [contacts] = useState(["user1", "user2", "user3"]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (userId) {
      socket.emit("join", userId);
    }

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("receiveMessage", ({ message, from }) => {
      setChat((prev) => [...prev, { message, from }]);
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("receiveMessage");
    };
  }, [userId]);

  const sendMessage = (receiverId) => {
    socket.emit("sendMessage", { to: receiverId, message, from: userId });
    setChat((prev) => [...prev, { message, from: "me" }]);
    setMessage("");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-2">Messaging App</h1>
      <h2 className="mb-4">Logged In as: {userId}</h2>

      <h3>Contacts:</h3>
      {contacts.map((contact) => (
        <div key={contact} className="my-2">
          {contact}{" "}
          {onlineUsers.includes(contact) ? "🟢 Online" : "🔴 Offline"}
          <button
            className="ml-2 bg-blue-500 text-white px-2 py-1 rounded"
            onClick={() => sendMessage(contact)}
          >
            Send
          </button>
        </div>
      ))}

      <div className="mt-4">
        <h3 className="text-3xl font-bold underline">Messages:</h3>
        {chat.map((msg, i) => (
          <p key={i}>
            <b>{msg.from}:</b> {msg.message}
          </p>
        ))}
      </div>

      <input
        className="border p-2 mt-2 w-full"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
    </div>
  );
}

export default Chat;

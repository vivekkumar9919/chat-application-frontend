import React ,{useCallback, useEffect, useState} from "react";
import { 
    Send, 
    Phone, 
    Video, 
    MoreVertical,
  } from 'lucide-react';
import chatServices from "../main.service";
import { formatTimestamp } from "../utility/utils";
import { Socket } from "socket.io-client";
import { useSocket } from "../components/Context/SocketContext";
import STATUS_CODES from "../constants/statusCodes";


const ChatWindow = ({ chat, currentUser }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const socket = useSocket();

    useEffect(() => {
    if (!socket) return;

    socket.on("ping", (msg) => {
      console.log("New message:", msg);
    });

    socket.emit("pong", "Hello from client");

    return () => {
      socket.off("ping"); // cleanup
    };
  }, [socket]);
  
    
    const handleSend = useCallback(async (e) => {
      e.preventDefault();
      if (message.trim() === '') return;
  
      const messagePayload = {
        senderId: currentUser.id,
        messageText: message.trim(),
      };

      try {
        const result = await chatServices.sendMessage(messagePayload, chat.conversation_id);
        console.log('Message sent:', result);
        setMessages((prevMessages) => [...prevMessages, messagePayload]);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }, [message, currentUser.id]);

    useEffect(() => {
      console.log('ChatWindow - Selected chat:', chat);

      const fetchMessages = async () =>{
        try{
          const response = await chatServices.fetchMessagesByConversationId(chat.conversation_id, currentUser.id);
          console.log('Fetched messages:', response);
          if(response?.status_code === STATUS_CODES.OK){
            setMessages(response.messages || []);
          }
        }
        catch(err){
          console.error('Error fetching messages:', err);
        }
      }

      fetchMessages();

    }, [currentUser.id, chat]);
  
    return (
      <>
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={chat.avatar} alt={chat.display_name} className="w-10 h-10 rounded-full" />
              <div>

                <h3 className="font-semibold text-gray-900">{chat.display_name}</h3>
                <p className="text-sm text-gray-500">
                  {chat.type === 'direct' ? 'Online' : `${chat.members} members`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg"><Phone className="h-5 w-5 text-gray-600" /></button>
              <button className="p-2 hover:bg-gray-100 rounded-lg"><Video className="h-5 w-5 text-gray-600" /></button>
              <button className="p-2 hover:bg-gray-100 rounded-lg"><MoreVertical className="h-5 w-5 text-gray-600" /></button>
            </div>
          </div>
        </div>
  
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                msg.isOwn ? 'bg-blue-500 text-white' : 'bg-white text-gray-900 border'
              }`}>
              <p className="font-semibold capitalize">{msg.isOwn ? 'You' :msg.sender_name}</p>
                <p className="text-sm">{msg.message_text}</p>
                <p className={`text-xs mt-1 ${msg.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                  {formatTimestamp(msg.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
  
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSend} className="flex items-center space-x-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 bg-gray-100 border-0 rounded-full focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-3 rounded-full"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </>
    );
  };

  export default ChatWindow;
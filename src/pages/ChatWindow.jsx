import React ,{useCallback, useEffect, useState} from "react";
import { 
    Send, 
    Phone, 
    Video, 
    MoreVertical,
  } from 'lucide-react';
import chatServices from "../main.service";
import { formatTimestamp } from "../utility/utils";
import { useSocket } from "../components/Context/SocketContext";
import STATUS_CODES from "../constants/statusCodes";


const ChatWindow = ({ chat, currentUser }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const { socket, isConnected } = useSocket();

    // Socket event handlers
    useEffect(() => {
      if (!socket || !isConnected) return;

      // Handle incoming messages
      const handleReceiveMessage = (messageData) => {
        console.log('Received message:', messageData);
        setMessages(prev => [...prev, messageData]);
      };

      // Handle message sent confirmation
      const handleMessageSent = (messageData) => {
        console.log('Message sent confirmation:', messageData);
        setMessages(prev => [...prev, messageData]);
      };

      // Handle message errors
      const handleMessageError = (error) => {
        console.error('Message error:', error);
        // You can show a toast notification here
      };

      socket.on("receiveMessage", handleReceiveMessage);
      socket.on("messageSent", handleMessageSent);
      socket.on("messageError", handleMessageError);

      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
        socket.off("messageSent", handleMessageSent);
        socket.off("messageError", handleMessageError);
      };
    }, [socket, isConnected]);
  
    
    const handleSend = useCallback((e) => {
      e.preventDefault();
      if (message.trim() === '' || !socket || !isConnected) return;
  
      // Get receiver ID from chat (assuming it's the other participant)
      const receiverId = chat.participants?.find(p => p !== currentUser.id);
      
      if (!receiverId) {
        console.error('No receiver found for this conversation');
        return;
      }

      // Send message via socket
      socket.emit("sendMessage", {
        conversationId: chat.conversation_id,
        messageText: message.trim(),
        senderId: currentUser.id,
        receiverId: receiverId
      });

      setMessage('');
    }, [message, currentUser.id, chat, socket, isConnected]);

    // Load initial messages when chat changes
    useEffect(() => {
      console.log('ChatWindow - Selected chat:', chat);

      const fetchMessages = async () =>{
        try{
          const response = await chatServices.fetchMessagesByConversationId(chat.conversation_id, currentUser.id);
          console.log('Fetched messages response:', response);
          
          if (response?.status_code === STATUS_CODES.OK) {
            setMessages(response.messages);
          } else {
            setMessages([]);
          }
        }
        catch(err){
          console.error('Error fetching messages:', err);
          setMessages([]);
        }
      }

      if (chat && chat.conversation_id) {
        fetchMessages();
      } else {
        setMessages([]);
      }

    }, [currentUser.id, chat?.conversation_id]);
  
    return (
      <>
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={chat.avatar_url} alt={chat.display_name} className="w-10 h-10 rounded-full" />
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">{chat.display_name}</h3>
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} 
                       title={isConnected ? 'Connected' : 'Disconnected'}></div>
                </div>
                <p className="text-sm text-gray-500">
                  {chat.type === 'direct' ? (isConnected ? 'Online' : 'Offline') : `${chat.members} members`}
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
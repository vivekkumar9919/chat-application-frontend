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
        {/* Chat Header */}
        <div className="bg-gray-900 border-b border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src={chat.avatar} 
                  alt={chat.display_name} 
                  className="w-11 h-11 rounded-full ring-2 ring-blue-600 ring-offset-2 ring-offset-gray-900 object-cover" 
                />
                <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-gray-900 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
              <div>
                <h3 className="font-semibold text-white">{chat.display_name}</h3>
                <p className="text-sm text-gray-400">
                  {chat.type === 'direct' ? (isConnected ? 'Online' : 'Offline') : `${chat.members} members`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <button className="p-2 hover:bg-gray-800 rounded-xl transition-all duration-200 group">
                <Phone className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-xl transition-all duration-200 group">
                <Video className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-xl transition-all duration-200 group">
                <MoreVertical className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>
  
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-950 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
          {messages.map((msg, index) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg transition-all duration-200 hover:scale-[1.02] ${
                msg.isOwn 
                  ? 'bg-blue-600 text-white rounded-br-sm' 
                  : 'bg-gray-900 text-gray-100 border border-gray-800 rounded-bl-sm'
              }`}>
                {!msg.isOwn && (
                  <p className="font-semibold text-blue-400 text-xs mb-1 capitalize">
                    {msg.sender_name}
                  </p>
                )}
                <p className="text-sm leading-relaxed break-words">{msg.message_text}</p>
                <p className={`text-xs mt-1.5 ${msg.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                  {formatTimestamp(msg.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
  
        {/* Message Input */}
        <div className="bg-gray-900 border-t border-gray-800 p-4">
          <form onSubmit={handleSend} className="flex items-center space-x-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-5 py-3 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-full focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 cursor-pointer disabled:cursor-not-allowed text-white p-3 rounded-full transition-all duration-200 hover:scale-110 disabled:hover:scale-100 shadow-lg disabled:shadow-none"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </>
    );
  };

  export default ChatWindow;
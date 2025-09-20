import React ,{useState} from "react";
import { 
    Send, 
    Phone, 
    Video, 
    MoreVertical,
  } from 'lucide-react';


const ChatWindow = ({ chat, currentUser }) => {
    const [message, setMessage] = useState('');
    const [messages] = useState([
      { id: 1, sender: 'Alice', content: 'Hey! How are you?', timestamp: '2:30 PM', isOwn: false },
      { id: 2, sender: currentUser.name, content: 'I\'m great! How about you?', timestamp: '2:32 PM', isOwn: true }
    ]);
  
    const handleSend = (e) => {
      e.preventDefault();
      if (message.trim()) {
        setMessage('');
      }
    };
  
    return (
      <>
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full" />
              <div>
                <h3 className="font-semibold text-gray-900">{chat.name}</h3>
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
                <p className="text-sm">{msg.content}</p>
                <p className={`text-xs mt-1 ${msg.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                  {msg.timestamp}
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
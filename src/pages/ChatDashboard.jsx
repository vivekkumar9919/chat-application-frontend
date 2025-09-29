
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {Search, Users ,Settings, MessageCircle } from 'lucide-react'
import ChatWindow from './ChatWindow'
import chatServices from '../main.service';
import { formatTimestamp } from '../utility/utils';
import { useAuth } from "../components/Context/AuthContext";

const ChatDashboard = () => {
   const { user : currentUser } = useAuth();
    const [selectedChat, setSelectedChat] = useState(null);
    const [conversations, setConversations] = useState([]);
    const navigate = useNavigate();

    

    useEffect(() => {
          if(!currentUser){
          console.log('ChatDashboard - No user data, redirecting to login');
          return;
          }

        async function fetchConversations(){
          try{
            const conversations = await chatServices.fetchConversationsByUserId(currentUser.id);
            console.log('Fetched conversations:', conversations);
            setConversations(conversations);
          }
          catch(err){
            console.error('Error fetching conversations:', err);
          }
        }

        fetchConversations();

    }, [currentUser]);

    if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="font-semibold text-gray-900">
                  {currentUser.name}
                </h2>
                <p className="text-sm text-green-600">Online</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/settings")}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {conversations?.map((chat) => (
            <div
              key={chat.conversation_id}
              onClick={() => setSelectedChat(chat)}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${selectedChat?.conversation_id === chat.conversation_id
                  ? "bg-blue-50 border-l-4 border-blue-500"
                  : "hover:bg-gray-50"
                }`}
            >
              <div className="relative">
                <img
                  src={chat.avatar}
                  alt={chat.display_name}
                  className="w-12 h-12 rounded-full"
                />
                {chat.type === "group" && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                    <Users className="h-2 w-2 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {chat.display_name}
                  </h4>
                  <span className="text-xs text-gray-500">{formatTimestamp(chat.last_message_at)}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {chat.last_message}
                </p>
              </div>

              {chat.unread_count > 0 && (
                <div className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {chat.unread_count}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg w-full"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="text-left">
              <p className="font-medium text-gray-900 text-sm">
                {currentUser.name}
              </p>
              <p className="text-xs text-gray-500">View Profile</p>
            </div>
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatWindow chat={selectedChat} currentUser={currentUser} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No conversation selected
              </h3>
              <p className="text-gray-500">Choose a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDashboard;

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {Search, Users ,Settings, MessageCircle, Plus, UserPlus } from 'lucide-react'
import ChatWindow from './ChatWindow'
import UserSearch from '../components/UserSearch/UserSearch'
import chatServices from '../main.service';
import { formatTimestamp } from '../utility/utils';
import { useAuth } from "../components/Context/AuthContext";
import { useSocket } from "../components/Context/SocketContext";
import STATUS_CODES from '../constants/statusCodes';

const ChatDashboard = () => {
   const { user : currentUser } = useAuth();
   const { socket, isConnected } = useSocket();
    const [selectedChat, setSelectedChat] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [isUserSearchOpen, setIsUserSearchOpen] = useState(false);
    const navigate = useNavigate();

    

    // Socket event handlers for online users
    useEffect(() => {
      if (!socket || !isConnected) return;

      const handleOnlineUsers = (users) => {
        console.log('Online users:', users);
        setOnlineUsers(users);
      };

      socket.on('onlineUsers', handleOnlineUsers);

      return () => {
        socket.off('onlineUsers', handleOnlineUsers);
      };
    }, [socket, isConnected]);

    useEffect(() => {
          if(!currentUser){
          console.log('ChatDashboard - No user data, redirecting to login');
          return;
          }

        async function fetchConversations(){
          try{
            const conversations = await chatServices.fetchConversationsByUserId(currentUser.id);
            console.log('Fetched conversations:', conversations);
            if(conversations?.status_code === STATUS_CODES.OK){
              setConversations(conversations.conversations || []);
            }
          }
          catch(err){
            console.error('Error fetching conversations:', err);
          }
        }

        fetchConversations();

    }, [currentUser]);

    // Handle conversation creation from user search
    const handleConversationCreated = async (newConversation) => {
      // Add the new conversation to the list
      setConversations(prev => [newConversation, ...prev]);
      setSelectedChat(newConversation);
      
      // Refresh the conversation list to get the latest data from server
      try {
        const conversations = await chatServices.fetchConversationsByUserId(currentUser.id);
        if (conversations.status_code === 200) {
          setConversations(conversations.conversations);
          // Find and select the new conversation
          console.log("fetchConversationsByUserId---", conversations)
          const updatedConversation = conversations.conversations.find(
            conv => conv.conversation_id === newConversation.conversation_id
          );
          if (updatedConversation) {
            setSelectedChat(updatedConversation);
          }
        }
      } catch (error) {
        console.error('Error refreshing conversations:', error);
      }
    };

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
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col relative">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={currentUser?.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="font-semibold text-gray-900">
                  {currentUser?.name}
                </h2>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                    {isConnected ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/settings")}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* <button
              onClick={() => setIsUserSearchOpen(true)}
              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              title="Start new conversation"
            >
              <Plus className="h-4 w-4" />
            </button> */}
            
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
                  src={chat.avatar_url}
                  alt={chat.display_name}
                  className="w-12 h-12 rounded-full"
                />
                {chat.type === "group" ? (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                    <Users className="h-2 w-2 text-white" />
                  </div>
                ) : (
                  // Show online status for direct messages
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    onlineUsers.includes(chat.participants?.find(p => p !== currentUser.id)) ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                )}
              </div>

              {/* <div className="flex-1 min-w-0">
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
              )} */}


            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg w-full"
          >
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="text-left">
              <p className="font-medium text-gray-900 text-sm">
                {currentUser?.name}
              </p>
              <p className="text-xs text-gray-500">View Profile</p>
            </div>
          </button>
        </div>

        <button 
        className='absolute bottom-24 right-2 w-12 h-12 bg-blue-600
         rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-700'
         onClick={() => navigate('/new-chat')}
         >
          <UserPlus className="h-5 w-5 text-white" />
        </button>
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

      {/* User Search Modal */}
      {/* <UserSearch
        isOpen={isUserSearchOpen}
        onClose={() => setIsUserSearchOpen(false)}
        onConversationCreated={handleConversationCreated}
      /> */}

      
    </div>
  );
};

export default ChatDashboard;
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {Search, Users ,Settings, MessageCircle, UserPlus, LogOut } from 'lucide-react'
import ChatWindow from './ChatWindow'
import chatServices from '../main.service';
import { formatTimestamp } from '../utility/utils';
import { useAuth } from "../components/Context/AuthContext";
import { useSocket } from "../components/Context/SocketContext";
import STATUS_CODES from '../constants/statusCodes';
import Tooltip from '../components/Tooltip/Tooltip'

const ChatDashboard = () => {
   const { user : currentUser } = useAuth();
   const { socket, isConnected } = useSocket();
    const [selectedChat, setSelectedChat] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
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

    }, [currentUser,navigate]);

    if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar */}
      <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col relative">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={currentUser?.avatar}
                  alt={currentUser.name}
                  className="w-11 h-11 rounded-full ring-2 ring-blue-600 ring-offset-2 ring-offset-gray-900"
                />
                <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-gray-900 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
              <div>
                <h2 className="font-semibold text-white">
                  {currentUser?.name}
                </h2>
                <p className={`text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                  {isConnected ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            
            <Tooltip text="Settings" position="bottom">
            <button
              onClick={() => navigate("/settings")}
              className="p-2 hover:bg-gray-800 rounded-lg cursor-pointer transition-all duration-200 group"
            >
              <Settings className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
            </button>
            </Tooltip>
            
          </div>

          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {conversations?.map((chat) => (
            <div
              key={chat.conversation_id}
              onClick={() => setSelectedChat(chat)}
              className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 mb-1 ${
                selectedChat?.conversation_id === chat.conversation_id
                  ? "bg-blue-600 shadow-lg shadow-blue-600/20"
                  : "hover:bg-gray-800"
              }`}
            >
              <div className="relative">
                <img
                  src={chat.avatar}
                  alt={chat.display_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {chat.type === "group" ? (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-gray-900">
                    <Users className="h-2.5 w-2.5 text-white" />
                  </div>
                ) : (
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${
                    onlineUsers.includes(chat.participants?.find(p => p !== currentUser.id)) ? 'bg-green-500' : 'bg-gray-600'
                  }`}></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`font-semibold truncate ${
                    selectedChat?.conversation_id === chat.conversation_id ? 'text-white' : 'text-gray-100'
                  }`}>
                    {chat.display_name}
                  </h4>
                  <span className={`text-xs ${
                    selectedChat?.conversation_id === chat.conversation_id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTimestamp(chat.last_message_at)}
                  </span>
                </div>
                <p className={`text-sm truncate ${
                  selectedChat?.conversation_id === chat.conversation_id ? 'text-blue-100' : 'text-gray-400'
                }`}>
                  {chat.last_message}
                </p>
              </div>

              {chat.unread_count > 0 && (
                <div className="bg-blue-500 text-white text-xs rounded-full h-5 min-w-[20px] px-1.5 flex items-center justify-center font-medium">
                  {chat.unread_count}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Profile Footer */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-xl w-full cursor-pointer transition-all duration-200 group"
          >
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-10 h-10 rounded-full ring-2 ring-gray-700 group-hover:ring-blue-600 transition-all duration-200"
            />
            <div className="text-left">
              <p className="font-medium text-white text-sm">
                {currentUser?.name}
              </p>
              <p className="text-xs text-gray-400 group-hover:text-blue-400 transition-colors">View Profile</p>
            </div>
          </button>
        </div>

        {/* Floating Action Button */}
        <button 
        className='absolute bottom-28 right-4 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-600/30 cursor-pointer hover:bg-blue-700 hover:scale-110 transition-all duration-200 group'
         onClick={() => navigate('/new-chat')}
         >
          <UserPlus className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-950">
        {selectedChat ? (
          <ChatWindow chat={selectedChat} currentUser={currentUser} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
                <div className="relative bg-gray-900 p-6 rounded-full inline-block">
                  <MessageCircle className="h-16 w-16 text-blue-500" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                No conversation selected
              </h3>
              <p className="text-gray-400">Choose a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDashboard;
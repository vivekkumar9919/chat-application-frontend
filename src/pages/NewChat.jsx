import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Users, Loader2, UserPlus } from 'lucide-react';
import { useAuth } from "../components/Context/AuthContext";
import chatServices from '../main.service';
import STATUS_CODES from '../constants/statusCodes';

const NewChat = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      console.log('NewChat - No user data, redirecting to login');
      navigate('/login');
      return;
    }
  }, [currentUser, navigate]);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchUsers(searchQuery);
      } else {
        setUsers([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const searchUsers = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await chatServices.searchUsers(query);
      console.log('Search results:', response);
      if (response?.status_code === STATUS_CODES.OK) {
        // Filter out current user from the list
        const allUsers = response.users || [];
        const otherUsers = allUsers.filter(user => user.id !== currentUser.id);
        setUsers(otherUsers);
      }
    } catch (err) {
      console.error('Error searching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = async (user) => {
    setIsCreatingChat(true);
    try {
      // Create or get existing conversation with this user
      const response = await chatServices.createConversation('direct', [currentUser.id, user.id]);
      
      console.log('Conversation response:', response);

      if (response?.status_code === STATUS_CODES.OK || response?.status_code === STATUS_CODES.CREATED) {
        // Navigate back to chat dashboard with selected conversation
        navigate('/chat', { state: { selectedConversationId: response.conversation.conversation_id } });
      }
    } catch (err) {
      console.error('Error creating conversation:', err);
    } finally {
      setIsCreatingChat(false);
    }
  };

  const toggleUserSelection = (user) => {
    setSelectedUsers(prev => {
      const isSelected = prev.find(u => u.id === user.id);
      if (isSelected) {
        return prev.filter(u => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  const createGroupChat = async () => {
    if (selectedUsers.length < 2) return;
    
    setIsCreatingChat(true);
    try {
      const participantIds = [currentUser.id, ...selectedUsers.map(u => u.id)];
      const response = await chatServices.createOrGetConversation(
        participantIds,
        'group',
        selectedUsers.map(u => u.name).join(', ')
      );
      
      if (response?.status_code === STATUS_CODES.OK || response?.status_code === STATUS_CODES.CREATED) {
        navigate('/chat', { state: { selectedConversationId: response.conversation.conversation_id } });
      }
    } catch (err) {
      console.error('Error creating group chat:', err);
    } finally {
      setIsCreatingChat(false);
    }
  };

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
      <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/chat')}
                className="p-2 hover:bg-gray-800 rounded-lg cursor-pointer transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
              </button>
              <div>
                <h2 className="font-semibold text-white">New Chat</h2>
                <p className="text-sm text-gray-400">
                  {selectedUsers.length > 0 ? `${selectedUsers.length} selected` : 'Select users'}
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
            />
          </div>

          {selectedUsers.length > 0 && (
            <div className="mt-3">
              <button
                onClick={createGroupChat}
                disabled={isCreatingChat || selectedUsers.length < 2}
                className="w-full py-2.5 px-4 cursor-pointer bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50"
              >
                {isCreatingChat ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4" />
                    <span>Create Group ({selectedUsers.length})</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : users?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <Users className="h-12 w-12 text-gray-600 mb-3" />
              <p className="text-gray-300 font-medium">No users found</p>
              <p className="text-sm text-gray-500 mt-1">
                {searchQuery ? 'Try a different search term' : 'No users available'}
              </p>
            </div>
          ) : (
            <>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                {searchQuery ? `Results (${users?.length})` : `All Users (${users?.length})`}
              </div>
              {users?.map((user) => {
                const isSelected = selectedUsers.find(u => u.id === user.id);
                return (
                  <div
                    key={user.id}
                    className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 mb-1 ${
                      isSelected ? 'bg-blue-600 shadow-lg shadow-blue-600/20' : 'hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex-1 flex items-center space-x-3" onClick={() => handleUserClick(user)}>
                      <div className="relative">
                        <img
                          src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {user.is_online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold truncate ${
                          isSelected ? 'text-white' : 'text-gray-100'
                        }`}>
                          {user.name}
                        </h4>
                        <p className={`text-sm truncate ${
                          isSelected ? 'text-blue-100' : 'text-gray-400'
                        }`}>
                          {user.email || user.username || 'No email'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleUserSelection(user);
                      }}
                      className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                        isSelected ? 'bg-blue-700 text-white' : 'hover:bg-gray-700 text-gray-400 hover:text-white'
                      }`}
                    >
                      <UserPlus className="h-5 w-5" />
                    </button>
                  </div>
                );
              })}
            </>
          )}
        </div>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => navigate('/chat')}
            className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-800 rounded-xl w-full transition-all duration-200 group"
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
              <p className="text-xs text-gray-400 group-hover:text-blue-400 transition-colors">Back to Chats</p>
            </div>
          </button>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex items-center justify-center bg-gray-950">
        <div className="text-center max-w-md">
          {isCreatingChat ? (
            <>
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
                <div className="relative">
                  <Loader2 className="h-16 w-16 text-blue-500 mx-auto animate-spin" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Creating conversation...
              </h3>
              <p className="text-gray-400">Please wait</p>
            </>
          ) : selectedUsers.length > 0 ? (
            <>
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
                <div className="relative bg-gray-900 p-6 rounded-full inline-block">
                  <Users className="h-16 w-16 text-blue-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
              </h3>
              <p className="text-gray-400 mb-6">
                {selectedUsers.length === 1
                  ? 'Click on a user to start a direct chat'
                  : 'Click "Create Group" to start a group chat'}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {selectedUsers.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-2 bg-gray-800 border border-gray-700 px-3 py-2 rounded-full"
                  >
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                      alt={user.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm font-medium text-white">{user.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
                <div className="relative bg-gray-900 p-6 rounded-full inline-block">
                  <UserPlus className="h-16 w-16 text-blue-500" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                Start a New Chat
              </h3>
              <p className="text-gray-400 mb-6">
                Search and select users from the sidebar to start chatting
              </p>
              <div className="mt-6 space-y-2 text-sm text-gray-400">
                <p>💬 Click on a user to start a direct chat</p>
                <p>👥 Select multiple users to create a group</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewChat;
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
      const response = await chatServices.createOrGetConversation([currentUser.id, user.id],'direct');
      
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
              <button
                onClick={() => navigate('/chat')}
                className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h2 className="font-semibold text-gray-900">New Chat</h2>
                <p className="text-sm text-gray-600">
                  {selectedUsers.length > 0 ? `${selectedUsers.length} selected` : 'Select users'}
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {selectedUsers.length > 0 && (
            <div className="mt-3">
              <button
                onClick={createGroupChat}
                disabled={isCreatingChat || selectedUsers.length < 2}
                className="w-full py-2 px-4 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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

        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : users?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <Users className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-600 font-medium">No users found</p>
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
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
                      isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex-1 flex items-center space-x-3" onClick={() => handleUserClick(user)}>
                      <div className="relative">
                        <img
                          src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                          alt={user.name}
                          className="w-12 h-12 rounded-full"
                        />
                        {user.is_online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {user.name}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">
                          {user.email || user.username || 'No email'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleUserSelection(user);
                      }}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        isSelected ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-600'
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

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => navigate('/chat')}
            className="flex items-center space-x-3 p-2 cursor-pointer hover:bg-gray-100 rounded-lg w-full"
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
              <p className="text-xs text-gray-500">Back to Chats</p>
            </div>
          </button>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md">
          {isCreatingChat ? (
            <>
              <Loader2 className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Creating conversation...
              </h3>
              <p className="text-gray-500">Please wait</p>
            </>
          ) : selectedUsers.length > 0 ? (
            <>
              <Users className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
              </h3>
              <p className="text-gray-500 mb-4">
                {selectedUsers.length === 1
                  ? 'Click on a user to start a direct chat'
                  : 'Click "Create Group" to start a group chat'}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {selectedUsers.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-full"
                  >
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                      alt={user.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <UserPlus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Start a New Chat
              </h3>
              <p className="text-gray-500">
                Search and select users from the sidebar to start chatting
              </p>
              <div className="mt-6 space-y-2 text-sm text-gray-600">
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
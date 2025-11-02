import React, { useState, useEffect } from 'react';
import { Search, Plus, X, User } from 'lucide-react';
import chatServices from '../../main.service';
import { useAuth } from '../Context/AuthContext';

const UserSearch = ({ isOpen, onClose, onConversationCreated }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creatingConversation, setCreatingConversation] = useState(null);
  const { user: currentUser } = useAuth();

  // Fetch all users when component opens
  useEffect(() => {
    if (isOpen) {
      fetchAllUsers();
    }
  }, [isOpen]);

  // Search users based on query
  useEffect(() => {
    if (searchQuery.trim()) {
      searchUsers(searchQuery);
    } else {
      fetchAllUsers();
    }
  }, [searchQuery]);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await chatServices.fetchAllUsers();
      if (response.status_code === 200) {
        // Filter out current user
        const filteredUsers = response.users.filter(user => user.id !== currentUser.id);
        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query) => {
    try {
      setLoading(true);
      const response = await chatServices.searchUsers(query);
      if (response.status_code === 200) {
        // Filter out current user
        const filteredUsers = response.users.filter(user => user.id !== currentUser.id);
        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (userId) => {
    try {
      setCreatingConversation(userId);
      const response = await chatServices.createConversation('direct', [currentUser.id, userId]);
      
      if (response.status_code === 201 || response.status_code === 200) {
        console.log('Conversation created:', response.conversation);
        
        // Create conversation object for the chat dashboard
        const conversation = {
          conversation_id: response.conversation.conversationId,
          type: 'direct',
          display_name: users.find(u => u.id === userId)?.username || 'Unknown User',
          other_user_id: userId,
          avatar: null,
          last_message: null,
          last_message_at: new Date().toISOString(),
          unread_count: 0,
          participants: [currentUser.id, userId]
        };

        onConversationCreated(conversation);
        onClose();
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    } finally {
      setCreatingConversation(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Search Users</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by username or email..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : users.length > 0 ? (
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{user.username}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => createConversation(user.id)}
                    disabled={creatingConversation === user.id}
                    className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                  >
                    {creatingConversation === user.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchQuery ? 'No users found matching your search.' : 'No users available.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearch;

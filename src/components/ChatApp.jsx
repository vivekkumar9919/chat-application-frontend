import React, { useState } from 'react';

import LoginPage from './LoginPage'
import SignupPage from './SignupPage'
import ProfilePage from './ProfilePage'
import SettingsPage from './SettingsPage'
import ChatDashboard from './ChatDashboard';



const ChatApp = () => {
  const [currentView, setCurrentView] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setCurrentView('chat');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'login' && (
        <LoginPage onLogin={handleLogin} onSwitchToSignup={() => setCurrentView('signup')} />
      )}
      {currentView === 'signup' && (
        <SignupPage onSignup={handleLogin} onSwitchToLogin={() => setCurrentView('login')} />
      )}
      {currentView === 'chat' && currentUser && (
        <ChatDashboard 
          currentUser={currentUser}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
          onNavigate={setCurrentView}
        />
      )}
      {currentView === 'profile' && currentUser && (
        <ProfilePage currentUser={currentUser} onBack={() => setCurrentView('chat')} />
      )}
      {currentView === 'settings' && (
        <SettingsPage onBack={() => setCurrentView('chat')} />
      )}
    </div>
  );
};



export default ChatApp;
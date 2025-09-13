import React, {useState} from "react";
import { useNavigate } from 'react-router-dom';
import {ArrowLeft, LogOut } from 'lucide-react'
import chatServices from '../main.service'


const SettingsPage = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState({ messages: true, groups: true });
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            // Get user data from localStorage
            const user = JSON.parse(localStorage.getItem('user'));
            
            if (user) {
                await chatServices.logoutService({ user_id: user.id });
            }
            
            // Clear localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            
            // Redirect to login page
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Even if logout fails, clear local storage and redirect
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };
  
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/chat')} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            </div>
          </div>
        </div>
  
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
            
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 capitalize">{key}</h3>
                    <p className="text-sm text-gray-500">Receive notifications for {key}</p>
                  </div>
                  <button
                    onClick={() => setNotifications({...notifications, [key]: !value})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
  
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>
            
            <div className="space-y-3">
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg text-gray-700">
                Change Password
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg text-gray-700">
                Export Chat Data
              </button>
              <button 
                onClick={handleLogout}
                disabled={loading}
                className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="h-4 w-4" />
                <span>{loading ? "Signing out..." : "Sign Out"}</span>
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg text-red-600">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default SettingsPage;
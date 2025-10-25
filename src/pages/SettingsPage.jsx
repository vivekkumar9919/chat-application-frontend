import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, Bell, Lock, Download, Trash2, Shield } from 'lucide-react'
import chatServices from '../main.service'
import Swal from "sweetalert2";
import ToastService from "../utility/toastService";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({ messages: true, groups: true });
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      Swal.fire({
        title: "Are you sure you want to logout?",
        showCancelButton: true,
        confirmButtonText: "Yes",
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
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
          ToastService.show("success", "Logged out successfully");
        }
      });

    } catch (error) {
      ToastService.show("error", "Error during logout");
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
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/chat')}
              className="p-2 hover:bg-gray-800 rounded-xl transition-all duration-200 cursor-pointer group"
            >
              <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
            </button>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Notifications Section */}
        <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
          </div>

          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200"
              >
                <div>
                  <h3 className="font-medium text-white capitalize">{key}</h3>
                  <p className="text-sm text-gray-400">Receive notifications for {key}</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, [key]: !value })}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 ${value ? 'bg-blue-600' : 'bg-gray-700'
                    }`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${value ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Account</h2>
          </div>

          <div className="space-y-2">
            <button className="w-full flex items-center space-x-3 p-4 hover:bg-gray-800 rounded-xl text-gray-300 hover:text-white transition-all duration-200 cursor-pointer group">
              <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                <Lock className="h-4 w-4 text-blue-400" />
              </div>
              <span className="font-medium">Change Password</span>
            </button>

            <button className="w-full flex items-center space-x-3 p-4 hover:bg-gray-800 rounded-xl text-gray-300 hover:text-white transition-all duration-200 cursor-pointer group">
              <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                <Download className="h-4 w-4 text-blue-400" />
              </div>
              <span className="font-medium">Export Chat Data</span>
            </button>

            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full flex items-center space-x-3 p-4 hover:bg-gray-800 rounded-xl text-gray-300 hover:text-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer group"
            >
              <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                <LogOut className="h-4 w-4 text-orange-400" />
              </div>
              <span className="font-medium">{loading ? "Signing out..." : "Sign Out"}</span>
            </button>

            <button className="w-full flex items-center space-x-3 p-4 hover:bg-gray-800 rounded-xl text-gray-300 hover:text-red-400 transition-all duration-200 cursor-pointer group">
              <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                <Trash2 className="h-4 w-4 text-red-400" />
              </div>
              <span className="font-medium">Delete Account</span>
            </button>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Privacy & Security</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700">
              <div>
                <h3 className="font-medium text-white">Last Seen</h3>
                <p className="text-sm text-gray-400">Show when you were last active</p>
              </div>
              <button className="relative inline-flex h-7 w-12 items-center rounded-full bg-blue-600 transition-all duration-200">
                <span className="inline-block h-5 w-5 transform rounded-full bg-white shadow-lg translate-x-6 transition-transform duration-200" />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700">
              <div>
                <h3 className="font-medium text-white">Read Receipts</h3>
                <p className="text-sm text-gray-400">Let others know when you've read their messages</p>
              </div>
              <button className="relative inline-flex h-7 w-12 items-center rounded-full bg-blue-600 transition-all duration-200">
                <span className="inline-block h-5 w-5 transform rounded-full bg-white shadow-lg translate-x-6 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
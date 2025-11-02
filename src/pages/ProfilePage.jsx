import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Edit, ArrowLeft, Camera, Mail, User, MessageSquare, Shield, Bell, Moon } from 'lucide-react'
import chatServices from "../main.service";
import STATUS_CODES from "../constants/statusCodes";
import ToastService from "../utility/toastService";

const ProfilePage = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Get user data from localStorage
        const user = localStorage.getItem('user');
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        
        if (!user || !isAuthenticated) {
            navigate('/login');
            return;
        }
        
        try {
            const userData = JSON.parse(user);
            setCurrentUser({
                id: userData.id,
                name: userData.username || userData.email,
                email: userData.email,
                avatar: userData.avatar 
            });
        } catch (error) {
            console.error('Error parsing user data:', error);
            navigate('/login');
        }
    }, [navigate]);

    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        bio: 'Love building great products!'
    });

    useEffect(() => {
        if (currentUser) {
            setProfileData({
                name: currentUser.name,
                email: currentUser.email,
                bio: 'Love building great products!'
            });
        }
    }, [currentUser]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            const res = await chatServices.updateProfilePic(formData);

            if (res.status_code === STATUS_CODES.OK) {
                ToastService.show('success', 'Profile picture updated successfully');
                const updatedUser = { ...JSON.parse(localStorage.getItem('user')), avatar: res.user.profile_pic };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setCurrentUser(prev => ({ ...prev, avatar: res.user.profile_pic }));
            }
        } catch (error) {
            ToastService.show('error', 'Failed to upload profile picture');
            console.error('Error uploading profile picture:', error);
        }
        finally{
            setLoading(false);
        }

        // Clear the input
        e.target.value = '';
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
        <div className="min-h-screen bg-gray-950">
            {/* Header */}
            <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={() => navigate('/chat')} 
                                className="p-2 hover:bg-gray-800 rounded-xl transition-all duration-200 cursor-pointer group"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                            </button>
                            <h1 className="text-2xl font-bold text-white">
                                Profile
                            </h1>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 cursor-pointer transition-all duration-200"
                        >
                            <Edit className="h-4 w-4" />
                            <span className="font-medium">{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Profile Card */}
                <div className="bg-gray-900 rounded-3xl shadow-2xl border border-gray-800 overflow-hidden mb-6">
                    {/* Cover */}
                    <div className="relative h-40 bg-blue-600">
                        <div className="absolute inset-0 bg-blue-700 opacity-50"></div>
                    </div>

                    <div className="px-8 pb-8">
                        {/* Avatar Section */}
                        <div className="flex items-end justify-between -mt-16 mb-8">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-blue-600 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition duration-300"></div>
                                <img 
                                    src={currentUser.avatar} 
                                    alt={currentUser.name} 
                                    className="relative w-32 h-32 rounded-full border-4 border-gray-900 object-cover group-hover:scale-105 transition-transform duration-300" 
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={loading}
                                    className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 p-3 rounded-full shadow-xl cursor-pointer transform hover:scale-110 transition-all duration-200 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                    ) : (
                                        <Camera className="h-5 w-5 text-white" />
                                    )}
                                </button>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                        </div>

                        {/* Profile Information */}
                        <div className="space-y-6">
                            {/* Name Field */}
                            <div className="group">
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-400 mb-3">
                                    <User className="h-4 w-4" />
                                    <span>Display Name</span>
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent text-white placeholder-gray-500 transition-all duration-200"
                                        placeholder="Enter your name"
                                    />
                                ) : (
                                    <div className="px-5 py-3.5 bg-gray-800 rounded-xl border border-gray-800">
                                        <p className="text-white font-medium text-lg">{profileData.name}</p>
                                    </div>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="group">
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-400 mb-3">
                                    <Mail className="h-4 w-4" />
                                    <span>Email Address</span>
                                </label>
                                <div className="px-5 py-3.5 bg-gray-800 rounded-xl border border-gray-800">
                                    <p className="text-gray-300">{profileData.email}</p>
                                </div>
                            </div>

                            {/* Bio Field */}
                            <div className="group">
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-400 mb-3">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>Bio</span>
                                </label>
                                {isEditing ? (
                                    <textarea
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                        rows={3}
                                        className="w-full px-5 py-3.5 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent text-white placeholder-gray-500 transition-all duration-200 resize-none"
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <div className="px-5 py-3.5 bg-gray-800 rounded-xl border border-gray-800">
                                        <p className="text-gray-300">{profileData.bio}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Save Button (only visible when editing) */}
                        {isEditing && (
                            <div className="mt-8 flex gap-3">
                                <button
                                    onClick={() => {
                                        // Handle save logic here
                                        setIsEditing(false);
                                        ToastService.show('success', 'Profile updated successfully');
                                    }}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-medium transition-all duration-200 cursor-pointer"
                                >
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Additional Settings Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-blue-600 transition-all duration-200 cursor-pointer group">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl mb-4 group-hover:bg-blue-600 transition-all duration-200">
                            <Shield className="h-6 w-6 text-blue-500 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-white font-medium mb-1">Privacy</h3>
                        <p className="text-gray-400 text-sm">Manage your privacy settings</p>
                    </div>

                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-blue-600 transition-all duration-200 cursor-pointer group">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl mb-4 group-hover:bg-blue-600 transition-all duration-200">
                            <Bell className="h-6 w-6 text-blue-500 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-white font-medium mb-1">Notifications</h3>
                        <p className="text-gray-400 text-sm">Configure notifications</p>
                    </div>

                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-blue-600 transition-all duration-200 cursor-pointer group">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl mb-4 group-hover:bg-blue-600 transition-all duration-200">
                            <Moon className="h-6 w-6 text-blue-500 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-white font-medium mb-1">Appearance</h3>
                        <p className="text-gray-400 text-sm">Customize your theme</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
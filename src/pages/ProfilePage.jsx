import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Edit, ArrowLeft } from 'lucide-react'
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

            if (res.status_code === STATUS_CODES.OK && res.profilePicUrl) {
                ToastService.show('success', 'Profile picture updated successfully');
                const updatedUser = { ...JSON.parse(localStorage.getItem('user')), avatar: res.profilePicUrl };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setCurrentUser(prev => ({ ...prev, avatar: res.profilePicUrl }));
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
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => navigate('/chat')} className="p-2 hover:bg-gray-100 rounded-lg">
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>

                    <div className="px-6 pb-6">
                        <div className="flex items-end justify-between -mt-16 mb-6">
                            <div className="relative group">
                                <img 
                                    src={currentUser.avatar} 
                                    alt={currentUser.name} 
                                    className="w-24 h-24 rounded-full border-4 border-white group-hover:opacity-75 transition-opacity" 
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 hover:bg-blue-600 p-2 rounded-full shadow-lg cursor-pointer"
                                >
                                    <Edit className="h-4 w-4 text-white" />
                                </button>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer"
                            >
                                <Edit className="h-4 w-4" />
                                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <p className="text-gray-900 font-medium">{profileData.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <p className="text-gray-900">{profileData.email}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                {isEditing ? (
                                    <textarea
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <p className="text-gray-900">{profileData.bio}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
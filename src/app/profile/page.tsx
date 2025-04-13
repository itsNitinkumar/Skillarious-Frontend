'use client';

import { useState, useEffect } from 'react';
import userService from '@/services/user.service';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Calendar, Image as ImageIcon } from 'lucide-react';
import { Profile } from '@/types';

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile>({
        name: '',
        email: '',
        phone: '',
        age: 0,
        gender: '',
        pfp: ''
    });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await userService.getProfile();
            setProfile(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await userService.updateProfile(profile);
            if (response.success) {
                toast.success('Profile updated successfully');
                setIsEditing(false);
                fetchProfile(); // Refresh profile data
            }
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white">You are not logged in.</div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-700">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                                My Profile
                            </h1>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                                    isEditing 
                                        ? 'bg-red-500 hover:bg-red-600' 
                                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                                } text-white font-semibold`}
                            >
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="flex items-center text-sm font-medium text-gray-300">
                                            <User className="w-4 h-4 mr-2" />
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profile.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter your name"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center text-sm font-medium text-gray-300">
                                            <Phone className="w-4 h-4 mr-2" />
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profile.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter phone number"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center text-sm font-medium text-gray-300">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            Age
                                        </label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={profile.age}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter your age"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center text-sm font-medium text-gray-300">
                                            <User className="w-4 h-4 mr-2" />
                                            Gender
                                        </label>
                                        <select
                                            name="gender"
                                            value={profile.gender}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center text-sm font-medium text-gray-300">
                                            <ImageIcon className="w-4 h-4 mr-2" />
                                            Profile Picture URL
                                        </label>
                                        <input
                                            type="text"
                                            name="pfp"
                                            value={profile.pfp}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter profile picture URL"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end mt-8">
                                    <button
                                        type="submit"
                                        className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-full transition-all duration-300"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center space-x-6">
                                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700">
                                        {profile.pfp ? (
                                            <img
                                                src={profile.pfp}
                                                alt={profile.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User className="w-12 h-12 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                                        <p className="text-gray-400">{profile.email}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                    <div className="bg-gray-700/50 p-4 rounded-lg">
                                        <p className="text-gray-400 text-sm">Phone</p>
                                        <p className="text-white">{profile.phone || 'Not provided'}</p>
                                    </div>
                                    <div className="bg-gray-700/50 p-4 rounded-lg">
                                        <p className="text-gray-400 text-sm">Age</p>
                                        <p className="text-white">{profile.age || 'Not provided'}</p>
                                    </div>
                                    <div className="bg-gray-700/50 p-4 rounded-lg">
                                        <p className="text-gray-400 text-sm">Gender</p>
                                        <p className="text-white">{profile.gender || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


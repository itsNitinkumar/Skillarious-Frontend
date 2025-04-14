'use client';

import { useState, useEffect } from 'react';
import userService from '@/services/user.service';
import educatorService from '@/services/educator.service';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Calendar, Image as ImageIcon, BookOpen } from 'lucide-react';
import { Profile } from '@/types';
import Image from 'next/image';

interface EducatorFields {
    bio: string;
    about: string;
    doubtOpen: boolean;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile>({
        name: '',
        email: '',
        phone: '',
        age: 0,
        gender: '',
        pfp: ''
    });
    const [educatorFields, setEducatorFields] = useState<EducatorFields>({
        bio: '',
        about: '',
        doubtOpen: false
    });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            fetchProfiles();
        }
    }, [user]);

    const fetchProfiles = async () => {
        try {
            setLoading(true);
            const userProfileResponse = await userService.getProfile();
            setProfile(userProfileResponse.data);

            if (user?.isEducator) {
                const educatorProfileResponse = await educatorService.getEducatorProfile();
                if (educatorProfileResponse.success) {
                    setEducatorFields(educatorProfileResponse.data);
                }
            }
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
            const profileData = {
                name: profile.name,
                phone: profile.phone || null,  // Send null if empty
                gender: profile.gender || null, // Send null if empty
                age: profile.age || null,      // Send null if empty
                pfp: profile.pfp || null       // Send null if empty
            };

            console.log('Sending profile data:', profileData); // Debug log

            const userProfileResponse = await userService.updateProfile(profileData);
            
            if (!userProfileResponse.success) {
                throw new Error(userProfileResponse.message || 'Failed to update user profile');
            }

            // If user is educator, update educator profile
            if (user?.isEducator) {
                const educatorData = {
                    bio: educatorFields.bio || '',
                    about: educatorFields.about || '',
                    doubtOpen: educatorFields.doubtOpen
                };
                
                console.log('Sending educator data:', educatorData); // Debug log
                
                const educatorProfileResponse = await educatorService.updateEducatorProfile(educatorData);
                if (!educatorProfileResponse.success) {
                    throw new Error('Failed to update educator profile');
                }
            }

            toast.success('Profile updated successfully');
            setIsEditing(false);
            await fetchProfiles();
        } catch (error: any) {
            console.error('Profile update error:', error?.response?.data || error);
            toast.error(error?.response?.data?.message || error.message || 'Failed to update profile');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (['bio', 'about'].includes(name)) {
            setEducatorFields(prev => ({
                ...prev,
                [name]: value
            }));
        } else {
            setProfile(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleToggleAvailability = async () => {
        try {
            const response = await educatorService.toggleDoubtAvailability();
            if (response.success) {
                setEducatorFields(prev => ({ ...prev, doubtOpen: response.data.doubtOpen }));
                toast.success(`Availability ${response.data.doubtOpen ? 'enabled' : 'disabled'}`);
            }
        } catch (error) {
            toast.error('Failed to toggle availability');
        }
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
                        {/* Add profile picture section */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative w-32 h-32 mb-4">
                                <Image
                                    src={profile.pfp || "https://avatar.iran.liara.run/public"}
                                    alt={profile.name}
                                    fill
                                    className="rounded-full object-cover border-4 border-gray-700"
                                />
                            </div>
                            <h2 className="text-xl text-white font-semibold">{profile.name}</h2>
                            <p className="text-gray-400">{profile.email}</p>
                        </div>

                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                                My Profile
                            </h1>
                            <div className="flex gap-4">
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
                                {user.isEducator && (
                                    <button
                                        onClick={handleToggleAvailability}
                                        className={`px-6 py-2 rounded-full transition-all duration-300 ${
                                            educatorFields.doubtOpen 
                                                ? 'bg-green-500 hover:bg-green-600' 
                                                : 'bg-red-500 hover:bg-red-600'
                                        } text-white font-semibold`}
                                    >
                                        {educatorFields.doubtOpen ? 'Available' : 'Unavailable'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Existing profile fields */}
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

                                {/* Educator-specific fields */}
                                {user.isEducator && (
                                    <div className="space-y-6 mt-6">
                                        <div className="space-y-2">
                                            <label className="flex items-center text-sm font-medium text-gray-300">
                                                <BookOpen className="w-4 h-4 mr-2" />
                                                Bio
                                            </label>
                                            <textarea
                                                name="bio"
                                                value={educatorFields.bio}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter your bio"
                                                rows={3}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="flex items-center text-sm font-medium text-gray-300">
                                                <BookOpen className="w-4 h-4 mr-2" />
                                                About
                                            </label>
                                            <textarea
                                                name="about"
                                                value={educatorFields.about}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Tell us more about yourself"
                                                rows={5}
                                            />
                                        </div>
                                    </div>
                                )}

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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-700/50 p-4 rounded-lg">
                                        <p className="text-gray-400 text-sm">Name</p>
                                        <p className="text-white">{profile.name}</p>
                                    </div>
                                    <div className="bg-gray-700/50 p-4 rounded-lg">
                                        <p className="text-gray-400 text-sm">Email</p>
                                        <p className="text-white">{profile.email}</p>
                                    </div>
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

                                {user.isEducator && (
                                    <div className="space-y-6 mt-6">
                                        <div className="bg-gray-700/50 p-4 rounded-lg">
                                            <p className="text-gray-400 text-sm">Bio</p>
                                            <p className="text-white">{educatorFields.bio || 'No bio added yet.'}</p>
                                        </div>
                                        <div className="bg-gray-700/50 p-4 rounded-lg">
                                            <p className="text-gray-400 text-sm">About</p>
                                            <p className="text-white">{educatorFields.about || 'No about information added yet.'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}






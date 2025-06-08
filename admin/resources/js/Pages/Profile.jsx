import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import DynamicTitleLayout from '@/Layouts/DynamicTitleLayout';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const Profile = () => {
    const { auth } = usePage().props;
    const [profileData, setProfileData] = useState({
        admin_id: '',
        name: auth?.user?.name || '',
        address: '',
        contact: '',
        email: '',
        password: '••••••',
        role: '',
        profile_picture: null
    });

    const [isEditing, setIsEditing] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const initializeProfile = async () => {
            try {
                // First get CSRF cookie
                await axios.get('/sanctum/csrf-cookie');
                
                // Check authentication status
                const authCheck = await axios.get('/api/check-auth');
                if (!authCheck.data.authenticated) {
                    router.visit('/');
                    return;
                }

                // Set token in axios headers
                const token = authCheck.data.token;
                if (token) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }

                // Now fetch profile data
                await fetchProfileData();
            } catch (error) {
                console.error('Initialization error:', error);
                if (error.response?.status === 401) {
                    router.visit('/');
                } else {
                    setMessage({ 
                        type: 'error', 
                        text: 'Failed to initialize profile. Please refresh the page.' 
                    });
                }
            }
        };

        if (!auth?.user) {
            router.visit('/');
            return;
        }

        initializeProfile();
    }, [auth]);

    const fetchProfileData = async () => {
        try {
            const response = await axios.get('/api/admin/profile');
            if (response.data) {
                setProfileData(response.data);
                if (response.data.profile_picture) {
                    setPreviewImage(response.data.profile_picture);
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            if (error.response?.status === 401) {
                router.visit('/');
            } else {
                setMessage({ 
                    type: 'error', 
                    text: 'Failed to load profile data. Please refresh the page.' 
                });
            }
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type and size
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                setMessage({ type: 'error', text: 'Please upload a valid image file (JPEG, PNG, or GIF)' });
                return;
            }
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                setMessage({ type: 'error', text: 'Image size should be less than 2MB' });
                return;
            }

            setProfileData({ ...profileData, profile_picture: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            
            // Add all profile data to formData except password and profile_picture
            Object.keys(profileData).forEach(key => {
                if (key !== 'password' && key !== 'profile_picture') {
                    formData.append(key, profileData[key]);
                }
            });

            // Handle profile picture separately
            if (profileData.profile_picture instanceof File) {
                formData.append('profile_picture', profileData.profile_picture);
            }

            const response = await axios.post('/api/admin/profile/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
            });

            if (response.data.success) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setIsEditing(false);
                
                // Refresh profile data
                const updatedProfile = await axios.get('/api/admin/profile');
                setProfileData(prev => ({
                    ...prev,
                    ...updatedProfile.data,
                    profile_picture: null // Reset the file input
                }));
                if (updatedProfile.data.profile_picture) {
                    setPreviewImage(updatedProfile.data.profile_picture + '?t=' + new Date().getTime());
                }
            } else {
                throw new Error(response.data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Failed to update profile. Please try again.' 
            });
        }
    };

    return (
        <DynamicTitleLayout userRole="admin">
            <div className="min-h-screen bg-[#60B5FF] font-[Poppins]">
                {/* Sidebar */}
                <div className="fixed left-0 top-0 h-full w-[240px] bg-white shadow-lg transform transition-transform duration-200 lg:translate-x-0 md:translate-x-0 -translate-x-full flex flex-col">
                    <div className="p-3 flex-shrink-0">
                        <img src="https://i.postimg.cc/fTdMBwmQ/hermosa-logo.png" alt="Logo" className="w-50 h-50 mx-auto mb-3" />
                    </div>
                    <nav className="flex flex-col flex-1 overflow-y-auto">
                        <div className="flex-1 pb-4">
                            <Link href="/admin/dashboard" className={`flex items-center px-6 py-3 text-base ${window.location.pathname === '/admin/dashboard' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                                <span className="material-symbols-outlined mr-3">dashboard</span>
                                Dashboard
                            </Link>
                            <Link href="/admin/announcement" className={`flex items-center px-6 py-3 text-base ${window.location.pathname === '/admin/announcement' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                                <span className="material-symbols-outlined mr-3">campaign</span>
                                Announcement
                            </Link>
                            <Link href="/admin/accounts" className={`flex items-center px-6 py-3 text-base ${window.location.pathname === '/admin/accounts' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                                <span className="material-symbols-outlined mr-3">manage_accounts</span>
                                Manage Accounts
                            </Link>
                            <Link href="/admin/rate-management" className={`flex items-center px-6 py-3 text-base ${window.location.pathname === '/admin/rate-management' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                                <span className="material-symbols-outlined mr-3">price_change</span>
                                Rate Management
                            </Link>
                            <Link href="/admin/payment" className={`flex items-center px-6 py-3 text-base ${window.location.pathname === '/admin/payment' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                                <span className="material-symbols-outlined mr-3">payments</span>
                                Payment
                            </Link>
                            <Link href="/admin/reports" className={`flex items-center px-6 py-3 text-base ${window.location.pathname === '/admin/reports' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                                <span className="material-symbols-outlined mr-3">description</span>
                                Reports
                            </Link>
                            <Link href="/admin/tickets" className={`flex items-center px-6 py-3 text-base ${window.location.pathname === '/admin/tickets' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                                <span className="material-symbols-outlined mr-3">confirmation_number</span>
                                Tickets
                            </Link>
                            <Link href="/admin/profile" className={`flex items-center px-6 py-3 text-base ${window.location.pathname === '/admin/profile' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                                <span className="material-symbols-outlined mr-3">person</span>
                                Profile
                            </Link>
                        </div>
                        <div className="flex-shrink-0">
                            <button
                                onClick={async () => {
                                    if (window.confirm('Are you sure you want to log out?')) {
                                        try {
                                            await axios.get('/sanctum/csrf-cookie');
                                            await axios.post('/admin/logout');
                                            window.location.href = '/';
                                        } catch (error) {
                                            window.location.href = '/';
                                        }
                                    }
                                }}
                                className="flex items-center px-6 py-3 text-base text-gray-600 hover:text-red-600 hover:bg-red-50 w-full text-left"
                            >
                                <span className="material-symbols-outlined mr-3">logout</span>
                                Logout
                            </button>
                        </div>
                    </nav>
                </div>

                {/* Mobile Header */}
                <div className="lg:hidden md:hidden fixed top-0 left-0 right-0 bg-white h-16 flex items-center justify-between px-4 z-20">
                    <button className="text-gray-600 hover:text-gray-800">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <img src="https://i.postimg.cc/fTdMBwmQ/hermosa-logo.png" alt="Logo" className="h-10" />
                    <div></div>
                </div>

                {/* Main Content */}
                <div className="lg:ml-64 md:ml-64 sm:ml-0 p-4 lg:p-8 md:p-8 pt-20 lg:pt-8 md:pt-8">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-2xl font-semibold mb-8">Profile</h1>

                        {message.text && (
                            <div className={`p-4 mb-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="bg-white rounded-lg shadow p-4 lg:p-6 md:p-6">
                            <div className="flex flex-col lg:flex-row md:flex-row items-center lg:items-start md:items-start gap-8">
                                {/* Profile Picture Section */}
                                <div className="flex flex-col items-center w-full lg:w-auto md:w-auto">
                                    <div className="relative">
                                        <img
                                            src={previewImage || `https://ui-avatars.com/api/?name=${profileData.name}&background=0D8ABC&color=fff&size=200`}
                                            alt="Profile"
                                            className="w-48 h-48 rounded-full object-cover"
                                        />
                                        {isEditing && (
                                            <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
                                                <span className="material-symbols-outlined">edit</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                        )}
                                    </div>
                                    {isEditing ? (
                                        <div className="mt-4 flex flex-col lg:flex-row md:flex-row gap-2">
                                            <button
                                                onClick={handleSubmit}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full lg:w-auto md:w-auto"
                                            >
                                                Save Changes
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 w-full lg:w-auto md:w-auto"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full lg:w-auto md:w-auto"
                                        >
                                            Edit Profile
                                        </button>
                                    )}
                                </div>

                                {/* Profile Details */}
                                <div className="flex-1 space-y-4 w-full">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Admin ID</label>
                                            <input
                                                type="text"
                                                value={profileData.admin_id}
                                                className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50"
                                                disabled
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={profileData.name}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full rounded-lg border-gray-300"
                                                disabled={!isEditing}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Address</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={profileData.address}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full rounded-lg border-gray-300"
                                                disabled={!isEditing}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                                            <input
                                                type="text"
                                                name="contact"
                                                value={profileData.contact}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full rounded-lg border-gray-300"
                                                disabled={!isEditing}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={profileData.email}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full rounded-lg border-gray-300"
                                                disabled={!isEditing}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Role</label>
                                            <input
                                                type="text"
                                                value={profileData.role}
                                                className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DynamicTitleLayout>
    );
};

export default Profile; 
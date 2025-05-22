import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';

const accounts = [
    { uid: 124, name: 'Daniel Ricciardo', address: 'Bataan', accountNumber: '12352689' },
    { uid: 125, name: 'Arthur Morgan', address: 'Bataan', accountNumber: '52367378' },
    { uid: 126, name: 'Alex Albon', address: 'Bataan', accountNumber: '97832064' },
    { uid: 127, name: 'Zhou Guonyou', address: 'Bataan', accountNumber: '32671893' },
    { uid: 128, name: 'Olie Bearman', address: 'Bataan', accountNumber: '97442351' },
    { uid: 129, name: 'Max Verstappen', address: 'Bataan', accountNumber: '43672643' },
];

const iconStyle = {
    cursor: 'pointer',
    margin: '0 6px',
    fontSize: '18px',
};

const Accounts = () => {
    const { auth } = usePage().props;
    const [profilePicture, setProfilePicture] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get('/api/admin/profile');
                if (response.data && response.data.profile_picture) {
                    setProfilePicture(response.data.profile_picture);
                }
            } catch (error) {
                // ignore error for now
            }
        };
        fetchProfileData();
    }, []);

    return (
        <div className="min-h-screen bg-[#60B5FF] font-[Poppins] overflow-x-hidden">
            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-full w-[240px] bg-white shadow-lg transform transition-transform duration-200 lg:translate-x-0 md:translate-x-0 -translate-x-full">
                <div className="p-3">
                    <img src="https://i.postimg.cc/fTdMBwmQ/hermosa-logo.png" alt="Logo" className="w-50 h-50 mx-auto mb-3" />
                </div>
                <nav className="mt-4">
                    <Link href="/admin/dashboard" className="flex items-center px-6 py-3 text-base text-gray-600 hover:bg-gray-50">
                        <span className="material-symbols-outlined mr-3">dashboard</span>
                        Dashboard
                    </Link>
                    <Link href="/admin/announcement" className="flex items-center px-6 py-3 text-base text-gray-600 hover:bg-gray-50">
                        <span className="material-symbols-outlined mr-3">campaign</span>
                        Announcement
                    </Link>
                    <Link href="/admin/accounts" className="flex items-center px-6 py-3 text-base text-blue-600 bg-blue-50">
                        <span className="material-symbols-outlined mr-3">manage_accounts</span>
                        Manage Accounts
                    </Link>
                    <Link href="/admin/reports" className="flex items-center px-6 py-3 text-base text-gray-600 hover:bg-gray-50">
                        <span className="material-symbols-outlined mr-3">description</span>
                        Reports
                    </Link>
                    <Link href="/admin/tickets" className="flex items-center px-6 py-3 text-base text-gray-600 hover:bg-gray-50">
                        <span className="material-symbols-outlined mr-3">confirmation_number</span>
                        Tickets
                    </Link>
                    <Link href="/admin/profile" className="flex items-center px-6 py-3 text-base text-gray-600 hover:bg-gray-50">
                        <span className="material-symbols-outlined mr-3">person</span>
                        Profile
                    </Link>
                    <button
                        onClick={async () => {
                            try {
                                await axios.get('/sanctum/csrf-cookie');
                                await axios.post('/admin/logout');
                                window.location.href = '/';
                            } catch (error) {
                                window.location.href = '/';
                            }
                        }}
                        className="flex items-center px-6 py-3 text-base text-red-600 hover:bg-red-50 w-full text-left"
                    >
                        <span className="material-symbols-outlined mr-3">logout</span>
                        Logout
                    </button>
                </nav>
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-white h-14 flex items-center justify-between px-4 z-20">
                <button className="text-gray-600 hover:text-gray-800">
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <img src="https://i.postimg.cc/fTdMBwmQ/hermosa-logo.png" alt="Logo" className="h-8" />
                <div></div>
            </div>

            {/* Main Content */}
            <div className="lg:ml-[240px] p-3 sm:p-4 md:p-6 lg:p-6 pt-16 lg:pt-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                    <h1 className="text-xl font-semibold">Manage Accounts</h1>
                    <div className="flex items-center w-full sm:w-auto gap-2">
                        <div className="relative flex-1 sm:flex-none mr-3">
                            <span className="material-symbols-outlined absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">search</span>
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full sm:w-auto pl-8 pr-3 py-1.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <Link href="/admin/profile">
                            <img 
                                src={profilePicture || `https://ui-avatars.com/api/?name=${auth?.user?.name || 'Admin'}&background=0D8ABC&color=fff`}
                                alt="Profile" 
                                className="w-8 h-8 rounded-full cursor-pointer hover:opacity-80 transition-opacity object-cover"
                            />
                        </Link>
                    </div>
                </div>

                {/* Accounts Table */}
                <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-4xl mx-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2 px-4 font-semibold">uid</th>
                                <th className="py-2 px-4 font-semibold">Name</th>
                                <th className="py-2 px-4 font-semibold">Address</th>
                                <th className="py-2 px-4 font-semibold">Account Number</th>
                                <th className="py-2 px-4 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map((acc) => (
                                <tr key={acc.uid} className="border-b hover:bg-blue-50">
                                    <td className="py-2 px-4">{acc.uid}</td>
                                    <td className="py-2 px-4">{acc.name}</td>
                                    <td className="py-2 px-4">{acc.address}</td>
                                    <td className="py-2 px-4">{acc.accountNumber}</td>
                                    <td className="py-2 px-4 flex items-center">
                                        <span style={iconStyle} title="Edit" role="img" aria-label="edit">✏️</span>
                                        <span style={iconStyle} title="Delete" role="img" aria-label="delete">🗑️</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Accounts; 
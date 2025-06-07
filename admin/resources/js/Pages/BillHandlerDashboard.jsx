import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '@/Layouts/AdminLayout';

const BillHandlerDashboard = () => {
    const [staffName, setStaffName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                const response = await axios.get('/api/bill-handler/bill-handler-dashboard');
                console.log('API Response:', response.data); // Debug log
                
                if (response.data.success) {
                    setStaffName(response.data.data.staff.name);
                } else {
                    setError(response.data.message || 'Failed to load data');
                }
            } catch (error) {
                console.error('Error details:', error.response?.data || error); // Debug log
                setError(error.response?.data?.message || 'Failed to load data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchStaffData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <AdminLayout>
            <div className="p-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Hello, {staffName}!</h1>
                    <p className="text-xl text-gray-600">Welcome to your Bill Handler Dashboard</p>
                </div>
            </div>
        </AdminLayout>
    );
};

export default BillHandlerDashboard; 
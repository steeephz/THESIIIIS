import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BillHandlerLayout from '@/Layouts/BillHandlerLayout';
import DynamicTitleLayout from '@/Layouts/DynamicTitleLayout';
import { Link } from '@inertiajs/react';

const BillHandlerDashboard = () => {
    const [staffName, setStaffName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dashboardStats, setDashboardStats] = useState({
        pendingPayments: 0,
        disconnectionCount: 0,
        monthlyPayments: 0,
        overdueAccounts: 0
    });

    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                const response = await axios.get('/api/bill-handler/bill-handler-dashboard');
                console.log('API Response:', response.data); // Debug log
                
                if (response.data.success) {
                    setStaffName(response.data.data.staff.name);
                    // In a real application, you would get these values from the API
                    setDashboardStats({
                        pendingPayments: 15,
                        disconnectionCount: 8,
                        monthlyPayments: 45000,
                        overdueAccounts: 12
                    });
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

    const StatCard = ({ title, value, icon, link, bgColor, textColor }) => (
        <Link
            href={link}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm mb-1">{title}</p>
                    <p className="text-2xl font-bold">
                        {typeof value === 'number' && title.includes('Payments') 
                            ? `₱${value.toLocaleString()}`
                            : value}
                    </p>
                </div>
                <div className={`${bgColor} ${textColor} p-4 rounded-full`}>
                    <span className="material-symbols-outlined text-2xl">{icon}</span>
                </div>
            </div>
        </Link>
    );

    if (loading) {
        return (
            <DynamicTitleLayout userRole="bill handler">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </DynamicTitleLayout>
        );
    }

    if (error) {
        return (
            <DynamicTitleLayout userRole="bill handler">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                </div>
            </DynamicTitleLayout>
        );
    }

    return (
        <DynamicTitleLayout userRole="bill handler">
            <BillHandlerLayout>
                <div className="p-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Payments Awaiting Confirmation"
                            value={dashboardStats.pendingPayments}
                            icon="pending_actions"
                            link="/bill-handler/pending-payments"
                            bgColor="bg-blue-100"
                            textColor="text-blue-600"
                        />
                        <StatCard
                            title="Marked for Disconnection"
                            value={dashboardStats.disconnectionCount}
                            icon="warning"
                            link="/bill-handler/disconnections"
                            bgColor="bg-red-100"
                            textColor="text-red-600"
                        />
                        <StatCard
                            title="Total Payments This Month"
                            value={dashboardStats.monthlyPayments}
                            icon="payments"
                            link="/bill-handler/monthly-payments"
                            bgColor="bg-green-100"
                            textColor="text-green-600"
                        />
                        <StatCard
                            title="Overdue Accounts"
                            value={dashboardStats.overdueAccounts}
                            icon="schedule"
                            link="/bill-handler/overdue"
                            bgColor="bg-orange-100"
                            textColor="text-orange-600"
                        />
                    </div>
                </div>
            </BillHandlerLayout>
        </DynamicTitleLayout>
    );
};

export default BillHandlerDashboard; 
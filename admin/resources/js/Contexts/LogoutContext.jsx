import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import ConfirmDialog from '@/Components/ConfirmDialog';

const LogoutContext = createContext();

export const LogoutProvider = ({ children }) => {
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    useEffect(() => {
        const handleLogoutClick = (e) => {
            const logoutButton = e.target.closest('[data-logout]');
            if (logoutButton) {
                e.preventDefault();
                setShowLogoutConfirm(true);
            }
        };

        document.addEventListener('click', handleLogoutClick);
        return () => document.removeEventListener('click', handleLogoutClick);
    }, []);

    const handleConfirmLogout = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie');
            await axios.post('/admin/logout');
            window.location.href = '/';
        } catch (error) {
            window.location.href = '/';
        }
    };

    const handleCancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    return (
        <LogoutContext.Provider value={{}}>
            {children}
            <ConfirmDialog
                isOpen={showLogoutConfirm}
                message="Are you sure you want to log out?"
                onConfirm={handleConfirmLogout}
                onCancel={handleCancelLogout}
            />
        </LogoutContext.Provider>
    );
};

export const useLogout = () => {
    const context = useContext(LogoutContext);
    if (!context) {
        throw new Error('useLogout must be used within a LogoutProvider');
    }
    return context;
}; 
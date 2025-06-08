import React from 'react';
import { Head } from '@inertiajs/react';
import Footer from '../Components/Footer';

const DynamicTitleLayout = ({ children, userRole }) => {
    const getTitle = () => {
        switch (userRole) {
            case 'admin':
                return 'Admin Panel';
            case 'bill handler':
                return 'Bill Handler Panel';
            default:
                return 'Staff Panel';
        }
    };

    return (
        <>
            <Head title={getTitle()} />
            <div className="flex flex-col min-h-screen">
                {children}
                <Footer />
            </div>
        </>
    );
};

export default DynamicTitleLayout; 
import React from 'react';
import { Head } from '@inertiajs/react';

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
            {children}
        </>
    );
};

export default DynamicTitleLayout; 
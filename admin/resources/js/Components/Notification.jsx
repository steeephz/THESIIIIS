import React, { useEffect } from 'react';

const Notification = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700';
    const icon = type === 'success' ? 'check_circle' : 'error';

    return (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${bgColor} shadow-lg flex items-center`}>
            <span className="material-symbols-outlined mr-2">{icon}</span>
            <p>{message}</p>
            <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700">
                <span className="material-symbols-outlined">close</span>
            </button>
        </div>
    );
};

export default Notification; 
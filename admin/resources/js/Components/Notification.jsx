import React from 'react';

const Notification = ({ message, type = 'success', onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const borderColor = type === 'success' ? 'border-green-400' : 'border-red-400';

  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} border ${borderColor} ${textColor} px-4 py-3 rounded z-50 flex items-center justify-between`}
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
      <button
        onClick={onClose}
        className={`${textColor} hover:opacity-75 ml-4`}
      >
        <span className="text-2xl">&times;</span>
      </button>
    </div>
  );
};

export default Notification; 
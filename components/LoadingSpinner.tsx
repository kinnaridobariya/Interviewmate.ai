
import React from 'react';

const LoadingSpinner: React.FC<{ size?: number }> = ({ size = 8 }) => {
    return (
        <div className={`w-${size} h-${size} border-4 border-slate-500 border-t-blue-500 border-solid rounded-full animate-spin`}></div>
    );
};

export default LoadingSpinner;

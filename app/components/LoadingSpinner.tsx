"use client";

import React from 'react';

function LoadingSpinner() {
    return (
        <div className="mt-1 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
    );
}

export default LoadingSpinner;

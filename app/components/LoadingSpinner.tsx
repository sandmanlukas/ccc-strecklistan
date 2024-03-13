"use client";

import { Spinner } from '@nextui-org/react';
import React from 'react';

function LoadingSpinner() {
    return (
        <div className="m-auto h-auto ">
            <Spinner size="lg"/>
        </div>
    );
}

export default LoadingSpinner;

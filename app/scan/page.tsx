"use client";

import React, { useState, useEffect } from 'react'
import { handleScan } from '@/app/lib/utils';

export default function ScanPage() {
    const [scannedData, setScannedData] = useState<string | null>(null);


    useEffect(() => {
        let code = "";
        let reading = false;

        const handleScanEvent = handleScan(code, reading, setScannedData);


        document.addEventListener('keydown', handleScanEvent);

        return () => {
            document.removeEventListener('keydown', handleScanEvent);
        }

    }, [scannedData]);

    return (
        <div>
            <h1>Scan Page</h1>
            <p>Scanned data: {scannedData}</p>
        </div>
    );
}
"use client";

import React from 'react';
import Link from 'next/link';

function Unauthorized() {
    return (
        <div className="container mx-auto text-center p-10">
        <h1 className="text-2xl font-bold mb-4">Obehörig åtkomst</h1>
        <p className="mb-6">Här får du inte vara...</p>
        <Link
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          href={'/'}
          as={'/'}
        >
          Tillbaka
        </Link>
      </div>
    );
}

export default Unauthorized;
"use client";

import { User } from '@prisma/client';
import Link from 'next/link';
import React from 'react';

export default function DebtHighScore({ users }: { users: User[] }) {
    const sortedUsers = users.sort((a, b) => b.debt - a.debt).slice(0, 5);

    return (
        <div className='ml-4'>
            <h3 className='text-2xl ml-2 mt-2 font-bold'>Skuldtopplista</h3>
            <div className='flex flex-col items-start mt-2'>
                {sortedUsers.length > 0 ? (
                    sortedUsers.map((user, index) => (
                        <div key={user.id} className='flex items-center justify-between w-96 bg-white shadow-md rounded-lg p-2 mb-2 border border-grey'>
                            <Link href={`user/${user.id}`} ><h3 className='text-lg font-medium'>{index + 1}. {user.username}</h3></Link>
                            <p className='text-base text-slate-600'>{user.debt} kr</p>
                        </div>
                    ))) :
                    (
                        <div className='flex items-center justify-between w-96 bg-white shadow-md rounded-lg p-2 mb-2 border border-grey'>
                            <h3 className='text-lg font-medium'>Ingen data än. Strecka något.</h3>
                        </div>
                    )}
            </div>
        </div>
    );
}


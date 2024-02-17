
"use client";
// components/SignIn.js
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Input } from "@nextui-org/react";

export default function SignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Attempt to sign in'

        const response = await signIn('credentials', {
            redirect: false, // Prevents redirecting to avoid losing state in this demo
            username,
            password,
            // callbackUrl: '/', // Ensure the callback URL is always the user page
        });
        if (response && response.error) {
            console.log(response);

            toast.error(response.error);
            return;
        } else {
            router.push('/');
        }


    };

    return (
        <div className='w-full mt-40 max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md'>
            <h2 className='text-center text-2xl font-bold text-gray-900'>Logga in</h2>
            <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='mb-2'>
                    <Input label="Användarnamn" type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <Input label="Lösenord" type='password' value={password} onChange={(e) => setPassword(e.target.value)} />

                </div>
                <button className='w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center' type="submit">Logga in</button>
            </form>
        </div>
    );
};


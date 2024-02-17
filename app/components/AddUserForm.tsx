"use client";
import { Input, Select, SelectItem } from '@nextui-org/react';
// components/AddUserForm.js
import { useState } from 'react';
import { UserRole } from '@prisma/client';
import { positionLabels } from '@/app/lib/utils';

export default function AddUserForm() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'Ordförande', // Default role
    });

    const userRoles = Object.values(UserRole).map((type) => {
        return positionLabels[type];
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Here you would usually send formData to your backend/API to add the new user
        console.log(formData);
        // Reset form or give feedback to the user
    };

    return (
        <div className='mx-auto my-20 bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md'>
                <h2 className='text-center text-2xl font-bold text-gray-900'>Lägg till användare</h2>
                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div>
                        <Input
                            type="text"
                            id="username"
                            name="username"
                            label="Användarnamn"
                            aria-label='Användarnamn'
                            value={formData.username}
                            onChange={handleChange}
                            isRequired
                            required
                        />
                    </div>
                    <div>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            label="E-mail"
                            aria-label='E-mail'
                            value={formData.email}
                            onChange={handleChange}
                            isRequired
                            required
                        />
                    </div>
                    <div>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            label="Lösenord"
                            aria-label='Lösenord'
                            value={formData.password}
                            onChange={handleChange}
                            isRequired
                            required
                        />
                    </div>
                    <div>
                        <Select
                            id="position"
                            name="position"
                            value={formData.role}
                            placeholder='Ordförande'
                            label="Position"
                            aria-label='Position'
                            onChange={handleChange}
                            required    
                            isRequired
                        >
                            {
                                userRoles.map((role) => (
                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                ))
                            }
                        </Select>
                    </div>
                    <button
                        type="submit"
                        className='w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
                    >
                        Lägg till
                    </button>
                </form>
            </div>
        </div>
    );
};

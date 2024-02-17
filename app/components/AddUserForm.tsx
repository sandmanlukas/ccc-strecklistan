"use client";
import { Input, Select, SelectItem } from '@nextui-org/react';
// components/AddUserForm.js
import { useState } from 'react';
import { UserRole } from '@prisma/client';
import { positionLabels, roleStringToUserRole } from '@/app/lib/utils';
import { toast } from 'react-toastify';
import { clear } from 'console';
import { addUser } from '../lib/addUser';

export default function AddUserForm() {
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        role: 'Ordförande', // Default role
    });

    const userRoles = Object.values(UserRole).map((type) => {
        return positionLabels[type];
    });

    function clearFormState() {
        setFormData({
            username: '',
            firstName: '',
            lastName: '',
            email: '',
            role: 'Ordförande', // Default role
        });
    }

    function validateForm() {
        const { username, firstName, lastName, email } = formData;

        // Basic validation to check if the fields are not empty
        if (!username.trim()) {
            toast.error('Användarnamn får inte vara tomt');
            return;
        }
        if (!firstName.trim()) {
            toast.error('Förnamn får inte vara tomt');
            return;
        }
        if (!lastName.trim()) {
            toast.error('Efternamn får inte vara tomt');
            return;
        }
        if (!email.trim()) {
            toast.error('E-mail får inte vara tomt');
            return;
        }
        return true;
    }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };



    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate the form
        if (!validateForm()) {
            clearFormState();
            return;
        }

        const { username, firstName, lastName, email, role } = formData;
        const user = {
            username,
            firstName,
            lastName,
            email,
            role: roleStringToUserRole[role],
        }
        const dbUser = await addUser(user);

        if (!dbUser) {
            toast.error('Något gick fel');
            return;
        }
        toast.success(`${user.username} har lagts till!`);

        // Reset form or give feedback to the user
        clearFormState();
    };

    return (
        <div className='mx-auto my-20 bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-9 bg-white rounded-lg shadow-md'>
                <h2 className='text-center text-2xl font-bold text-gray-900'>Lägg till användare</h2>
                <form onSubmit={handleSubmit} className='space-y-9'>
                    <div>
                        <Input
                            type="text"
                            id="username"
                            name="username"
                            label="Användarnamn"
                            labelPlacement='outside'
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
                            labelPlacement='outside'
                            aria-label='E-mail'
                            value={formData.email}
                            onChange={handleChange}
                            isRequired
                            required
                        />
                    </div>
                    <div>
                        <Input
                            type="text"
                            id="firstName"
                            name="firstName"
                            aria-label='Förnamn'
                            label="Förnamn"
                            labelPlacement='outside'
                            value={formData.firstName}
                            onChange={handleChange}
                            isRequired
                            required
                        />
                    </div>
                    <div>
                        <Input
                            type="text"
                            id="lastName"
                            name="lastName"
                            aria-label='Efternamn'
                            label="Efternamn"
                            labelPlacement='outside'
                            value={formData.lastName}
                            onChange={handleChange}
                            isRequired
                            required
                        />
                    </div>
                    <div>
                        <Select
                            id="role"
                            name="role"
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

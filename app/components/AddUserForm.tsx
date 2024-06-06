"use client";

import React, { useState } from 'react';
import { Avatar, Button, Input, Select, SelectItem } from '@nextui-org/react';
import Webcam from 'react-webcam';
import { UserRole } from '@prisma/client';
import { base64toFile, positionLabels, roleStringToUserRole } from '@/app/lib/utils';
import { toast } from 'react-toastify';
import { addUser } from '@/app/lib/addUser';
import type { PutBlobResult } from '@vercel/blob';
import { DEFAULT_AVATAR_URL } from '@/app/constants';
import NextUIContainer from './NextUIContainer';

export default function AddUserForm() {
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        role: 'Ordförande', // Default role
    });
    const [showWebcam, setShowWebcam] = useState(false);
    const [showFileInput, setShowFileInput] = useState(false);
    const [avatar, setAvatar] = useState(DEFAULT_AVATAR_URL);
    const [creatingUser, setCreatingUser] = useState(false);
    const webcamRef = React.useRef<Webcam>(null);

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
        setAvatar(DEFAULT_AVATAR_URL);
        setCreatingUser(false);
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
        setCreatingUser(true);

        // Validate the form
        if (!validateForm()) {
            clearFormState();
            return;
        }

        const { username, firstName, lastName, email, role } = formData;

        let newBlob = null;
        if (avatar && avatar !== DEFAULT_AVATAR_URL) {
            const response = await fetch(`/api/avatar/upload?filename=${username}_avatar`, {
                method: 'POST',
                body: base64toFile(avatar, `${username}_avatar.jpg`),
            });

            if (!response.ok) {
                toast.error('Något gick fel vid uppladdning av din avatar. Försök igen.');
                return;
            }

            newBlob = (await response.json()) as PutBlobResult;
        }

        const user = {
            username,
            firstName,
            lastName,
            email,
            role: roleStringToUserRole[role],
            avatar: newBlob?.url || null,
        }

        const dbUser = await addUser(user);

        if (!dbUser) {
            toast.error('Något gick fel');
            clearFormState();
            return;
        }
        toast.success(`${user.username} har lagts till!`);

        // Reset form or give feedback to the user
        clearFormState();
    };

    const captureImage = React.useCallback(
        () => {
            setShowWebcam(true)
            const imageSrc = webcamRef.current?.getScreenshot();
            if (imageSrc) {
                setAvatar(imageSrc);
            }
            setShowWebcam(false);
        },
        [webcamRef]
    );

    const chooseImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setAvatar(reader.result as string);
        };
        reader.readAsDataURL(file);
    }

    const activateFileInput = () => {
        setShowWebcam(false);
        setShowFileInput(true);
    }

    const activateWebcam = () => {
        setShowFileInput(false);
        setShowWebcam(true);
    }


    return (
        <div className='mx-auto my-20 bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-9 bg-white rounded-lg shadow-md'>
                <h2 className='text-center text-2xl font-bold text-gray-900'>Lägg till användare</h2>
                <form onSubmit={handleSubmit} className='space-y-9'>
                    <div>
                        {showWebcam ? (
                            <div>
                                <Webcam
                                    className='mb-2 rounded-lg'
                                    screenshotFormat='image/jpeg'
                                    ref={webcamRef} />
                                <Button className='mb-2' fullWidth onClick={captureImage}>Tryck för att ta bild!</Button>
                            </div>
                        ) : (
                            <div>
                                <Avatar
                                    radius="sm"
                                    src={avatar}
                                    className='w-48 h-48 mx-auto mb-2 rounded-lg'
                                />
                            </div>
                        )}

                        {showFileInput && (
                            <div className='m-2'>
                                <NextUIContainer>
                                    <input
                                        type="file"
                                        name="image"
                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold"
                                        accept="image/*"
                                        onChange={chooseImage}
                                    />
                                </NextUIContainer>
                            </div>
                        )}

                        {!showWebcam && (
                            <Button className='mb-2' fullWidth onClick={activateWebcam}>Ta egen profilbild</Button>
                        )}

                        {!showFileInput && (
                            <Button className='mb-2' fullWidth onClick={activateFileInput}>Välj profilbild</Button>
                        )}

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
                    <Button
                        type='submit'
                        className='w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
                        isLoading={creatingUser}
                    >
                        Lägg till
                    </Button>
                </form>
            </div>
        </div>
    );
};

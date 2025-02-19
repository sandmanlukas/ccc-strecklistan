"use client";

import React, { useEffect, useState } from 'react';
import { User, UserRole } from '@prisma/client';
import { base64toFile, positionLabels } from '@/app/lib/utils';
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from '@nextui-org/react';
import Image from "next/image";
import { editUser } from '@/app/lib/editUser';
import { deleteUser } from '@/app/lib/deleteUser';
import { toast } from 'react-toastify';
import { DEFAULT_AVATAR_URL } from '@/app/constants';
import Webcam from 'react-webcam';
import { PutBlobResult } from '@vercel/blob';
import NextUIContainer from './NextUIContainer';

export default function AdminUserCard({ user, onUserUpdate, onUserDeletion }: { user: User | null, onUserUpdate: (user: User) => void, onUserDeletion: (user: User) => void }) {
    const { isOpen: isEditUserModalOpen, onOpen: onOpenEditUserModal, onClose: onCloseEditUserModal, onOpenChange: onOpenChangeEditUserModal } = useDisclosure();
    const { isOpen: isDeleteUserModalOpen, onOpen: onOpenDeleteUserModal, onClose: onCloseDeleteUserModal } = useDisclosure();
    const [editedUser, setEditedUser] = React.useState<User | null>(user);
    const [originalUser, setOriginalUser] = React.useState<User | null>(user);
    const [showWebcam, setShowWebcam] = useState(false);
    const [showFileInput, setShowFileInput] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const webcamRef = React.useRef<Webcam>(null);

    const role = user ? positionLabels[user.role] : ''; // Adjust according to how `positionLabels` is implemented

    const userRoles = Object.values(UserRole).map((type) => {
        return positionLabels[type];
    });

    useEffect(() => {
        if (user) {
            setEditedUser(user);
            setOriginalUser(user);
        }

    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        let { name, value }: { name: string, value: string | number } = e.target;

        if (name === 'debt') {
            value = parseInt(value);
        }

        setEditedUser((prev) => {
            if (prev !== null) {
                return { ...prev, [name]: value };
            }
            return null;
        });
    }

    const handleDeleteUser = async () => {
        if (!editedUser) return;
        setIsDeleting(true);

        if (editedUser.avatar && editedUser.avatar !== DEFAULT_AVATAR_URL) {
            const response = await fetch(`/api/avatar/delete?url=${editedUser.avatar}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                toast.error('Kunde inte ta bort användarens avatar');
                return;
            }
        }

        const deleted = await deleteUser(editedUser.id);

        if (deleted) {
            onUserDeletion(deleted);
            setEditedUser(null);
            toast.success(`${deleted.username} borttagen`);
        }

        setIsDeleting(false);
        onCloseDeleteUserModal();
    }

    const handleSaveChanges = async () => {
        if (!editedUser) return;
        setIsEditing(true);

        let newAvatarUrl = originalUser?.avatar ? { url: originalUser.avatar } : null;
        // Delete old avatar if a new one is uploaded, if the new one is different from old one        
        if (editedUser.avatar && editedUser.avatar !== originalUser?.avatar) {

            // Delete old file from storage if it exists first
            if (originalUser?.avatar && originalUser.avatar !== editedUser.avatar && originalUser.avatar !== DEFAULT_AVATAR_URL) {

                const response = await fetch(`/api/avatar/delete?url=${originalUser.avatar}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    toast.error('Kunde inte ta bort användarens avatar');
                    return;
                }
            };

            const response = await fetch(`/api/avatar/upload?filename=${editedUser.username}_avatar`, {
                method: 'POST',
                body: base64toFile(editedUser.avatar, `${editedUser}_avatar.jpg`),
            });

            if (!response.ok) {
                toast.error('Något gick fel vid uppladdning av din avatar. Försök igen.');
                return;
            }

            const newBlob = (await response.json()) as PutBlobResult;
            newAvatarUrl = { url: newBlob.url };
        }

        const editedUserWithNewAvatar = {
            ...editedUser,
            avatar: newAvatarUrl?.url || null,
        }
        
        if (originalUser == null) {
            toast.error('Kunde inte spara ändringar');
            return;
        };

        const user = await editUser(editedUserWithNewAvatar, originalUser);
        if (user) {
            onUserUpdate(user);
            setEditedUser(user);
            setOriginalUser(user);
            toast.success('Ändringar sparade');
        } else {
            toast.error('Kunde inte spara ändringar');
            return;
        }

        setIsEditing(false);
        onCloseEditUserModal();
    };

    const onCloseEditUserModalAndReset = () => {
        // Reset the editedItem to the originalItem if changes were not saved
        setEditedUser(originalUser);
        setIsEditing(false);
        onCloseEditUserModal(); // Close the modal
    };

    const captureImage = React.useCallback(
        () => {
            setShowWebcam(true)
            const imageSrc = webcamRef.current?.getScreenshot();
            if (imageSrc) {
                setEditedUser((prev) => {
                    if (prev !== null) {
                        return { ...prev, avatar: imageSrc };
                    }
                    return null;
                });

            }
            setShowWebcam(false);
        },
        [webcamRef]
    );

    const chooseImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setEditedUser((prev) => {
                    if (prev !== null) {
                        return { ...prev, avatar: reader.result as string };
                    }
                    return null;
                });
            }
            reader.readAsDataURL(file);
        }
    }

    const activateWebcam = () => {
        setShowFileInput(false);
        setShowWebcam(true);
    }

    const activateFileInput = () => {
        setShowWebcam(false);
        setShowFileInput(true);
    }

    return (
        <div>
            {originalUser && (
                <>
                    <div className='border p-4 rounded-lg shadow-md space-y-2 mr-2'>
                        <div className='flex justify-between'>
                            <h2 className='text-xl font-bold'>{originalUser.username}</h2>
                            <div className='flex'>
                                <MdOutlineEdit onClick={onOpenEditUserModal} className='mx-3 text-2xl cursor-pointer' />
                                <RiDeleteBinLine onClick={onOpenDeleteUserModal} className='text-2xl text-red-600 cursor-pointer' />
                            </div>
                        </div>

                        <div className='flex'>
                            <Image
                                alt="Användarens avatar"
                                src={originalUser.avatar ? originalUser.avatar : DEFAULT_AVATAR_URL}
                                width={200}
                                height={200}
                                className='rounded mr-4 max-h-min' />
                            <div>
                                <p className='text-gray-600 text-sm'>Post</p>
                                <p>{role}</p>

                                <p className='text-gray-600 text-sm'>Namn</p>
                                <p>{originalUser.firstName} {originalUser.lastName}</p>

                                <p className='text-gray-600 text-sm'>E-mail</p>
                                <p>{originalUser.email}</p>

                                <p className='text-gray-600 text-sm'>Skuld</p>
                                <p>{originalUser.debt} kr</p>

                            </div>
                        </div>
                    </div>
                    {editedUser && (
                        <>
                            <Modal
                                isOpen={isEditUserModalOpen}
                                onClose={onCloseEditUserModal}
                                onOpenChange={onOpenChangeEditUserModal}
                                scrollBehavior='outside'
                            >
                                <ModalContent>
                                    {() => (
                                        <>
                                            <ModalHeader className="flex flex-col gap-1">Ändra info för {originalUser.username}</ModalHeader>
                                            <ModalBody>
                                                {showWebcam ? (
                                                    <div>
                                                        <Webcam
                                                            className='mb-2 rounded-lg'
                                                            screenshotFormat='image/jpeg'
                                                            ref={webcamRef} />
                                                        <Button fullWidth onClick={captureImage}>Tryck för att ta ny profilbild</Button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Image
                                                            alt="Användarens avatar"
                                                            src={editedUser.avatar ? editedUser.avatar : DEFAULT_AVATAR_URL}
                                                            width={200}
                                                            height={100}
                                                            className='rounded mt-0 pt-0 w-auto'
                                                        />
                                                    </>
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
                                                    <Button color='primary' onClick={activateWebcam} > Ta ny profilbild </Button>
                                                )}

                                                {!showFileInput && (
                                                    <Button color='primary' onClick={activateFileInput} > Ladda upp ny profilbild </Button>
                                                )}
                                                <Input
                                                    autoFocus
                                                    label="Användarnamn"
                                                    name='username'
                                                    id='username'
                                                    value={editedUser?.username || ''}
                                                    onChange={handleInputChange}
                                                    variant="bordered"
                                                />
                                                <Select
                                                    label="Post"
                                                    name='role'
                                                    id='role'
                                                    value={editedUser?.role || ''}
                                                    onChange={handleInputChange}
                                                    defaultSelectedKeys={[positionLabels[editedUser.role]]}
                                                    variant="bordered">
                                                    {
                                                        userRoles.map((role) => (
                                                            <SelectItem key={role} value={role}>{role}</SelectItem>
                                                        ))
                                                    }
                                                </Select>
                                                <Input
                                                    label="E-mail"
                                                    name='email'
                                                    id='email'
                                                    value={editedUser?.email || ''}
                                                    onChange={handleInputChange}
                                                    variant="bordered"
                                                />
                                                <Input
                                                    label="Förnamn"
                                                    name='firstName'
                                                    id='firstName'
                                                    value={editedUser?.firstName || ''}
                                                    onChange={handleInputChange}
                                                    variant="bordered"
                                                />
                                                <Input
                                                    label="Efternamn"
                                                    name='lastName'
                                                    id='lastName'
                                                    value={editedUser?.lastName || ''}
                                                    onChange={handleInputChange}
                                                    variant="bordered"
                                                />
                                                <Input
                                                    label="Skuld"
                                                    type='number'
                                                    name='debt'
                                                    id='debt'
                                                    value={editedUser?.debt.toString() || ''}
                                                    onChange={handleInputChange}
                                                    variant="bordered"
                                                />
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button color="danger" variant="flat" onPress={onCloseEditUserModalAndReset}>
                                                    Stäng
                                                </Button>
                                                <Button
                                                    color="primary"
                                                    onPress={handleSaveChanges}
                                                    isLoading={isEditing}>
                                                    Spara ändringar
                                                </Button>
                                            </ModalFooter>
                                        </>
                                    )}
                                </ModalContent>
                            </Modal>
                            <Modal
                                isOpen={isDeleteUserModalOpen}
                                onClose={onCloseDeleteUserModal}
                                onOpenChange={onOpenDeleteUserModal}
                                placement="top-center"
                            >
                                <ModalContent>
                                    {(onCloseDeleteUserModal) => (
                                        <>
                                            <ModalHeader className="flex flex-col gap-1">Ta bort {editedUser.username}</ModalHeader>
                                            <ModalBody>
                                                <p>Är du säker på att du vill ta bort {editedUser.username}? Detta går inte att ångra.</p>
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button color="primary" onPress={onCloseDeleteUserModal}>
                                                    Avbryt
                                                </Button>
                                                <Button
                                                    color="danger"
                                                    variant="flat"
                                                    onPress={handleDeleteUser}
                                                    isLoading={isDeleting}
                                                >
                                                    Ta bort
                                                </Button>
                                            </ModalFooter>
                                        </>
                                    )}
                                </ModalContent>
                            </Modal>
                        </>
                    )}
                </>
            )}
        </div>
    );

}
"use client";

import React, { use, useEffect } from 'react';
import { User, UserRole } from '@prisma/client';
import { positionLabels } from '@/app/lib/utils';
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from '@nextui-org/react';
import { on } from 'events';
import { log } from 'console';

export default function AdminUserCard({ user }: { user: User | null }) {
    const { isOpen: isEditUserModalOpen, onOpen: onOpenEditUserModal, onClose: onCloseEditUserModal, onOpenChange: onOpenChangeEditUserModal } = useDisclosure();
    const { isOpen: isDeleteUserModalOpen, onOpen: onOpenDeleteUserModal, onClose: onCloseDeleteUserModal } = useDisclosure();
    const [editedUser, setEditedUser] = React.useState<User | null>(user);

    const role = user ? positionLabels[user.role] : ''; // Adjust according to how `positionLabels` is implemented

    const userRoles = Object.values(UserRole).map((type) => {
        return positionLabels[type];
    });

    useEffect(() => {
        if (user) {
            setEditedUser(user);
        }

    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        let { name, value }: { name: string, value: string | number } = e.target;

        if (name === 'debt') {
            value = parseInt(value);
        }
        setEditedUser((prev) => {
            if (prev !== null) {
                return {...prev, [name]: value};
            }
            return null;
        });
    }

    const handleDeleteUser = () => {
        if (!editedUser) return;
        console.log('Deleting user');
        console.log(editedUser);
        onCloseDeleteUserModal();
        
    }

    const handleSaveChanges = () => {
        if (!editedUser) return;
        console.log('Saving changes');

        // TODO: Save changes to the user in DB
        onCloseEditUserModal();
    }

    return (
        <div>
            {editedUser && (
                <>
                    <div className='border p-4 rounded-lg shadow-md space-y-2'>
                        <div className='flex justify-between items-center'>
                            <h2 className='text-xl font-bold'>{editedUser.username}</h2>
                            <div className='flex'>
                                <MdOutlineEdit onClick={onOpenEditUserModal} className='mr-3 text-2xl cursor-pointer' />
                                <RiDeleteBinLine onClick={onOpenDeleteUserModal} className='texEt-2xl text-red-600 cursor-pointer' />
                            </div>
                        </div>
                        <div>
                            <p className='text-gray-600 text-sm'>Post</p>
                            <p>{role}</p>
                        </div>

                        <div>
                            <p className='text-gray-600 text-sm'>Namn</p>
                            <p>{editedUser.firstName} {editedUser.lastName}</p>
                        </div>

                        <div>
                            <p className='text-gray-600 text-sm'>E-mail</p>
                            <p>{editedUser.email}</p>
                        </div>

                        <div>
                            <p className='text-gray-600 text-sm'>Skuld</p>
                            <p>{editedUser.debt} kr</p>
                        </div>
                    </div>
                    <Modal
                        isOpen={isEditUserModalOpen}
                        onClose={onCloseEditUserModal}
                        onOpenChange={onOpenChangeEditUserModal}
                        placement="top-center"
                    >
                        <ModalContent>
                            {(onCloseEditUserModal) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Ändra info för {editedUser.username}</ModalHeader>
                                    <ModalBody>
                                        <Input
                                            autoFocus
                                            label="Användarnamn"
                                            value={editedUser?.username || ''} 
                                            onChange={handleInputChange}
                                            variant="bordered"
                                        />
                                        <Select
                                            label="Post"
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
                                            value={editedUser?.email || ''} 
                                            onChange={handleInputChange}
                                            variant="bordered"
                                        />
                                        <Input
                                            label="Förnamn"
                                            value={editedUser?.firstName || ''} 
                                            onChange={handleInputChange}
                                            variant="bordered"
                                        />
                                        <Input
                                            label="Efternamn"
                                            value={editedUser?.lastName || ''} 
                                            onChange={handleInputChange}
                                            variant="bordered"
                                        />
                                        <Input
                                            label="Skuld"
                                            value={editedUser?.debt.toString() || ''} 
                                            onChange={handleInputChange}
                                            variant="bordered"
                                        />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="flat" onPress={onCloseEditUserModal}>
                                            Stäng
                                        </Button>
                                        <Button color="primary" onPress={handleSaveChanges}>
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
                                        <Button color="danger" variant="flat" onPress={handleDeleteUser}>
                                            Ta bort
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </>
            )}
        </div>
    );

}
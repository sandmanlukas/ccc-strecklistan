"use client";

import React, { useEffect, useState } from 'react';
import { Account, AccountRole } from '@prisma/client';
import { MdOutlineEdit } from "react-icons/md";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { editAccount } from '../lib/editAccount';
const bcrypt = require("bcryptjs");

export interface EditAccount extends Account {
    newPassword1?: string;
    newPassword2?: string;
}

export default function AdminAccountCard({ account, onAccountUpdate }: { account: Account | null, onAccountUpdate: (account: Account) => void }) {
    const { isOpen: isEditUserModalOpen, onOpen: onOpenEditUserModal, onClose: onCloseEditAccountModal, onOpenChange: onOpenChangeEditUserModal } = useDisclosure();
    const [editedAccount, setEditedAccount] = React.useState<EditAccount | null>(account);
    const [originalAccount, setOriginalAccount] = React.useState<EditAccount | null>(account);
    const [isEditing, setIsEditing] = useState(false);
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    const accountRoles = Object.values(AccountRole).map((type) => {
        return type;
    });

    useEffect(() => {
        if (account) {
            setEditedAccount(account);
            setOriginalAccount(account);
        }

    }, [account]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        let { name, value }: { name: string, value: string | number } = e.target;

        if (name === 'password1') {
            setPassword1(value);
        } else if (name === 'password2') {
            setPassword2(value);
        }

        setEditedAccount((prev) => {            
            if (prev !== null) {
                return { ...prev, [name]: value };
            }
            return null;
        });
    }

    const handleSaveChanges = async () => {
        if (!editedAccount) return;
        setIsEditing(true);

        if ((password1 && !password2) || (password2 && !password1)) {
            toast.error('Skriv in det nya lösenordet i båda fälten!');
            setIsEditing(false);
            return;
        }

        if (password1 && password2 && password1 !== password2) {
            toast.error('Lösenorden matchar inte!');
            setIsEditing(false);
            return;
        }

        if (password1 && await bcrypt.compare(password1, editedAccount.password)) {
            toast.error('Kan inte byta till samma lösenord som tidigare!');
            setIsEditing(false);
            return;
        }

        if (password1 && password2) {
            editedAccount.newPassword1 = password1;
            editedAccount.newPassword2 = password2;
        }
        
        const account = await editAccount(editedAccount);

        if (account) {
            onAccountUpdate(account);
            setEditedAccount(account);
            setOriginalAccount(account);
            toast.success('Ändringar sparade');
        } else {
            toast.error('Kunde inte spara ändringar');
            return;
        }

        setIsEditing(false);
        setPassword1('');
        setPassword2('');
        onCloseEditAccountModal();
    };

    const onCloseEditAccountModalAndReset = () => {
        // Reset the editedItem to the originalItem if changes were not saved
        setEditedAccount(originalAccount);
        setPassword1('');
        setPassword2('');
        setIsEditing(false);
        onCloseEditAccountModal(); // Close the modal
    };

    return (
        <div>
            {originalAccount && (
                <>
                    <div className='border p-4 rounded-lg shadow-md space-y-2'>
                        <div className='flex justify-between'>
                            <h2 className='text-xl font-bold'>{originalAccount.username}</h2>
                            <div className='flex'>
                                <MdOutlineEdit onClick={onOpenEditUserModal} className='mx-3 text-2xl cursor-pointer' />
                            </div>
                        </div>

                        <div className='flex'>
                            <div>
                                <p className='text-gray-600 text-sm'>Roll</p>
                                <p>{originalAccount.role}</p>
                            </div>
                        </div>
                    </div>
                    {editedAccount && (
                        <>
                            <Modal
                                isOpen={isEditUserModalOpen}
                                onClose={onCloseEditAccountModal}
                                onOpenChange={onOpenChangeEditUserModal}
                                placement="top-center"
                            >
                                <ModalContent>
                                    {() => (
                                        <>
                                            <ModalHeader className="flex flex-col gap-1">Ändra info för {originalAccount.username}</ModalHeader>
                                            <ModalBody>
                                                <Input
                                                    autoFocus
                                                    label="Användarnamn"
                                                    name='username'
                                                    id='username'
                                                    value={editedAccount?.username || ''}
                                                    onChange={handleInputChange}
                                                    variant="bordered"
                                                />
                                                <Select
                                                    label="Post"
                                                    name='role'
                                                    id='role'
                                                    value={editedAccount?.role || ''}
                                                    onChange={handleInputChange}
                                                    defaultSelectedKeys={[editedAccount.role]}
                                                    variant="bordered">
                                                    {
                                                        accountRoles.map((role) => (
                                                            <SelectItem key={role} value={role}>{role}</SelectItem>
                                                        ))
                                                    }
                                                </Select>
                                                <Input
                                                    label="Lösenord"
                                                    name='password1'
                                                    id='password1'
                                                    type='password'
                                                    value={password1}
                                                    onChange={handleInputChange}
                                                    variant="bordered"
                                                />
                                                <Input
                                                    label="Skriv in lösenord igen"
                                                    name='password2'
                                                    id='password2'
                                                    type='password'
                                                    value={password2}
                                                    onChange={handleInputChange}
                                                    variant="bordered"
                                                />
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button color="danger" variant="flat" onPress={onCloseEditAccountModalAndReset}>
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
                        </>
                    )}
                </>
            )}
        </div>
    );

}
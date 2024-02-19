"use client";

import React, { useEffect } from 'react';
import { Item, ItemType } from '@prisma/client';
import { capitalizeFirstLetter, itemTypes } from '@/app/lib/utils';
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from '@nextui-org/react';
import { editItem } from '@/app/lib/editItem';
import { deleteItem } from '@/app/lib/deleteItem';
import { toast } from 'react-toastify';

export default function AdminItemCard({ item, onItemUpdate, onItemDeletion }: { item: Item | null, onItemUpdate: (item: Item) => void, onItemDeletion: (item: Item) => void }) {
    const { isOpen: isEditItemModalOpen, onOpen: onOpenEditItemModal, onClose: onCloseEditItemModal, onOpenChange: onOpenChangeEditItemModal } = useDisclosure();
    const { isOpen: isDeleteItemModalOpen, onOpen: onOpenDeleteItemModal, onClose: onCloseDeleteItemModal } = useDisclosure();
    const [editedItem, setEditedItem] = React.useState<Item | null>(item);

    const type = item ? itemTypes[item.type] : ''; // Adjust according to how `positionLabels` is implemented

    const types = Object.values(ItemType).map((type) => capitalizeFirstLetter(type));

    useEffect(() => {
        if (item) {
            setEditedItem(item);
        }

    }, [item]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        let { name, value }: { name: string, value: string | number } = e.target;

        if (name === 'volume' || name === 'price') {
            value = parseInt(value);
        }

        setEditedItem((prev) => {
            if (prev !== null) {
                return { ...prev, [name]: value };
            }
            return null;
        });
    }

    const handleDeleteItem = async () => {
        if (!editedItem) return;

        const deleted = await deleteItem(editedItem.id);
        if (deleted) {
            onItemDeletion(deleted);
            setEditedItem(null);
            toast.success(`${deleted.name} borttagen`);
        }

        onCloseDeleteItemModal();
    }

    const handleSaveChanges = async () => {
        if (!editedItem) return;
        console.log('Saving changes');

        const user = await editItem(editedItem);
        if (user) {
            onItemUpdate(user);
            setEditedItem(user);
            toast.success('Ändringar sparade');
        } else {
            toast.error('Kunde inte spara ändringar');
            return;
        }
        // TODO: Save changes to the user in DB
        onCloseEditItemModal();
    }

    return (
        <div>
            {editedItem && (
                <>
                    <div className='border p-4 rounded-lg shadow-md space-y-2'>
                        <div className='flex justify-between items-center'>
                            <h2 className='text-xl font-bold'>{editedItem.name}</h2>
                            <div className='flex'>
                                <MdOutlineEdit onClick={onOpenEditItemModal} className='mr-3 text-2xl cursor-pointer' />
                                <RiDeleteBinLine onClick={onOpenDeleteItemModal} className='texEt-2xl text-red-600 cursor-pointer' />
                            </div>
                        </div>
                        <div>
                            <p className='text-gray-600 text-sm'>Pris</p>
                            <p>{editedItem.price} kr</p>
                        </div>

                        <div>
                            <p className='text-gray-600 text-sm'>Typ</p>
                            <p>{type}</p>
                        </div>

                    </div>
                    <Modal
                        isOpen={isEditItemModalOpen}
                        onClose={onCloseEditItemModal}
                        onOpenChange={onOpenChangeEditItemModal}
                        placement="top-center"
                    >
                        <ModalContent>
                            {(onCloseEditItemModal) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Ändra info för {editedItem.name}</ModalHeader>
                                    <ModalBody>
                                        <Input
                                            autoFocus
                                            label="Namn"
                                            name='name'
                                            id='name'
                                            value={editedItem?.name || ''}
                                            onChange={handleInputChange}
                                            variant="bordered"
                                        />
                                        <Input
                                            label="Pris"
                                            type='number'
                                            name='price'
                                            id='price'
                                            value={editedItem?.price.toString() || ''}
                                            onChange={handleInputChange}
                                            variant="bordered"
                                            endContent={<span className="text-sm text-gray-500">kr</span>}
                                        />
                                        <Select
                                            label="Typ"
                                            name='type'
                                            id='type'
                                            value={editedItem?.type || ''}
                                            onChange={handleInputChange}
                                            defaultSelectedKeys={[itemTypes[editedItem.type]]}
                                            variant="bordered">
                                            {
                                                types.map((type) => (
                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                ))
                                            }
                                        </Select>
                                        <Input
                                            label="Volume"
                                            name='voume'
                                            id='volume'
                                            value={editedItem?.volume.toString() || ''}
                                            onChange={handleInputChange}
                                            variant="bordered"
                                            endContent={<span className="text-sm text-gray-500">cl</span>}
                                        />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="flat" onPress={onCloseEditItemModal}>
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
                        isOpen={isDeleteItemModalOpen}
                        onClose={onCloseDeleteItemModal}
                        onOpenChange={onOpenDeleteItemModal}
                        placement="top-center"
                    >
                        <ModalContent>
                            {(onCloseDeleteItemModal) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Ta bort {editedItem.name}</ModalHeader>
                                    <ModalBody>
                                        <p>Är du säker på att du vill ta bort {editedItem.name}? Detta går inte att ångra.</p>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onPress={onCloseDeleteItemModal}>
                                            Avbryt
                                        </Button>
                                        <Button color="danger" variant="flat" onPress={handleDeleteItem}>
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
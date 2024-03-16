"use client";

import React, { useEffect } from 'react';
import { Swish } from '@prisma/client';
import { MdOutlineEdit } from "react-icons/md";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { editSwish } from '@/app/lib/editSwish';
import Image from 'next/image';
import { PutBlobResult } from '@vercel/blob';
import { set } from 'zod';

export default function AdminSwishInfo({ swish }: { swish: Swish | null }) {
    const { isOpen: isEditSwishModalOpen, onOpen: onOpenEditSwishModal, onClose: onCloseEditSwishModal, onOpenChange: onOpenChangeEditSwishModal } = useDisclosure();

    const [editedSwish, setEditedSwish] = React.useState<Swish | null>(swish);
    const [originalSwish, setOriginalSwish] = React.useState<Swish | null>(swish);
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        if (swish) {
            setEditedSwish(swish);
            setOriginalSwish(swish);
        }

    }, [swish]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        let { name, value }: { name: string, value: string } = e.target;

        setEditedSwish((prev) => {
            if (prev !== null) {
                return { ...prev, [name]: value };
            }
            return null;
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    }

    const handleSaveChanges = async () => {
        if (!editedSwish) return;
        setLoading(true);

        let newBlob: PutBlobResult | null = null;
        if (selectedFile) {
            if (editedSwish.imageUrl) {
                const response = await fetch(`/api/avatar/delete?url=${editedSwish.imageUrl}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    toast.error('Något gick fel vid uppladdning av swishkod. Försök igen.');
                    setLoading(false);
                    return;
                }
            }

            const response = await fetch(`/api/avatar/upload?filename=swish_code`, {
                method: 'POST',
                body: selectedFile
            });

            if (!response.ok) {
                toast.error('Något gick fel vid uppladdning av swishkod. Försök igen.');
                setLoading(false);
                return;
            }

            newBlob = (await response.json()) as PutBlobResult;
            editedSwish.imageUrl = newBlob.url;
        }

        const swish = await editSwish(editedSwish);
        if (swish) {
            setEditedSwish(swish);
            setOriginalSwish(swish);
            toast.success('Ändringar sparade');
        } else {
            toast.error('Kunde inte spara ändringar');
            setLoading(false);
            return;
        }

        setLoading(false);
        onCloseEditSwishModal();
    };

    const onCloseEditSwishModalAndReset = () => {
        // Reset the editedSwish to the originalSwish if changes were not saved
        setEditedSwish(originalSwish);
        onCloseEditSwishModal(); // Close the modal
    };

    return (
        <div>
            <>
                <div className='border p-4 rounded-lg shadow-md space-y-2'>
                    <div className='flex justify-between items-center'>
                        <h2 className='text-xl font-bold'>Swishinformation</h2>
                        <div className='flex'>
                            <MdOutlineEdit onClick={onOpenEditSwishModal} className='mr-3 text-2xl cursor-pointer' />
                        </div>
                    </div>
                    <div>
                        <p className='text-gray-600 text-sm'>Namn</p>
                        <p>{originalSwish?.name ? originalSwish.name : 'Namn på swishmottagare'}</p>

                        <p className='text-gray-600 text-sm'>Nummer</p>
                        <p>{originalSwish?.number ? originalSwish.number : 'Swishnummer'}</p>

                        <p className='text-gray-600 text-sm mb-2'>Swishbild</p>
                        {
                            originalSwish?.imageUrl ? (
                                <Image src={originalSwish.imageUrl} alt="Swishbild" width={200} height={200} className='w-auto m-auto rounded' />
                            ) : (
                                <p>Ingen bild</p>
                            )
                        }
                    </div>

                </div>
                <>
                    <Modal
                        isOpen={isEditSwishModalOpen}
                        onClose={onCloseEditSwishModal}
                        onOpenChange={onOpenChangeEditSwishModal}
                        placement="top-center"
                    >
                        <ModalContent>
                            {() => (
                                <>
                                    {originalSwish ? (
                                        <ModalHeader className="flex flex-col gap-1">Ändra swishinformation</ModalHeader>
                                    ) : (
                                        <ModalHeader className="flex flex-col gap-1">Ställ in swishinformation</ModalHeader>
                                    )}
                                    <ModalBody>
                                        <Input
                                            autoFocus
                                            label="Namn"
                                            name='name'
                                            id='name'
                                            value={editedSwish?.name || ''}
                                            onChange={handleInputChange}
                                            variant="bordered"
                                        />
                                        <Input
                                            label="Nummer"
                                            name='number'
                                            id='number'
                                            value={editedSwish?.number || ''}
                                            onChange={handleInputChange}
                                            variant="bordered"
                                        />
                                        <label
                                        htmlFor="imageUrl"
                                        className=''
                                        >Swishbild</label>
                                        <p className='text-gray text-sm mt-0 pt-0'>
                                            Ladda upp en swishkod som kommer att synas på swishsidan.
                                        </p>
                                        <p className='text-gray text-sm'>
                                            P.S. Det kan ta lite tid tills bilden uppdateras, testa att refresha med Ctrl+Shift+R.
                                        </p>
                                        <input
                                            name='imageUrl'
                                            id='imageUrl'
                                            type='file'
                                            accept='image/*'
                                            onChange={handleFileChange}
                                        />
                                        { selectedFile && (
                                            <Image
                                                src={URL.createObjectURL(selectedFile)}
                                                alt="Swishbild"
                                                width={150}
                                                height={150}
                                                className='w-auto rounded'
                                                />
                                            )}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="flat" onPress={onCloseEditSwishModalAndReset}>
                                            Stäng
                                        </Button>
                                        <Button
                                            color="primary"
                                            onPress={handleSaveChanges}
                                            isLoading={loading}
                                        >
                                            Spara ändringar
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </>
            </>
        </div>
    );

}
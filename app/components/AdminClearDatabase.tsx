"use client"

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { clearDatabase } from "@/app/lib/clearDatabase";
import React from "react";
import { toast } from "react-toastify";





export function AdminClearDatabase() {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [isClearing, setIsClearing] = React.useState(false);
    const [confirmText, setConfirmText] = React.useState('');

    const requiredText = 'Rensa databas'

    const closeModal = () => {
        setConfirmText('');
        onClose();
    }

    const handleClearDatabase = async () => {
        setIsClearing(true);

        if (confirmText !== requiredText) {
            toast.error('Fel text! Skriv in "Rensa databas" för att bekräfta.');
            setIsClearing(false);
            closeModal();
            return;
        }

        const result = await clearDatabase();

        if (!result) {
            toast.error('Något gick fel! Försök igen senare.');
            return;
        } else {
            toast.success('Databasen rensad!');
        }

        setIsClearing(false);
        closeModal();
    }

    return (
        <div>
            <p className="text-small">Tryck här om du vill rensa databasen, t.ex. i början av nytt CCC år. Detta kommer ta bort alla transaktioner, nollställa senaste skulddatumet, samt ta bort swishinfon. Alla användare och inventarie kommer fortfarande vara kvar.</p>

            <p className="mt-2 text-small">Om du rensar i början/slutet av ett CCC-år, glöm inte att byta roll till Kadaver på er som går av.</p>
            <div className="flex justify-center items-center">
                <Button className="mt-5" color="danger" onPress={onOpen}>Rensa databas</Button>
            </div>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
            >
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Rensa databasen</ModalHeader>
                            <ModalBody>
                                <p>
                                    Är du säker på att du vill rensa databasen? Detta kommer ta bort alla transaktioner, nollställa senaste skulddatumet, samt ta bort swishinfon. Alla användare och inventarie kommer fortfarande vara kvar. Detta går inte att ångra.
                                </p>
                                <p>
                                   Skriv in 'Rensa databas' för att bekräfta.
                                </p>

                                <Input 
                                value={confirmText} 
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder="Skriv in 'Rensa databas' för att bekräfta" 
                                />

                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={closeModal}>
                                    Stäng
                                </Button>
                                <Button
                                    color="danger"
                                    onPress={handleClearDatabase}
                                    isLoading={isClearing}>
                                    Spara ändringar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}
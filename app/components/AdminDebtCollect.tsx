import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@nextui-org/react";
import { CiEdit } from "react-icons/ci";
import { FaRegSave } from "react-icons/fa";
import { PiFileMagnifyingGlass } from "react-icons/pi";
import { getText } from '@/app/lib/getText';
import { addOrUpdateText } from '@/app/lib/addOrUpdateText';
import { toast } from 'react-toastify';
import { EmailTemplate } from '@/app/components/EmailTemplate';
import { TransactionWithItem } from '@/app/components/UserPage';
import { getDataForDebtCollection, updateLastEmailSent } from '@/app/lib/getDataForDebtCollection';
import { User } from '@prisma/client';


export interface UserWithItemsAndTransactions extends User {
    transactions: TransactionWithItem[];
}

const fakeTransactions: TransactionWithItem[] =
    [
        {
            id: 136,
            createdAt: new Date('2024-03-11T16:53:57.560Z'),
            updatedAt: new Date('2024-03-11T16:53:57.560Z'),
            userId: 15,
            barcode: "000000001",
            beeredTransaction: false,
            price: 10,
            beeredUser: null,
            beeredBy: null,
            item: {
                id: 12,
                name: "Pripps Blå",
                createdAt: new Date('2024-03-09T10:10:55.325Z'),
                updatedAt: new Date('2024-03-09T10:10:55.325Z'),
                barcode: "73145738",
                price: 10,
                volume: 33,
                type: "DRYCK"
            }
        },
        {
            id: 137,
            createdAt: new Date('2024-03-12T23:53:57.560Z'),
            updatedAt: new Date('2024-03-12T23:53:57.560Z'),
            userId: 15,
            barcode: "000000002",
            beeredTransaction: false,
            price: 15,
            beeredUser: null,
            beeredBy: null,
            item: {
                id: 12,
                name: "Pripps Blå",
                createdAt: new Date('2024-03-09T10:10:55.325Z'),
                updatedAt: new Date('2024-03-09T10:10:55.325Z'),
                barcode: "73145738",
                price: 10,
                volume: 33,
                type: "DRYCK"
            }
        },
    ]


const sendEmails = async (users: UserWithItemsAndTransactions[], title: string, body: string, lastEmailSentAt: Date | null) => {
    const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            subject: title,
            body,
            users: users,
            lastEmailSentAt
        })
    });

    if (!response.ok) {
        toast.error('Något gick fel vid mailutskick!');
        return;
    }

    return response;
}

export default function AdminDebtCollect() {
    const [edit, setEdit] = useState(false);
    const [showEmailTemplate, setShowEmailTemplate] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        const fetchText = async () => {
            const response = await getText('mail');

            if (!response) {
                return;
            }
            setTitle(response.title);
            setBody(response.body);

        }
        fetchText();
    }, []);

    const handleSaveText = async () => {
        setEdit(!edit);

        if (!title && !body) return;

        const response = await addOrUpdateText({ name: 'mail', title, body });
        if (!response) {
            toast.error('Något gick fel!');
            return;
        }

        toast.success('Text sparad!');
    }

    const handleSendMail = async () => {
        //TODO: Add date of last collection in db to be able to filter out transactions after that date
        // Send mail
        setLoading(true);
        setShowConfirmationModal(false);

        const { users, lastEmailSent} = await getDataForDebtCollection();

        console.log('users', users);

        if (!users) {
            toast.error('Något gick fel vid hämtning av användare!');
            setLoading(false);
            return;
        }

        const response = await sendEmails(users, title, body, lastEmailSent || null);

        if (!response) return;

        const updatedLastEmailSent = await updateLastEmailSent();

        if (!updatedLastEmailSent) {
            toast.error('Något gick fel vid uppdatering av senaste mailutskick!');
            setLoading(false);
            return;
        }


        toast.success('Mail skickat!');
        setLoading(false);
    }

    return (
        <Card className="border p-4 rounded-lg shadow-md space-y-2">
            <p className="text-sm">
                Här kan du skicka ut mail till alla (icke-sittande) om att det är dags att betala sin skuld.
                Nedanför så finns en mailmall som går att redigera, det är detta mail som kommer skickas ut till folk.
                Se till att eventuella swishnummer stämmer etc.
            </p>
            <p className='text-sm flex items-end'>
                Du kan trycka på <PiFileMagnifyingGlass className='mx-1' size={20}/> för att se en förhandsgranskning på hur mailet kommer se ut. 
            </p>
            <p className='text-sm flex items-end'>
                Genom att trycka på <CiEdit className='mx-1' size={20}/> så kan du börja redigera mailet. Tryck sedan på <FaRegSave className='mx-1' size={20}/> för att spara ändringarna.
            </p>
            <div className='flex items-end '>
                <h3>Mailmall</h3>
                {!edit ?
                    (
                        <CiEdit className='ml-2 cursor-pointer' onClick={() => setEdit(!edit)} />
                    ) : (
                        <FaRegSave className='ml-2 cursor-pointer' onClick={handleSaveText} />
                    )
                }
                <PiFileMagnifyingGlass className='ml-2 cursor-pointer' onClick={() => setShowEmailTemplate(!showEmailTemplate)} />
            </div>
            <Input
                label="Titel på mailet"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                isDisabled={!edit}
            />
            <Textarea
                label="Innehåll på mailet"
                placeholder="Ändra mallens innehåll här..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                isDisabled={!edit}
            />
            <Button isLoading={loading} onClick={() => setShowConfirmationModal(true)}>
                Skicka mail
            </Button>

            <Modal
                isOpen={showConfirmationModal}
                onClose={() => setShowConfirmationModal(false)}
            >
                <ModalContent>
                    <ModalHeader>Skicka mail</ModalHeader>
                    <ModalBody>
                        Är du säker på att du vill skicka ut mail om skulder?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={handleSendMail}>
                            Skicka
                        </Button>
                        <Button color="danger" onClick={() => setShowConfirmationModal(false)}>
                            Avbryt
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal
                isOpen={showEmailTemplate}
                onClose={() => setShowEmailTemplate(!showEmailTemplate)}
                size='xl'
            >
                <ModalContent>
                    <ModalHeader>
                        Mailexempel
                    </ModalHeader>
                    <ModalBody>
                        <EmailTemplate body={body} debt={1337} transactions={fakeTransactions} lastEmailSent={new Date()} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Card>

    );
}
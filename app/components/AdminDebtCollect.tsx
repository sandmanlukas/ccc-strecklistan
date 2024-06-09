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
import { Swish, User } from '@prisma/client';


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


const sendEmails = async (users: UserWithItemsAndTransactions[], title: string, body: string, lastEmailSentAt: Date | null, swish: Swish | null) => {
    if (!swish) {
        toast.error('Ingen Swish-info hittad!');
        return;
    }
    const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            subject: title,
            body,
            users: users,
            lastEmailSentAt,
            swish,
        })
    });

    if (!response.ok) {
        toast.error('Något gick fel vid mailutskick!');
        return;
    }

    return response;
}

export default function AdminDebtCollect({ swish }: { swish: Swish | null }) {
    const [edit, setEdit] = useState(false);
    const [showEmailTemplate, setShowEmailTemplate] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [debtedUsers, setDebtedUsers] = useState<UserWithItemsAndTransactions[]>([]);
    const [lastEmailSent, setLastEmailSent] = useState<Date | null>(null);

    useEffect(() => {
        setLoading(true);
        const fetchText = async () => {
            const response = await getText('mail');

            if (!response) {
                toast.error('Något gick fel vid hämtning av text!');
                setLoading(false);
                return;
            }
            setTitle(response.title);
            setBody(response.body);
        }

        const fetchDebtedUsers = async () => {
            const { users, lastEmailSent } = await getDataForDebtCollection();

            if (!users) {
                toast.error('Något gick fel vid hämtning av användare!');
                setLoading(false);
                return;
            }

            setDebtedUsers(users);

            if (lastEmailSent || lastEmailSent === null) {
                setLastEmailSent(lastEmailSent);
            }
        }

        fetchDebtedUsers();
        fetchText();
        setLoading(false);
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

        if (!debtedUsers) {
            toast.error('Något gick fel vid hämtning av användare!');
            setLoading(false);
            return;
        }

        const response = await sendEmails(debtedUsers, title, body, lastEmailSent || null, swish);

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
        <Card className="border p-4 mx-auto rounded-lg shadow-md space-y-2">
            <p className="text-xs md:text-sm">
                Här kan du skicka ut mail till alla (icke-sittande) om att det är dags att betala sin skuld.
                Nedanför så finns en mailmall som går att redigera, det är detta mail som kommer skickas ut till folk.
                Swishinformation behöver inte skrivas med i mailet, utan det kommer från admininställningarna, så se till att de stämmer där.
            </p>
            <span className='text-xs md:text-sm md:flex md:items-end'>
                Du kan trycka på  <PiFileMagnifyingGlass className='inline-flex mx-1' size={20} /> för att se en förhandsgranskning på hur mailet kommer se ut.
            </span>
            <p className='text-xs md:text-sm md:flex md:items-end'>
                Genom att trycka på <span><CiEdit className='inline-flex mx-1' size={20} /></span> så kan du börja redigera mailet. Tryck sedan på  <span><FaRegSave className='inline-flex mx-1' size={20} /></span> för att spara ändringarna.
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
                        {
                            !swish && (
                                <p className='text-lg text-red-500'>Ingen Swish-info hittad! Se till att ställa in detta i inställningarna!</p>
                            )
                        }
                        <p>
                            Är du säker på att du vill skicka ut mail om skulder?
                        </p>
                        {debtedUsers.length > 0 ? (
                            <>
                                <p>
                                    Dessa kommer få mailet:
                                </p>
                                <ul>
                                    {debtedUsers.map((user) => (
                                        <li key={user.id}><span className='font-bold'>Namn</span>: {user.username} - <span className='font-bold'>Skuld</span>: {user.debt} kr</li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <p>
                                Det verkar som om ingen har streckat något sen senaste mailutskicket eller att ingen har en skuld.
                            </p>
                        )}

                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={handleSendMail} isDisabled={!swish}>
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
                        {
                            !swish && (
                                <p className='text-lg text-red-500'>Ingen Swish-info hittad!</p>
                            )
                        }
                        <EmailTemplate body={body} debt={1337} transactions={fakeTransactions} lastEmailSent={new Date()} swish={swish} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Card>

    );
}
"use client";

import { useEffect, useState } from "react";
import { handleScan } from "@/app/lib/utils";
import { addItem } from "../lib/addItem";
import { Item } from "@prisma/client";

import { toast } from 'react-toastify';

export default function AddItemForm() {
    const [barcode, setBarcode] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [item, setItem] = useState<Item | null>(null);

    useEffect(() => {
        let code = "";
        let reading = false;

        const handleScanEvent = handleScan(code, reading, setBarcode);


        document.addEventListener('keydown', handleScanEvent);

        return () => {
            document.removeEventListener('keydown', handleScanEvent);
        }

    }, [barcode]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Call the addItem function to store the item in the database
        if (barcode === '' || name === '' || price === 0) {
            toast.error('Alla fält måste fyllas i!', {
                position: "top-center",
            });
            setName('');
            setBarcode('');
            setPrice(0);
            return;
        }

        const item = await addItem(barcode, name, price);
        if (!item) {
            toast.error(`Det gick inte att lägga till ${name} i inventariet! Streckkoden finns antagligen redan.`, {
                position: "top-center",
            });
            setName('');
            setBarcode('');
            setPrice(0);
            return;
        }
        setItem(item);
        toast.success(`${item.name} har lagts till i inventariet!`, {
            position: "top-center",
        });

        // Clear the form fields after adding the item
        setName('');
        setBarcode('');
        setPrice(0);
    };

    return (
        <>
            <div className="mx-auto mt-2">
                <h1 className="font-bold mb-2">Lägg till inventarie</h1>
                <form onSubmit={handleSubmit}>
                    <label className='block'>
                        Namn
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className='mt-1 block w-full rounded border border-black' />
                    </label>
                    <label className='block mt-4'>
                        Streckkod
                        <input type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)} className='mt-1 block w-full rounded border border-black' />
                    </label>
                    <label className='block mt-4'>
                        Pris
                        <input type="number" value={price} onChange={(e) => setPrice(parseInt(e.target.value))} className='mt-1 block w-full rounded border border-black' />
                    </label>
                    <button type="submit" className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Lägg till</button>
                </form>
            </div>
        </>
    )
}
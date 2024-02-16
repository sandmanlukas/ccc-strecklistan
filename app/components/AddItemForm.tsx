"use client";

import { useEffect, useState } from "react";
import { handleScan, capitalizeFirstLetter } from "@/app/lib/utils";
import { addItem } from "../lib/addItem";
import { Item, ItemType } from "@prisma/client";

import { toast } from 'react-toastify';

export default function AddItemForm() {
    const [barcode, setBarcode] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [volume, setVolume] = useState<number>(0);
    const [type, setType] = useState<string>('Dryck');

    const itemTypes = Object.values(ItemType).map((type) => capitalizeFirstLetter(type));

    function clearStates() {
        setName('');
        setBarcode('');
        setPrice(0);
        setVolume(0);
        setType('Dryck');
    }

    function validateForm() {
        // Basic validation to check if the fields are not empty
        if (!name.trim()) {
            toast.error('Namn får inte vara tomt');
            return;
        }
        if (!barcode.trim()) {
            toast.error('Streckkod får inte vara tomt');
            return;
        }
        if (!price) { // Assuming price is a number; checking if it's not 0 or NaN
            toast.error('Pris får inte vara tomt eller 0');
            return;
        }
        if (!type) { // Assuming type is always selected but you might want to ensure it's a valid type
            toast.error('Du måste välja en typ');
            return;
        }
        if (type === 'Dryck' && (!volume || volume <= 0)) { // Additional validation for volume if type is 'Dryck'
            toast.error('Volym måste vara större än 0 för drycker');
            return;
        }
        return true;
    }

    useEffect(() => {
        const handleScanEvent = handleScan(setBarcode);
        document.addEventListener('keydown', handleScanEvent);

        return () => {
            document.removeEventListener('keydown', handleScanEvent);
        }

    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Call the addItem function to store the item in the database
        if (!validateForm()) {
            clearStates();
            return;
        };

        const item = { barcode, name, price, type: type.toUpperCase() as ItemType, volume }
        const dbItem = await addItem(item);
        if (!dbItem) {
            toast.error(`Det gick inte att lägga till ${name} i inventariet! Streckkoden finns antagligen redan.`, {
                position: "top-center",
            });
            clearStates();
            return;
        }
        toast.success(`${item.name} har lagts till i inventariet!`, {
            position: "top-center",
        });

        // Clear the form fields after adding the item
        clearStates();
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
                    <label className="block mt-4">
                        Typ
                        <select className="mt-1 block w-full rounded border border-black" value={type} onChange={(e) => setType(e.target.value)}>
                            {
                                itemTypes.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))
                            }
                        </select>
                    </label>
                    {type === 'Dryck' &&
                        <label className="block mt-4">
                            Volym (cl)
                            <input type="number" value={volume} onChange={(e) => setVolume(parseInt(e.target.value))} className='mt-1 block w-full rounded border border-black' />
                        </label>
                    }
                    <button type="submit" className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Lägg till</button>
                </form>
            </div>
        </>
    )
}
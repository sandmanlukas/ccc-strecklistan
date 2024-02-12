"use client";

import { useEffect, useState } from "react";
import { handleScan } from "@/app/lib/utils";
import { addItem } from "../lib/addItem";
import { Item } from "@prisma/client";

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
        const item = await addItem(barcode, name, price);
        setItem(item);

        // Clear the form fields after adding the item
        setName('');
        setBarcode('');
        setPrice(0);
    };

    return (
        <>
            {item && (
                <div>
                    <h1>Item Added</h1>
                    <p>Name: {item.name}</p>
                    <p>Barcode: {item.barcode}</p>
                    <p>Price: {item.price}</p>
                </div>
            )}
            <div>
                <h1>Add Item</h1>
                <form onSubmit={handleSubmit}>
                    <label className='block'>
                        Name:
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className='mt-1 block w-full' />
                    </label>
                    <label className='block mt-4'>
                        Barcode:
                        <input type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)} className='mt-1 block w-full' />
                    </label>
                    <label className='block mt-4'>
                        Price:
                        <input type="number" value={price} onChange={(e) => setPrice(parseInt(e.target.value))} className='mt-1 block w-full' />
                    </label>
                    <button type="submit" className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Add Item</button>
                </form>
            </div>
        </>
    )
}
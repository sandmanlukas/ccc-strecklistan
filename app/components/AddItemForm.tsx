"use client";

import { useEffect, useState } from "react";
import { handleScan, capitalizeFirstLetter } from "@/app/lib/utils";
import { addItem } from "@/app/lib/addItem";
import { ItemType } from "@prisma/client";
import { Item } from "@/app/lib/addItem";

import { toast } from 'react-toastify';
import { Input, SelectItem, Select } from "@nextui-org/react";

export default function AddItemForm() {
    const [formData, setFormData] = useState({
        barcode: '',
        name: '',
        price: 0,
        volume: 0,
        type: 'Dryck',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        let { name, value }: { name: string, value: string | number } = e.target;

        if (name === 'price' || name === 'volume') {
            value = parseInt(value);
        }


        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const itemTypes = Object.values(ItemType).map((type) => capitalizeFirstLetter(type));

    function clearFormState() {
        setFormData({
            barcode: '',
            name: '',
            price: 0,
            volume: 0,
            type: 'Dryck',
        });
    }

    function validateForm() {
        const { name, barcode, price, type, volume } = formData;

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
        const updateBarcodeInForm = (scannedCode: string) => {
            setFormData(prev => ({ ...prev, barcode: scannedCode }));
        };
        const handleScanEvent = handleScan(updateBarcodeInForm);
        document.addEventListener('keydown', handleScanEvent);

        return () => {
            document.removeEventListener('keydown', handleScanEvent);
        }

    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Call the addItem function to store the item in the database
        if (!validateForm()) {
            clearFormState();
            return;
        };

        const { barcode, name, price, type, volume } = formData;
        const item: Item = {
            barcode,
            name,
            price,
            type: type.toUpperCase() as ItemType,
            volume,
        };
        
        const dbItem = await addItem(item);
        
        if (!dbItem) {
            toast.error(`Det gick inte att lägga till ${item.name} i inventariet! Streckkoden finns antagligen redan.`);
            clearFormState();
            return;
        }
        toast.success(`${item.name} har lagts till i inventariet!`);

        // Clear the form fields after adding the item
        clearFormState();
    };

    return (

        <div className="mx-auto my-20 bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-9 bg-white rounded-lg shadow-md">
                <h2 className="text-center text-2xl font-bold text-gray-900'">Lägg till inventarie</h2>
                <form onSubmit={handleSubmit} className="space-y-10">
                    <div>
                        <Input
                            label="Namn"
                            aria-label="Namn"
                            labelPlacement="outside"
                            placeholder="Namn på produkten"
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            isRequired />
                    </div>
                    <div>
                        <Input
                            label="Streckkod"
                            aria-label="Streckkod"
                            labelPlacement="outside"
                            placeholder="Strecka en burk eller något"
                            type="text"
                            id="barcode"
                            name="barcode"
                            value={formData.barcode}
                            onChange={handleChange}
                            required
                            isRequired />
                    </div>
                    <div>
                        <Input
                            label="Pris"
                            aria-label="Pris"
                            labelPlacement="outside"
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price.toString()}
                            onChange={handleChange}
                            endContent={<span className="text-sm text-gray-500">kr</span>}
                            required
                            isRequired
                        />
                    </div>
                    <div>
                        <Select
                            label="Typ"
                            aria-label="Typ"
                            labelPlacement="outside"
                            id="type"
                            name="type"
                            placeholder="Dryck"
                            value={formData.type}
                            onChange={handleChange}
                        >
                            {
                                itemTypes.map((type) => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))
                            }
                        </Select>
                    </div>
                    {formData.type === 'Dryck' &&
                        <div>
                            <Input
                                aria-label="Volym"
                                label="Volym"
                                labelPlacement="outside"
                                id="volume"
                                name="volume"
                                type="number"
                                value={formData.volume.toString()}
                                onChange={handleChange}
                                endContent={<span className="text-sm text-gray-500">cl</span>}
                            />
                        </div>
                    }
                    <button
                        type="submit"
                        className='w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
                    >
                        Lägg till
                    </button>
                </form>
            </div>
        </div >

    )
}
"use client"

import React, { useState, useEffect } from "react";
import { getSwishInfo } from "../lib/getSwishInfo";
import { toast } from "react-toastify";
import { Item, Swish } from "@prisma/client";
import Image from "next/image";
import { formatPhoneNumber, handleScan } from "@/app/lib/utils";
import { getItemByBarcode } from "../lib/getItem";


export default function SwishPage() {
    const [swish, setSwish] = useState<Swish | null>(null);
    const [barcode, setBarcode] = useState<string | null>(null);
    const [scanCount, setScanCount] = useState<number>(0);
    const [item, setItem] = useState<Item | null>(null);


    useEffect(() => {
        const fetchSwish = async () => {
            const swish = await getSwishInfo();
            if (!swish) {
                toast.error("Kunde inte hämta Swish info");
                return;
            }
            setSwish(swish);
        }

        fetchSwish();
    }, []);


    useEffect(() => {
        const handleScanEvent = handleScan(setBarcode, setScanCount);

        document.addEventListener('keydown', handleScanEvent);

        return () => {
            document.removeEventListener('keydown', handleScanEvent);
        }

    }, []);


    useEffect(() => {
        const getItemForSwish = async () => {
            if (barcode) {
                console.log('barcode', barcode);
                
                try {
                   const item = await getItemByBarcode(barcode);
                   console.log('item', item);

                   if (!item) {
                          toast.error('Något gick fel! Är du säker på att den här varan finns?');
                          return;
                     }
                   
                   setItem(item);
                } catch (error) {
                    toast.error('Något gick fel! Är du säker på att den här varan finns?');
                }
            }
        }
        getItemForSwish();
    }, [scanCount, barcode])

    return (
        <div className="mt-10 w-full flex flex-col items-center justify-center">
            <h2 className="text-4xl font-bold mb-4">Swisha till CCC!</h2>
            {
                swish ? (
                    <>
                        <p className="text-gray-700 mb-4">Strecka något så kommer priset dyka upp nedanför!</p>
                        { item && (
                            <div className="my-4 flex gap-2">
                                <p className="text-xl mb-2">Du håller på att strecka en <span className="font-bold">{item.name}</span></p>
                                <p className="text-gray-700 mb-2"> - {item.price} kr/st</p>
                            </div>
                        
                        )}
                        < p className="text-xl text-gray-700 mb-8">Swisha till <span className="font-bold">{formatPhoneNumber(swish.number)}</span> ({swish.name})</p>
                        {swish.imageUrl && (<Image src={swish.imageUrl} alt="Swishinformation" width={400} height={400} className="rounded-lg"/>)}
                    </>
                ) : (
                    <p className="text-xl text-gray-700 mb-8">Uppdatera swishinformation i inställningarna.</p>
                )
            }
        </div >
    )
}
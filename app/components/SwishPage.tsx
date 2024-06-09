"use client";

import React, { useState, useEffect, use } from "react";
import { getSwishInfo } from "../lib/getSwishInfo";
import { toast } from "react-toastify";
import { Item, Swish } from "@prisma/client";
import { formatPhoneNumber, handleScan, itemTypes } from "@/app/lib/utils";
import { getItemByBarcode } from "../lib/getItem";
import QrCode from "react-qr-code";

const getSize = () => {
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 640) {
      return 250; // size for small screens
    } else if (window.innerWidth < 1024) {
      return 300; // size for medium screens
    } else {
      return 400; // size for large screens
    }
  }
  return 400; // default size if window object is not available (e.g., during server-side rendering)
};

export default function SwishPage() {
  const [swish, setSwish] = useState<Swish | null>(null);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [scanCount, setScanCount] = useState<number>(0);
  const [item, setItem] = useState<Item | null>();
  const [size, setSize] = useState<number>(getSize());

  useEffect(() => {
    const handleResize = () => {
      setSize(getSize());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchSwish = async () => {
      const swish = await getSwishInfo();
      if (!swish) {
        toast.error("Kunde inte hämta Swish info");
        return;
      }
      setSwish(swish);
    };

    fetchSwish();
  }, []);

  useEffect(() => {
    const handleScanEvent = handleScan(setBarcode, setScanCount);

    document.addEventListener("keydown", handleScanEvent);

    return () => {
      document.removeEventListener("keydown", handleScanEvent);
    };
  }, []);



  useEffect(() => {
    const getItemForSwish = async () => {
      if (barcode) {
        try {
          const item = await getItemByBarcode(barcode);
          console.log("item", item);

          if (!item) {
            toast.error(
              "Något gick fel! Är du säker på att den här varan finns?"
            );
            return;
          }

          setItem(item);
        } catch (error) {
          toast.error(
            "Något gick fel! Är du säker på att den här varan finns?"
          );
        }
      }
    };
    getItemForSwish();
  }, [scanCount, barcode]);

  return (
    <div className="mt-10 w-full flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold mb-4">Swisha till CCC!</h2>
      {swish ? (
        <>
          <p className="text-gray-700 text-xl md:text-2xl mx-2 mb-4 ">
            Strecka något så kommer priset dyka upp nedanför!
          </p>
          {item && (
            <div className="my-4 flex gap-2">
              <p className="text-xl md:text-2xl mb-2">
                Du håller på att strecka en{" "}
                <span className="font-bold">{item.name}</span>
              </p>
              <p className="text-gray-700 mb-2"> - {item.price} kr/st</p>
            </div>
          )}
          <p className="text-xl md:text-2xl text-gray-700">
            Swisha till{" "}
            <span className="font-bold">{formatPhoneNumber(swish.number)}</span>{" "}
            ({swish.name})
          </p>
          <p className="text-xl text-gray-700 mb-8">eller skanna QR-koden med Swish</p>
          <div className="rounded-lg overflow-hidden">
            <QrCode
              value={`C${swish.number};${item ? item.price : 0};;${item ? 4 : 6 // 4 för att låsa pris och nummer och 6 för att låsa nummer
                }`}
              size={size}
            />
          </div>
        </>
      ) : (
        <p className="text-xl text-gray-700 mb-8">
          Uppdatera swishinformation i inställningarna.
        </p>
      )}
    </div>
  );
}

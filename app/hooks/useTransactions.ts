import useSWR from "swr"
import fetcher from "../lib/fetcher"
import { TransactionWithItemAndUser } from "../components/StatsPage";
import { useEffect, useState } from "react";

function isEqual(x: any, y: any): boolean {
    const ok = Object.keys, tx = typeof x, ty = typeof y;
    return x && y && tx === 'object' && tx === ty ? (
       ok(x).length === ok(y).length &&
          ok(x).every(key => isEqual(x[key], y[key]))
    ) : (x === y);
}

const groupTransactionsByDay = (transactions: TransactionWithItemAndUser[]) => {
   const today = new Date();
   const yesterday = new Date(today);
   yesterday.setDate(yesterday.getDate() - 1);
   const oneWeekAgo = new Date(today);
   oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

   const groupedTransactions: { [key: string]: TransactionWithItemAndUser[] } = {
       'Idag': [],
       'Igår': [],
       '1 vecka sedan': [],
       'Mer än 1 vecka sedan': [],
   };

   transactions.forEach((transaction) => {
       const date = new Date(transaction.createdAt);
       if (date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
           groupedTransactions['Idag'].push(transaction);
       } else if (date.setHours(0, 0, 0, 0) === yesterday.setHours(0, 0, 0, 0)) {
           groupedTransactions['Igår'].push(transaction);
       } else if (date.getTime() >= oneWeekAgo.getTime()) {
           groupedTransactions['1 vecka sedan'].push(transaction);
       } else {
           groupedTransactions['Mer än 1 vecka sedan'].push(transaction);
       }
   });

   return groupedTransactions;
}

export default function useTransactions (date: Date) {
        const { data, error, isValidating } = useSWR<TransactionWithItemAndUser[]>(`/api/transactions?date=${date}`, fetcher, {
         refreshInterval: 3000
        });

        const [transactionData, setTransactionData] = useState<{ [key: string]: TransactionWithItemAndUser[] }>({});


        useEffect(() => {
         if (!data) return;
 
         const newTransactionData = groupTransactionsByDay(data);
 
         if (!isEqual(newTransactionData, transactionData)) {
             setTransactionData(newTransactionData);
         }
     }, [data, transactionData]);

        
        
        return {
           data: transactionData, error, isValidating
        }
    }

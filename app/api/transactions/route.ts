import { getAllTransactions } from "@/app/lib/getAllTransactions";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const dateString = url.searchParams.get('date');
        const date = dateString ? new Date(dateString) : null;
        
        const transactions = await getAllTransactions(true, date);
        
        return Response.json(transactions);
    } catch (error) {
        console.log('error', error);
        return Response.json({ error });
    }
}

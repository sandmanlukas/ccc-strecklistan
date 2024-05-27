import { getAllTransactions } from "@/app/lib/getAllTransactions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const dateString = url.searchParams.get('date');
    const date = dateString ? new Date(dateString) : null;

    try {
        const transactions = await getAllTransactions(true, date);

        return NextResponse.json(transactions);
    } catch (error) {
        console.log('error', error);

        return NextResponse.json({ error });
    }
}

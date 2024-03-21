import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request): Promise<NextResponse> {
    
    const { searchParams } = new URL(request.url);
    const urlToDelete = searchParams.get('url') as string;
    
    await del(urlToDelete);

    return new NextResponse();
}



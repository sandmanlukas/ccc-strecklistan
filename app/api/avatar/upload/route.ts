import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename || !request.body) {
        throw new Error('Filename or body missing in request.');
    }

    const blob = await put(filename, request.body, {
        access: 'public',
    });

    return NextResponse.json(blob);
}


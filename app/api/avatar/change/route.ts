import { copy } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        throw new Error('URL missing in request.');
    }
    const blob = await copy(url, url, {
        access: 'public',
    });

    return NextResponse.json(blob);
}


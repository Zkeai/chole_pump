import { getPumpDetail } from '@/common/gmgn';

import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {

    const address = req.nextUrl.searchParams.get('address')

    if (!address) {
        return NextResponse.json({ success: false, error: 'address is required' }, { status: 400 });
    }

    try {

        const res = await getPumpDetail(address);

        return NextResponse.json({ success: true, message: res }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}

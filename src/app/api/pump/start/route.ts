import { solanaListener } from '@/common/pump/listenPumpCreateCoin';

import { NextResponse } from 'next/server';


export async function GET() {


    try {

        const res = await solanaListener.startListening();

        return NextResponse.json({ success: true, message: res }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}

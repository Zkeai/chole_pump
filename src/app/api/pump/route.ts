import { monitorSolanaTransactions } from '@/common/pump/listenSmartWallet';

import { NextResponse } from 'next/server';


export async function GET() {


    try {

        await monitorSolanaTransactions(["7ABz8qEFZTHPkovMDsmQkm64DZWN5wRtU7LEtD2ShkQ6", "99qdWpLPr4ZjZaaLjH7pPSB8Aymzcykb5BPLKp4o7oo4", "BtMBMPkoNbnLF9Xn552guQq528KKXcsNBNNBre3oaQtr", "71CPXu3TvH3iUKaY1bNkAAow24k6tjH473SsKprQBABC", "G1pRtSyKuWSjTqRDcazzKBDzqEF96i1xSURpiXj3yFcc", "GQva3CGJNAiBxzPYjNaamHeyQ2shnCmPpwp2bbiRW9K"])



        return NextResponse.json({ success: true, message: "交易流已启动" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}

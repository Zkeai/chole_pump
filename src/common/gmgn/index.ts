import { PumpCoin, PumpDetail } from "@/common/types/pump"



export async function getPumpList(): Promise<PumpCoin[]> {
    const res = await fetch("https://gmgn.ai/defi/quotation/v1/rank/sol/pump?limit=50&orderby=progress&direction=desc&pump=true", { cache: "no-store" })
    // 打印响应状态码和响应内容
    if (!res.ok) {
        const text = await res.text();  // 获取原始文本
        console.error("Error response:", text); // 打印错误内容
        throw new Error(`Request failed with status ${res.status}`);
    }
    const data = await res.json()

    if (data.code === 0) {
        return data.data.rank
    }
    return []
}

export async function getPumpDetail(addr: string): Promise<PumpDetail> {
    const res = await fetch(`https://gmgn.ai/defi/quotation/v1/tokens/sol/${addr}`)
    const data = await res.json()
    if (data.code === 0) {
        return data.data.token
    }
    return {} as PumpDetail
}
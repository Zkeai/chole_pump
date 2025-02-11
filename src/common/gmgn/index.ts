import { PumpDetail } from "@/common/types/pump";

async function launchBrowser() {
    const puppeteer = (await import("puppeteer")).default; // 仅在服务器端加载
    return puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
}



export async function getPumpDetail(addr: string): Promise<PumpDetail | null> {
    try {
        const url = `https://gmgn.ai/_next/data/nVVbQMQ7NG3pcNQYxV0Gs/sol/token/${addr}.json?chain=sol&token=${addr}`;
        const browser = await launchBrowser();
        const page = await browser.newPage();

        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );

        await page.goto(url, { waitUntil: "networkidle2" });
        const content = await page.evaluate(() => document.body.innerText);
        await browser.close();

        return JSON.parse(content);
    } catch (error) {
        console.error("Puppeteer error:", error);
        return null;
    }
}
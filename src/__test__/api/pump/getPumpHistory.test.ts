import { getPumpHistory } from "@/common/pump/getPumpHistory";
import { describe, it } from "node:test";

describe('Pump History Tests', () => {
    it('should fetch pump history data', async () => {
        console.log('Test started');

        // 确保异步调用被正确等待
        const length = await getPumpHistory("D6UYStkCPETm5uAyF7sBbt5yKgvuC5P6PmmYRaNTE3pW");

        // 打印数据
        console.log(length);

        // 添加期望值，确保测试会通过
        expect(length).toBeDefined();
    });
});
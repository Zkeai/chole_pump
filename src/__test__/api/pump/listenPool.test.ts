import { solanaListener } from "@/common/pump/listenPumpCreateCoin";
import { describe, it } from "node:test";


describe('Pump.Fun Listener', () => {
    it('should listen for new transactions', async () => {
        console.log('Test started');
        // 这里是你异步监听的代码逻辑
        await solanaListener.startListening();
        // 确保有至少一个期望值
        await solanaListener.stopListening()
    });
});


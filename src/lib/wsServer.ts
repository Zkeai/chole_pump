import WebSocket from "ws";
import { solanaListener } from "@/common/pump/listenPumpCreateCoin";

const wss = new WebSocket.Server({ noServer: true });

let activeConnections = 0; // 记录活跃的 WebSocket 连接数

solanaListener.setWebSocketServer(wss);

wss.on("connection", (ws) => {
    console.log("✅ 新 WebSocket 连接");


    if (!solanaListener.isListening) {
        solanaListener.startListening();
    }

    activeConnections++;

    // **定期发送 ping，防止连接被关闭**
    const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.ping(); // 发送 WebSocket 原生 ping
            console.log("🔄 发送 ping 以保持连接");
        } else {
            clearInterval(pingInterval); // 连接关闭后清除定时器
        }
    }, 30000); // 每 30 秒发送一次（根据你的服务器配置调整）

    ws.on("close", () => {
        activeConnections--;
        clearInterval(pingInterval); // 清除 ping 定时器
        console.log("❌ 客户端断开连接，当前活跃连接数:", activeConnections);

        // **如果所有 WebSocket 客户端都断开，则停止监听**
        if (activeConnections === 0) {
            solanaListener.stopListening();
            console.log("⏹️ 所有客户端断开，停止监听");
        }
    });

    solanaListener.on("newPump", (data) => {

        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
        }
    });
});

// 供服务器使用
export { wss };
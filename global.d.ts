// global.d.ts
import WebSocket from "ws";

declare global {
    let wss: WebSocket.Server | undefined; // 使用 let 替代 var
}
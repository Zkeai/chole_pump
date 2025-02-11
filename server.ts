import { createServer } from "http";
import next from "next";
import { wss } from "./src/lib/wsServer";
import { Socket } from "net";
import { Server as HttpServer } from "http";
import WebSocket from "ws";

interface ServerWithWSS extends HttpServer {
    wss?: WebSocket.Server;
}

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => handle(req, res)) as ServerWithWSS;

    server.on("upgrade", (request, socket: Socket, head) => {

        if (request.url === "/ws") {
            wss.handleUpgrade(request, socket, head, (ws) => {
                wss.emit("connection", ws, request);

            });
        } else if (request.url === "/_next/webpack-hmr") {
            return;
        } else {
            socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
            socket.destroy();
        }
    });

    server.listen(3000, () => {
        console.log("🚀 服务器运行在 http://localhost:3000");
    });

    server.wss = wss; // 确保绑定
});
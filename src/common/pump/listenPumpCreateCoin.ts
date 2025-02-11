import { EventEmitter } from 'events';
import dotenv from "dotenv";
import { Connection, ConnectionConfig, PublicKey } from "@solana/web3.js";
import { getPumpHistory } from "./getPumpHistory";

dotenv.config();
import WebSocket from "ws";

class SolanaListener extends EventEmitter {
    private connection: Connection;
    private subscriptionId: number | null = null;
    public isListening: boolean = false;
    private wss: WebSocket.Server | null = null;

    constructor() {
        super(); // 调用父类构造函数

        // 创建统一的连接配置
        function createConnection(endpoint: string) {
            if (!endpoint) {
                throw new Error("❌ ERROR: endpoint is undefined!");
            }
            const wsEndpoint = {
                httpEndpoint: endpoint.replace('wss://', 'https://'),
                wsEndpoint: endpoint
            };

            const config: ConnectionConfig = {
                wsEndpoint: wsEndpoint.wsEndpoint,
                commitment: 'confirmed'
            };

            return new Connection(wsEndpoint.httpEndpoint, config);
        }

        // 创建连接实例

        const connection = createConnection(process.env.NEXT_PUBLIC_FREE_WSS_URL!);
        this.connection = connection
    }

    async startListening() {
        if (this.isListening) {
            return { status: "already_listening" };
        }

        this.subscriptionId = this.connection.onLogs(new PublicKey(process.env.NEXT_PUBLIC_PUMP_FUN_PROGRAM!), async (logInfo) => {
            const { logs, signature } = logInfo;

            if (logs && logs.some(log => log.includes("Program log: Instruction: InitializeMint2"))) {
                try {
                    const transaction = await this.connection.getTransaction(signature, {
                        commitment: "confirmed",
                        maxSupportedTransactionVersion: 0,
                    });
                    if (transaction) {
                        const accountKeys = transaction.transaction.message.staticAccountKeys.map((key: PublicKey) => key.toBase58());
                        const devAddress = accountKeys[0];
                        const mintAddress = accountKeys[1];
                        //获取dev历史发币
                        const historyLength = await getPumpHistory(devAddress)


                        // 通过 WebSocket 发送数据到前端
                        const data = { devAddress, mintAddress, historyLength };


                        this.broadcast(data);



                    }
                } catch (err) {
                    return { status: "error", error: err };
                }
            }
        });

        this.isListening = true;
        return { status: "listening", subscriptionId: this.subscriptionId };
    }

    // 🔴 停止监听
    async stopListening() {
        if (!this.isListening || this.subscriptionId === null) {
            return { status: "not_listening" };
        }

        await this.connection.removeOnLogsListener(this.subscriptionId);
        this.subscriptionId = null;
        this.isListening = false;

        console.log("🛑 Stopped listening for transactions.");
        return { status: "stopped" };
    }

    /**
     * 绑定 WebSocket 服务器
     */
    setWebSocketServer(wss: WebSocket.Server) {
        this.wss = wss;
    }

    /**
     * 通过 WebSocket 发送数据
     */
    private broadcast(data: object) {
        if (!this.wss) return;

        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
}

export const solanaListener = new SolanaListener(); 
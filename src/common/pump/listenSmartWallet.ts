import { Connection, PublicKey, clusterApiUrl, Logs } from "@solana/web3.js";

// 创建 Solana 连接
const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

// 监听交易的函数，支持字符串数组作为输入
export async function monitorSolanaTransactions(walletAddresses: string[]): Promise<void> {
    const wallets = walletAddresses.map((address) => new PublicKey(address));

    console.log(`监听 ${wallets.length} 个钱包地址的交易...`);

    wallets.forEach((wallet) => {
        connection.onLogs(wallet, async (logs: Logs) => {
            try {

                // 获取交易详情
                const transaction = await connection.getParsedTransaction(logs.signature, {
                    maxSupportedTransactionVersion: 0,
                });

                if (!transaction) return;

                const { meta } = transaction;
                if (!meta || !meta.preBalances || !meta.postBalances) return;

                const preBalance = meta.preBalances[0] / 1e9;  // 交易前 SOL 余额
                const postBalance = meta.postBalances[0] / 1e9; // 交易后 SOL 余额
                const solSpent = preBalance - postBalance;

                if (meta.preTokenBalances && meta.postTokenBalances) {
                    meta.postTokenBalances.forEach((postToken) => {
                        const preToken = meta.preTokenBalances?.find(
                            (pre) => pre.mint === postToken.mint
                        );

                        const preAmount = preToken?.uiTokenAmount.uiAmount || 0;
                        const postAmount = postToken.uiTokenAmount?.uiAmount || 0;
                        const tokenChange = postAmount - preAmount;

                        // **卖出逻辑**：如果 SOL 增加 & 代币减少，说明钱包在卖出代币换取 SOL
                        if (solSpent < 0 && tokenChange < 0) {
                            console.log(
                                `售出：${wallet.toBase58()} sold ${Math.abs(tokenChange)} ${postToken.mint} for ${Math.abs(solSpent).toFixed(6)} SOL`
                            );
                        }

                        // **买入逻辑**：如果 SOL 减少 & 代币增加，说明钱包在使用 SOL 购买代币
                        if (solSpent > 0 && tokenChange > 0) {
                            console.log(
                                `${wallet.toBase58()} bought ${tokenChange} ${postToken.mint} with ${solSpent.toFixed(6)} SOL`
                            );
                        }
                    });
                }
            } catch (error) {
                console.error("解析交易出错:", error);
            }
        });
    });
}
import { useTonConnectUI } from "@tonconnect/ui-react";
import { Address, Sender, SenderArguments, beginCell, toNano } from "@ton/core";
import TonWeb from "tonweb";

export function useTonConnect(): { sender: Sender; connected: boolean } {
  const [tonConnectUI] = useTonConnectUI();

  return {
    sender: {
      send: async (args: SenderArguments) => {
        try {
          //添加评论的转账
          const body = beginCell()
            .storeUint(0, 32) // 写入32个零位以表示后面将跟随文本评论
            .storeStringTail("写下我们的文本评论") // 写下我们的文本评论
            .endCell();

          //Jetton 转账
          // const body = beginCell()
          //   .storeUint(0xf8a7ea5, 32) // jetton 转账操作码
          //   .storeUint(0, 64) // query_id:uint64
          //   .storeCoins(1000000) // amount:(VarUInteger 16) -  转账的 Jetton 金额（小数位 = 6 - jUSDT, 9 - 默认）
          //   .storeAddress(args.to) // destination:MsgAddress
          //   .storeAddress(
          //     Address.parse("UQD8dSuJ4zpyx146gSPk61OEi7lkWrUFy_9hr6r9K9ifovZL")
          //   ) // response_destination:MsgAddress
          //   .storeUint(0, 1) // custom_payload:(Maybe ^Cell)
          //   .storeCoins(toNano(0.05)) // forward_ton_amount:(VarUInteger 16)
          //   .storeUint(0, 1) // forward_payload:(Either Cell ^Cell)
          //   .endCell();

          const response = await tonConnectUI.sendTransaction({
            messages: [
              {
                address: args.to.toString(),
                amount: args.value.toString(),
                payload: body?.toBoc().toString("base64"),
              },
            ],
            validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
          });
          // 处理成功的交易
          console.log("Transaction successful:", response);
          try {
            const decodedBoc = TonWeb.utils.base64ToBytes(response.boc);
            console.log("解码后的BOC数据:", decodedBoc);
          } catch (error) {
            console.error("解码BOC失败:", error);
          }

          // 在这里可以更新UI或通知用户交易成功
        } catch (error) {
          // 处理失败的交易
          console.error("Transaction failed:", error);
          // 在这里可以更新UI或通知用户交易失败
        }
      },
    },
    connected: tonConnectUI.connected,
  };
}

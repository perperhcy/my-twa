import { useTonConnectUI } from '@tonconnect/ui-react';
import { Sender, SenderArguments } from '@ton/core';
import TonWeb from "tonweb";

export function useTonConnect(): { sender: Sender; connected: boolean } {
  const [tonConnectUI] = useTonConnectUI();

  return {
    sender: {
      send: async (args: SenderArguments) => {
        // tonConnectUI.sendTransaction({
        //   messages: [
        //     {
        //       address: args.to.toString(),
        //       amount: args.value.toString(),
        //       payload: args.body?.toBoc().toString('base64'),
        //     },
        //   ],
        //   validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        // });

        try {
          const response = await tonConnectUI.sendTransaction({
              messages: [
                {
                  address: args.to.toString(),
                  amount: args.value.toString(),
                  payload: args.body?.toBoc().toString('base64'),
                },
              ],
              validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
            });
          // 处理成功的交易
          console.log('Transaction successful:', response);
          try {
            const decodedBoc = TonWeb.utils.base64ToBytes(response.boc);
            console.log("解码后的BOC数据:", decodedBoc);

          } catch (error) {
            console.error("解码BOC失败:", error);
          }

          // 在这里可以更新UI或通知用户交易成功
      } catch (error) {
          // 处理失败的交易
          console.error('Transaction failed:', error);
          // 在这里可以更新UI或通知用户交易失败
      }
      },
    },
    connected: tonConnectUI.connected,
  };
}
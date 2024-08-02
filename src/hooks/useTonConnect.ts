import { useTonConnectUI } from "@tonconnect/ui-react";
import { Address, Sender, SenderArguments, beginCell, toNano } from "@ton/core";
import { JettonMaster, TonClient } from "@ton/ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import TonWeb from "tonweb";

export function useTonConnect(): { sender: Sender; connected: boolean } {
  const [tonConnectUI] = useTonConnectUI();

  //订阅钱包状态变化
  // const unsubscribe = tonConnectUI.onStatusChange((walletAndwalletInfo) => {
  //   // update state/reactive variables to show updates in the ui
  //   console.log("connected--" + tonConnectUI.connected);

  //   console.log("onStatusChange--" + walletAndwalletInfo?.account.address);
  // });

  return {
    sender: {
      send: async (args: SenderArguments) => {
        try {
          //获取钱包当前链接状态和地址
          // let currentAccount = tonConnectUI.account?.address;
          // currentAccount = Address.parseRaw(currentAccount!).toString({
          //   bounceable: false,
          // });

          // const currentIsConnectedStatus = tonConnectUI.connected;

          // alert(currentAccount + "\n" + currentIsConnectedStatus);

          // return;

          //usdt支付
          //收款方地址
          const destinationAddress = Address.parse(
            "UQD8dSuJ4zpyx146gSPk61OEi7lkWrUFy_9hr6r9K9ifovZL"
          );

          // 付款方,即用户地址
          const userAddress = Address.parse(tonConnectUI.account?.address!);

          //初始化TonClient
          const endpoint = await getHttpEndpoint({ network: "mainnet" });
          const tonClient = new TonClient({ endpoint });

          //初始化JettonMaster
          //jettonMasterAddress 决定了发起哪种代币交易,可替换成自己代币的 jettonMasterAddress
          //“EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs” 是 USDT 的 jettonMasterAddress
          const jettonMasterAddress =
            "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs";

          //发起NOT支付
          // const jettonMasterAddress =
          //   "EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT";
          const jettonMaster = tonClient.open(
            JettonMaster.create(Address.parse(jettonMasterAddress))
          );

          //获取用户的jettonWallet,发起交易是使用jettonWallet
          const jettonWallet = await jettonMaster.getWalletAddress(userAddress);

          const body = beginCell()
            .storeUint(0xf8a7ea5, 32) // jetton 转账操作码
            .storeUint(0, 64) // query id
            .storeCoins(890000) // USDT数量 *1000000;
            .storeAddress(destinationAddress) // 收款方,顺序和发送方不能搞反了
            .storeAddress(userAddress) // 发送方
            .storeUint(0, 1) // custom_payload:(Maybe ^Cell)
            .storeCoins(toNano(0.02)) // forward_ton_amount:(VarUInteger 16)
            .storeUint(0, 1) // forward_payload:(Either Cell ^Cell)
            .storeUint(0, 32) // 写入32个零位以表示后面将跟随文本评论
            .storeStringTail("123456789") // 填入我们的订单号
            .endCell();

          const response = await tonConnectUI.sendTransaction({
            validUntil: Math.floor(Date.now() / 1000) + 360, //消息有效的 UNIX 时间
            messages: [
              {
                address: jettonWallet.toString(), // 发送方 Jetton 钱包
                amount: toNano("0.1").toString(), // 用于手续费，超额部分将被退回
                payload: body.toBoc().toString("base64"), // 带有 Jetton 转账 body 的载荷
              },
            ],
          });
          // 处理成功的交易
          console.log("Transaction successful:", response);
          try {
            const decodedBoc = TonWeb.utils.base64ToBytes(response.boc);
            console.log("解码后的BOC数据:", decodedBoc);
          } catch (error) {
            console.error("解码BOC失败:", error);
          }

          // //添加评论的转账
          // const body = beginCell()
          //   .storeUint(0, 32) // 写入32个零位以表示后面将跟随文本评论
          //   .storeStringTail("写下我们的文本评论") // 写下我们的文本评论
          //   .endCell();

          // const response = await tonConnectUI.sendTransaction({
          //   messages: [
          //     {
          //       address: args.to.toString(),
          //       amount: args.value.toString(),
          //       payload: body?.toBoc().toString("base64"),
          //     },
          //   ],
          //   validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
          // });
          // // 处理成功的交易
          // console.log("Transaction successful:", response);
          // try {
          //   const decodedBoc = TonWeb.utils.base64ToBytes(response.boc);
          //   console.log("解码后的BOC数据:", decodedBoc);
          // } catch (error) {
          //   console.error("解码BOC失败:", error);
          // }

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

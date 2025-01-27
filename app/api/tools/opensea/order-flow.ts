import { MetaTransaction, SignRequestData } from "near-safe";
import { Address, getAddress } from "viem";
import { signRequestFor } from "@bitteprotocol/agent-sdk";
import { getOpenSeaSDK, createBuyOrder, createSellOrder } from "./opensea-utils";
import { Asset } from "opensea-js/lib/types";

export async function orderRequestFlow({
  chainId,
  orderRequest,
}: {
  chainId: number;
  orderRequest: {
    asset: Asset;
    accountAddress: string;
    startAmount: number;
    orderType: 'buy' | 'sell';
    expirationTime?: number;
  }
}): Promise<{
  transaction: SignRequestData;
  meta: { orderData: string };
}> {
  const { asset, accountAddress, startAmount, orderType, expirationTime } = orderRequest;

  // Create order on OpenSea
  const order = await (orderType === 'buy' 
    ? createBuyOrder({ asset, accountAddress, startAmount, expirationTime })
    : createSellOrder({ asset, accountAddress, startAmount, expirationTime }));

  if (!order) {
    throw new Error(`Failed to create ${orderType} order on OpenSea`);
  }

  // Create transaction for signing
  const metaTransactions: MetaTransaction[] = [{
    to: getAddress(order.asset.tokenAddress),
    data: order.calldata || '0x',
    value: order.basePrice?.toString() || '0'
  }];

  return {
    transaction: signRequestFor({
      chainId,
      from: getAddress(accountAddress),
      metaTransactions,
    }),
    meta: { 
      orderData: JSON.stringify({
        orderHash: order.hash,
        type: orderType,
        asset: order.asset,
        basePrice: order.basePrice?.toString()
      })
    },
  };
} 
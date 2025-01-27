import { Address, getAddress } from "viem";
import { Asset, TokenStandard } from "opensea-js/lib/types";
import { NextRequest } from "next/server";
import { isNFTAsset } from "./opensea-utils";

export interface ParsedOrderRequest {
  asset: Asset;
  accountAddress: string;
  startAmount: number;
  orderType: 'buy' | 'sell';
  expirationTime?: number;
}

export async function parseOrderRequest(
  req: NextRequest
): Promise<{
  chainId: number;
  orderRequest: ParsedOrderRequest;
}> {
  const {
    tokenAddress,
    tokenId,
    accountAddress,
    startAmount,
    orderType,
    expirationTime,
    chainId = 1
  } = await req.json();

  // Validate inputs
  if (!tokenAddress || !isNFTAsset(tokenAddress)) {
    throw new Error('Invalid token address');
  }

  if (!tokenId) {
    throw new Error('Token ID is required');
  }

  if (!accountAddress) {
    throw new Error('Account address is required');
  }

  if (!startAmount || startAmount <= 0) {
    throw new Error('Invalid start amount');
  }

  if (!['buy', 'sell'].includes(orderType)) {
    throw new Error('Invalid order type');
  }

  const asset: Asset = {
    tokenId,
    tokenAddress: getAddress(tokenAddress),
    tokenStandard: TokenStandard.ERC721
  };

  return {
    chainId,
    orderRequest: {
      asset,
      accountAddress,
      startAmount,
      orderType,
      expirationTime
    }
  };
} 
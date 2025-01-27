import { OpenSeaSDK, Network } from 'opensea-js';
import Web3 from 'web3';
import { Asset, OpenSeaAsset } from 'opensea-js/lib/types';
import { MetaTransaction } from 'near-safe';
import { Address, getAddress } from 'viem';


export function getOpenSeaSDK(chainId: number) {
  const provider = new Web3.providers.HttpProvider(process.env.INFURA_URL || 'https://mainnet.infura.io');
  
  return new OpenSeaSDK(provider, {
    networkName: chainId === 1 ? Network.Main : Network.Rinkeby,
    apiKey: process.env.OPENSEA_API_KEY
  });
}

export async function getAssetDetails(tokenAddress: string, tokenId: string): Promise<OpenSeaAsset> {
  const sdk = getOpenSeaSDK(1); // Mainnet
  
  return sdk.api.getAsset({
    tokenAddress,
    tokenId
  });
}

export async function createBuyOrder(args: {
  asset: Asset,
  accountAddress: string,
  startAmount: number,
  expirationTime?: number
}) {
  const sdk = getOpenSeaSDK(1);
  const { asset, accountAddress, startAmount, expirationTime } = args;

  return sdk.createBuyOrder({
    asset,
    accountAddress,
    startAmount,
    expirationTime: expirationTime || Math.round(Date.now() / 1000 + 60 * 60 * 24) // 24 hours from now
  });
}

export async function createSellOrder(args: {
  asset: Asset,
  accountAddress: string,
  startAmount: number,
  expirationTime?: number
}) {
  const sdk = getOpenSeaSDK(1);
  const { asset, accountAddress, startAmount, expirationTime } = args;

  return sdk.seaport_v1_6.createOrder({
    asset,
    accountAddress,
    startAmount,
    expirationTime: expirationTime || Math.round(Date.now() / 1000 + 60 * 60 * 24)
  });
}

export function isNFTAsset(tokenAddress: string): boolean {
  // Basic check - could be enhanced with actual contract verification
  return tokenAddress.length === 42 && tokenAddress.startsWith('0x');
} 
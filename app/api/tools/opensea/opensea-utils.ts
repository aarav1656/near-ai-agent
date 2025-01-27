import { OpenSeaSDK } from 'opensea-js';
import { ethers } from 'ethers';
import { Asset, Chain, TokenStandard } from 'opensea-js/lib/types';
import { MetaTransaction } from 'near-safe';
import { Address, getAddress } from 'viem';

export function getOpenSeaSDK(chainId: number) {
  const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL || 'https://mainnet.infura.io/v3/your-infura-key');
  
  return new OpenSeaSDK(provider, {
    chain: chainId === 1 ? Chain.Mainnet : Chain.Sepolia,
    apiKey: process.env.OPENSEA_API_KEY
  });
}

export async function getAssetDetails(tokenAddress: string, tokenId: string) {
  const sdk = getOpenSeaSDK(1);
  
   const nft = await sdk.api.getNFT(
    tokenAddress,
    tokenId
  );

  return nft;
}

export async function createBuyOrder(args: {
  asset: Asset,
  accountAddress: string,
  startAmount: number,
  expirationTime?: number
}) {
  const sdk = getOpenSeaSDK(1);
  const { asset, accountAddress, startAmount, expirationTime } = args;

  return sdk.createOffer({
    asset: {
      tokenId: asset.tokenId!,
      tokenAddress: asset.tokenAddress,
      tokenStandard: TokenStandard.ERC721
    },
    accountAddress,
    startAmount: startAmount.toString(),
    expirationTime: expirationTime || Math.round(Date.now() / 1000 + 60 * 60 * 24)
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

  return sdk.createListing({
    asset: {
      tokenId: asset.tokenId!,
      tokenAddress: asset.tokenAddress,
      tokenStandard: TokenStandard.ERC721
    },
    accountAddress,
    startAmount: startAmount.toString(),
    expirationTime: expirationTime || Math.round(Date.now() / 1000 + 60 * 60 * 24)
  });
}

export function isNFTAsset(tokenAddress: string): boolean {
  return tokenAddress.length === 42 && tokenAddress.startsWith('0x');
} 
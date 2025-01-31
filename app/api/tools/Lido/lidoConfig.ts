// lidoConfig.ts
import { LidoSDK } from '@lidofinance/lido-ethereum-sdk';
import { createPublicClient, http } from 'viem';
import { holesky } from 'viem/chains';

const rpcProvider = createPublicClient({
  chain: holesky,
  transport: http(),
});

export const lidoSDK = new LidoSDK({
  chainId: 17000,
  rpcProvider,
  web3Provider: undefined, // Set this if you have a web3 provider
});
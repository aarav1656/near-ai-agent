import { getAddress } from "viem";
import { orderRequestFlow } from "../../api/tools/uniswap/orderFlow";

// Safe Associated with max-normal.near on Bitte Wallet.
const DEPLOYED_SAFE = getAddress("0x54F08c27e75BeA0cdDdb8aA9D69FD61551B19BbA");

const chainId = 8453; // BASE
const quoteRequest = {
  chainId,
  walletAddress: DEPLOYED_SAFE,
  sellToken: getAddress("0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"), // USDC
  buyToken: getAddress("0x4200000000000000000000000000000000000006"), // WETH
  amount: 1000000n,
};

describe("Uniswap Plugin", () => {
  // Swaps 1 USDC to WETH on BASE Chain using Uniswap API
  it.skip("orderRequestFlow", async () => {
    const signRequest = await orderRequestFlow({
      chainId,
      quoteRequest,
    });
    console.log(JSON.stringify(signRequest, null, 2));
    console.log(
      `https://wallet.bitte.ai/sign-evm?evmTx=${encodeURI(JSON.stringify(signRequest.transaction))}`,
    );
  }, 10000);
});
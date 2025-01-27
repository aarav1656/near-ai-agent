import { getClient, MetaTransaction, SignRequestData } from "near-safe";
import { ParsedQuoteRequest } from "./parse";
import { Address, erc20Abi, getAddress } from "viem";
import { signRequestFor } from "@bitteprotocol/agent-sdk";
import { getRoute } from "./quote";
import { Token } from "@uniswap/sdk-core";
import { sellTokenApprovalTx } from "./uniswap-utils";

// https://docs.uniswap.org/sdk/v3/guides/swaps/routing
export async function orderRequestFlow({
  chainId,
  quoteRequest,
}: ParsedQuoteRequest): Promise<{
  transaction: SignRequestData;
  meta: { orderData: string };
}> {
  const [sellToken, buyToken] = await Promise.all([
    getToken(chainId, quoteRequest.sellToken),
    getToken(chainId, quoteRequest.buyToken),
  ]);
  const route = await getRoute(
    chainId,
    quoteRequest.amount,
    sellToken,
    buyToken,
    quoteRequest.walletAddress,
  );
  if (!route || !route.methodParameters) {
    // Handle failed request
    throw new Error(
      `Failed to get route on ${chainId} for ${JSON.stringify(quoteRequest)}`,
    );
  }
  const metaTransactions: MetaTransaction[] = [];
  const approvalTx = await sellTokenApprovalTx({
    fromTokenAddress: sellToken.address,
    chainId,
    from: quoteRequest.walletAddress,
    spender: getSwapRouterAddress(chainId),
    sellAmount: quoteRequest.amount.toString(),
  });
  if (approvalTx) {
    console.log("prepending approval");
    // TODO: Update approval address.
    metaTransactions.push(approvalTx);
  }
  const swapTx = {
    to: getSwapRouterAddress(chainId),
    data: route.methodParameters.calldata,
    value: route.methodParameters.value,
  };
  metaTransactions.push(swapTx);
  return {
    transaction: signRequestFor({
      chainId,
      from: getAddress(quoteRequest.walletAddress),
      metaTransactions,
    }),
    meta: { orderData: "Uniswap Order Data" },
  };
}

export async function getToken(
  chainId: number,
  address: Address,
): Promise<Token> {
  const client = getClient(chainId);
  const [decimals, symbol, name] = await Promise.all([
    client.readContract({
      abi: erc20Abi,
      address,
      functionName: "decimals",
    }),
    client.readContract({
      abi: erc20Abi,
      address,
      functionName: "symbol",
    }),
    client.readContract({
      abi: erc20Abi,
      address,
      functionName: "name",
    }),
  ]);
  return new Token(chainId, address, decimals, symbol, name);
}

function getSwapRouterAddress(chainId: number): Address {
  if (chainId === 8453) {
    return "0x2626664c2603336E57B271c5C0b26F421741e481";
  }
  if (chainId === 42220) {
    return "0x5615CDAb10dc425a742d643d949a7F474C01abc4";
  }
  return "0xE592427A0AEce92De3Edee1F18E0157C05861564";
}
import {
    BlockchainMapping,
    loadTokenMap,
    checkAllowance,
    erc20Approve,
  } from "@bitteprotocol/agent-sdk";
  import { Address, getAddress } from "viem";
  import { MetaTransaction } from "near-safe";
  
  // TODO: fix this
  // export async function validateExpressRequest(
  //   req: Request,
  //   safeSaltNonce?: string,
  // ): Promise<ExpressResponse | null> {
  //   return validateRequest<Request, Response>(
  //     req,
  //     safeSaltNonce || "0",
  //     (data: unknown, init?: { status?: number }) =>
  //       Response.json(data, init),
  //   );
  // }
  
  // CoW (and many other Dex Protocols use this to represent native asset).
  export const NATIVE_ASSET = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  
  export async function sellTokenApprovalTx(args: {
    from: string;
    fromTokenAddress: string;
    spender: Address;
    chainId: number;
    sellAmount: string;
  }): Promise<MetaTransaction | null> {
    const {
      from,
      fromTokenAddress: sellToken,
      chainId,
      sellAmount,
      spender,
    } = args;
    console.log(
      `Checking approval for account=${from}, token=${sellToken} on chainId=${chainId}`,
    );
    const allowance = await checkAllowance(
      getAddress(from),
      getAddress(sellToken),
      spender,
      chainId,
    );
  
    if (allowance < BigInt(sellAmount)) {
      // Insufficient allowance
      return erc20Approve({
        token: getAddress(sellToken),
        spender,
      });
    }
    return null;
  }
  
  export function isNativeAsset(token: string): boolean {
    return token.toLowerCase() === NATIVE_ASSET.toLowerCase();
  }
  
  export enum OrderKind {
    BUY = "buy",
    SELL = "sell",
  }
  
  export function applySlippage(
    order: { kind: OrderKind; buyAmount: string; sellAmount: string },
    bps: number,
  ): { buyAmount?: string; sellAmount?: string } {
    const scaleFactor = BigInt(10000);
    if (order.kind === OrderKind.SELL) {
      const slippageBps = BigInt(10000 - bps);
      return {
        buyAmount: (
          (BigInt(order.buyAmount) * slippageBps) /
          scaleFactor
        ).toString(),
      };
    } else if (order.kind === OrderKind.BUY) {
      const slippageBps = BigInt(10000 + bps);
      return {
        sellAmount: (
          (BigInt(order.sellAmount) * slippageBps) /
          scaleFactor
        ).toString(),
      };
    }
    return order;
  }
  
  function getEnvVar(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`${key} is not set`);
    }
    return value;
  }
  export function getZerionKey(): string {
    const zerionKey = process.env.ZERION_KEY;
    if (!zerionKey) {
      throw new Error("ZERION_KEY is not set");
    }
    return zerionKey;
  }
  
  export function getSafeSaltNonce(): string {
    const bitteProtocolSaltNonce = "130811896738364156958237239906781888512";
    return process.env.SAFE_SALT_NONCE || bitteProtocolSaltNonce;
  }
  
  let tokenMapInstance: BlockchainMapping | null = null;
  
  export async function getTokenMap(): Promise<BlockchainMapping> {
    if (tokenMapInstance) {
      return tokenMapInstance;
    }
    console.log("Loading TokenMap...");
    tokenMapInstance = await loadTokenMap(getEnvVar("TOKEN_MAP_URL"));
    return tokenMapInstance;
  }
const {
    applySlippage,
    isNativeAsset,
    NATIVE_ASSET,
    OrderKind,
    sellTokenApprovalTx,
  } = require("../../api/tools/uniswap/uniswap-utils");
  const { checksumAddress, getAddress, zeroAddress } = require("viem");
  
  const SEPOLIA_DAI = getAddress("0xb4f1737af37711e9a5890d9510c9bb60e170cb0d");
  const SEPOLIA_COW = getAddress("0x0625afb445c3b6b7b929342a04a22599fd5dbb59");
  // Safe Associated with neareth-dev.testnet on Bitte Wallet.
  const DEPLOYED_SAFE = getAddress("0x5E1E315D96BD81c8f65c576CFD6E793aa091b480");
  
  const chainId = 11155111;
  
  // safe relayer contract address https://sepolia.etherscan.io/address/0xc92e8bdf79f0507f65a392b0ab4667716bfe0110#code
  const spender = getAddress("0xc92e8bdf79f0507f65a392b0ab4667716bfe0110"); // GPv2VaultRelayer
  
  describe("Uniswap Plugin", () => {
    it("applySlippage", async () => {
      const amounts = { buyAmount: "1000", sellAmount: "1000" };
      expect(
        applySlippage({ kind: OrderKind.BUY, ...amounts }, 50),
      ).toStrictEqual({
        sellAmount: "1005",
      });
      expect(
        applySlippage({ kind: OrderKind.SELL, ...amounts }, 50),
      ).toStrictEqual({
        buyAmount: "995",
      });
  
      const smallAmounts = { buyAmount: "100", sellAmount: "100" };
      expect(
        applySlippage({ kind: OrderKind.BUY, ...smallAmounts }, 100),
      ).toStrictEqual({
        sellAmount: "101",
      });
      expect(
        applySlippage({ kind: OrderKind.SELL, ...smallAmounts }, 100),
      ).toStrictEqual({
        buyAmount: "99",
      });
    });
    it("isNativeAsset", () => {
      expect(isNativeAsset("word")).toBe(false);
      expect(isNativeAsset(NATIVE_ASSET)).toBe(true);
      expect(isNativeAsset(NATIVE_ASSET.toLowerCase())).toBe(true);
      expect(isNativeAsset(checksumAddress(NATIVE_ASSET))).toBe(true);
      expect(isNativeAsset("0xb4f1737af37711e9a5890d9510c9bb60e170cb0d")).toBe(
        false,
      );
    });
  
    it("sellTokenApprovalTx: null - already approved", async () => {
      // already approved
      expect(
        await sellTokenApprovalTx({
          from: "0x7fa8e8264985C7525Fc50F98aC1A9b3765405489",
          fromTokenAddress: SEPOLIA_DAI,
          spender,
          sellAmount: "100",
          chainId,
        }),
      ).toStrictEqual(null);
    });
  
    it("sellTokenApprovalTx: not null - not approved", async () => {
      // Not approved
  
      expect(
        await sellTokenApprovalTx({
          from: zeroAddress, // Will never be approved
          fromTokenAddress: SEPOLIA_COW,
          spender,
          sellAmount: "100",
          chainId,
        }),
      ).toStrictEqual({
        to: SEPOLIA_COW,
        value: "0x0",
        data: "0x095ea7b3000000000000000000000000c92e8bdf79f0507f65a392b0ab4667716bfe0110ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      });
    });
  
    it("sellTokenApprovalTx: throws - not a token", async () => {
      // Not a token.
      await expect(
        sellTokenApprovalTx({
          from: DEPLOYED_SAFE,
          fromTokenAddress: zeroAddress, // Not a token
          spender,
          sellAmount: "100",
          chainId,
        }),
      ).rejects.toThrow();
    });
  });
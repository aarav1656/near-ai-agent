// lido.ts
import { getBalanceETH, stakeEth } from './lidoUtils';

// Example usage
async function main() {
  const address = '<YOUR_ADDRESS>'; // Replace with actual address
  await getBalanceETH(address);
  
  const value = 1000000000000000000n; // Example value (1 ETH in wei)
  await stakeEth(value);
}

main().catch(console.error);
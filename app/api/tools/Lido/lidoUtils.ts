// lidoUtils.ts
import { lidoSDK } from './lidoConfig';

export async function getBalanceETH(address: string) {
  const balanceETH = await lidoSDK.core.balanceETH(address);
  console.log(balanceETH.toString(), 'ETH balance');
  return balanceETH;
}

export async function stakeEth(value: bigint, callback?: Function, referralAddress?: string) {
  const stakeTx = await lidoSDK.stake.stakeEth({
    value,
    callback,
    referralAddress,
  })// lidoUtils.ts
  import { lidoSDK } from './lidoConfig';
  
  // Get ETH balance
  export async function getBalanceETH(address: string) {
    const balanceETH = await lidoSDK.core.balanceETH(address);
    console.log(balanceETH.toString(), 'ETH balance');
    return balanceETH;
  }
  
  // Stake ETH
  export async function stakeEth(value: bigint, callback?: Function, referralAddress?: string) {
    const stakeTx = await lidoSDK.stake.stakeEth({
      value,
      callback,
      referralAddress,
    });
    console.log(stakeTx, 'stake tx result');
    return stakeTx;
  }
  
  // Request withdrawal
  export async function requestWithdrawal(amount: bigint, token: string) {
    const requestTx = await lidoSDK.withdraw.request.requestWithdrawalWithPermit({
      amount,
      token,
    });
    console.log(requestTx.result.requests, 'array of created requests');
    return requestTx;
  }
  
  // Wrap ETH
  export async function wrapEth(value: bigint, account: string) {
    const wrapTx = await lidoSDK.wrap.wrapEth({
      value,
      account,
    });
    const { stethWrapped, wstethReceived } = wrapTx.result;
    console.log({ stethWrapped, wstethReceived }, 'wrap result');
    return wrapTx;
  }
  
  // Additional utility functions can be added here;
  console.log(stakeTx, 'stake tx result');
  return stakeTx;
}

// Additional utility functions can be added here
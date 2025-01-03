import { NextResponse } from 'next/server';
import { Bitcoin } from '../../../utils/bitcoin';
import { Wallet } from '../../../utils/near-wallet';
import { headers } from 'next/headers';

// Initialize Bitcoin client with testnet configuration
const bitcoin = new Bitcoin('https://mempool.space/testnet/api', 'testnet');


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
    }

    const headersList = headers();
    const mbMetadata = JSON.parse(headersList.get('mb-metadata') || '{}');
    const accountId = mbMetadata?.accountData?.accountId || 'near';

    // Derive Bitcoin address from path
    const { address: derivedAddress } = await bitcoin.deriveAddress(accountId, path);
    
    // Get balance
    const balance = await bitcoin.getBalance(derivedAddress);

    return NextResponse.json({
      derivedAddress,
      balance: Bitcoin.toBTC(balance)
    });
  } catch (error) {
    console.error('Error getting Bitcoin address and balance:', error);
    return NextResponse.json({ error: 'Failed to get Bitcoin address and balance' }, { status: 500 });
  }
}

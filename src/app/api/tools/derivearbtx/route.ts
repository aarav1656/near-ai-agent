// write code for arbitrum support

import { NextResponse } from 'next/server';
import { Arbitrum } from '../../../utils/arbitrum';
import { headers } from 'next/headers';

// Initialize Arbitrum client with testnet configuration
const arbitrum = new Arbitrum(
  process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || '', // Replace with your Arbitrum RPC URL
  'sepolia' // or 'mainnet' for production
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
    }
    console.log(path , "from get req")

    const headersList = headers();
    const mbMetadata = JSON.parse(headersList.get('mb-metadata') || '{}');
    console.log(mbMetadata , "from deriveethtxn req")
    const accountId = mbMetadata?.accountData?.accountId || 'kamalwillwin.near';

    console.log(accountId , "from deriveethtxn req")
    
    // Derive Arbitrum address from path
    const { address: derivedAddress, publicKey } = await arbitrum.deriveAddress(accountId, path);

    // Get balance in ETH
    const balance = await arbitrum.getBalance(derivedAddress);
    console.log(balance , "from get req")

    return NextResponse.json({
      derivedAddress,
      publicKey: publicKey.toString('hex'),
      balance: balance // Balance is already in ETH format from the arbitrum.js utility
    });

  } catch (error: any) {
    console.error('Error getting Arbitrum address and balance:', error);
    return NextResponse.json({ 
      error: 'Failed to get Arbitrum address and balance',
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({
    message: 'Use GET method to derive Arbitrum address'
  }, { status: 405 });
}

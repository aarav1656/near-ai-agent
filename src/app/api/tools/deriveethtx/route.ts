import { NextResponse } from 'next/server';
import { Ethereum } from '../../../utils/ethereum';
import { headers } from 'next/headers';

// Initialize Ethereum client with testnet (Sepolia) configuration
const ethereum = new Ethereum(
  process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || '', // Replace with your Ethereum RPC URL
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
    
    // Derive Ethereum address from path
    const { address: derivedAddress, publicKey } = await ethereum.deriveAddress(accountId, path);

    // Get balance in ETH
    const balance = await ethereum.getBalance(derivedAddress);
    console.log(balance , "from get req")

    return NextResponse.json({
      derivedAddress,
      publicKey: publicKey.toString('hex'),
      balance: balance // Balance is already in ETH format from the ethereum.js utility
    });

  } catch (error: any) {
    console.error('Error getting Ethereum address and balance:', error);
    return NextResponse.json({ 
      error: 'Failed to get Ethereum address and balance',
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({
    message: 'Use GET method to derive Ethereum address'
  }, { status: 405 });
} 
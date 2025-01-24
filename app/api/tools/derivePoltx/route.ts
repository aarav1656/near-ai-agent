import { NextResponse } from 'next/server';
import { Polygon } from '../../../utils/polygon';
import { headers } from 'next/headers';

// Initialize Polygon client with testnet (Amoy) configuration
const polygon = new Polygon(
  process.env.NEXT_PUBLIC_POLYGON_RPC_URL || '', // Replace with your Polygon RPC URL
  'amoy' // or 'mainnet' for production
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
    }
    console.log(path, "from get req");

    const headersList = headers();
    const mbMetadata = JSON.parse(headersList.get('mb-metadata') || '{}');
    console.log(mbMetadata, "from derivepolygontxn req");
    const accountId = mbMetadata?.accountData?.accountId || 'kamalwillwin.near';

    console.log(accountId, "from derivepolygontxn req");

    // Derive Polygon address from path
    const { address: derivedAddress, publicKey } = await polygon.deriveAddress(accountId, path);

    // Get balance in MATIC
    const balance = await polygon.getBalance(derivedAddress);
    console.log(balance, "from get req");

    return NextResponse.json({
      derivedAddress,
      publicKey: publicKey.toString('hex'),
      balance: balance // Balance is already in MATIC format from the polygon.js utility
    });

  } catch (error: any) {
    console.error('Error getting Polygon address and balance:', error);
    return NextResponse.json({ 
      error: 'Failed to get Polygon address and balance',
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({
    message: 'Use GET method to derive Polygon address'
  }, { status: 405 });
}
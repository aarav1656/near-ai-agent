import { NextResponse } from 'next/server';
import { Bitcoin } from '../../../utils/bitcoin';
import { headers } from 'next/headers';

// Initialize Bitcoin client with testnet configuration
const bitcoin = new Bitcoin('https://mempool.space/testnet/api', 'testnet');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    const to = searchParams.get('to');

    const amount = searchParams.get('amount');

    if (!path || !to || !amount) {
      return NextResponse.json({ error: 'Missing required parameters: path, to, or amount' }, { status: 400 });
    }

    // Derive Bitcoin address from path
    const headersList = headers();
    const mbMetadata = JSON.parse(headersList.get('mb-metadata') || '{}');
    const accountId = mbMetadata?.accountData?.accountId || 'kamalwillwin.near';

    const { address: fromAddress, publicKey } = await bitcoin.deriveAddress(accountId, path);
    
    // Convert amount to satoshis
    const satoshis = Bitcoin.toSatoshi(Number(amount));

    // Create transaction payload
    const btcPayload = await bitcoin.createPayload(fromAddress, to, satoshis);

    return NextResponse.json({
      fromAddress,
      to,
      amount: Bitcoin.toBTC(satoshis),
      txPayload: btcPayload
    });
  } catch (error) {
    console.error('Error generating Bitcoin transaction:', error);
    return NextResponse.json({ error: 'Failed to generate Bitcoin transaction' }, { status: 500 });
  }
}

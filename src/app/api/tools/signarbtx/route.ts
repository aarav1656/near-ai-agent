// add
import { NextResponse } from 'next/server';
import { Arbitrum } from '../../../utils/arbitrum';
import { Wallet } from '../../../utils/near-wallet';

// Initialize Arbitrum client with testnet configuration
const arbitrum = new Arbitrum(process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || '', 'testnet');

export async function POST(request: Request) {
  try {
    const { path, unsignedTx, publicKey } = await request.json();

    console.log(path, unsignedTx, publicKey, "from post req");
    if (!path || !unsignedTx || !publicKey) {
      return NextResponse.json(
        { error: 'Missing required parameters: path, unsignedTx, or publicKey' },
        { status: 400 }
      );
    }

    // Initialize NEAR wallet
    const wallet = new Wallet({ 
      networkId: 'testnet',
      createAccessKeyFor: process.env.CONTRACT_ID || ''
    });

    try {
      // Request signature from MPC through NEAR wallet
      const signedTx = await arbitrum.requestSignatureToMPC(
        wallet,
        process.env.CONTRACT_ID!,
        path,
        unsignedTx,
        Buffer.from(publicKey, 'hex')
      );

      return NextResponse.json({
        success: true,
        signedTransaction: signedTx
      });

    } catch (error: any) {
      console.error('Error signing transaction:', error);
      return NextResponse.json({
        error: 'Failed to sign transaction',
        details: error.message
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error processing request:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to sign Arbitrum transactions'
  }, { status: 405 });
}

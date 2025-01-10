import { NextResponse } from 'next/server';
import { Bitcoin } from '../../../utils/bitcoin';
import { Wallet } from '../../../utils/near-wallet';

// Initialize Bitcoin client with testnet configuration
const bitcoin = new Bitcoin('https://mempool.space/testnet/api', 'testnet');

export async function POST(request: Request) {
  try {
    const { path, unsignedTx, publicKey } = await request.json();

        console.log(path , unsignedTx , publicKey , "from post req")
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
      const signedTx = await bitcoin.requestSignatureToMPC(
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
    message: 'Use POST method to sign Bitcoin transactions'
  }, { status: 405 });
}

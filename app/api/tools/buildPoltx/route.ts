import { NextResponse } from 'next/server';
import { Polygon } from '../../../utils/polygon';
import { Wallet } from '../../../utils/near-wallet';
import { deriveChildPublicKey, najPublicKeyStrToUncompressedHexPoint, uncompressedHexPointToEvmAddress } from '../../../utils/kdf';

const polygon = new Polygon(process.env.NEXT_PUBLIC_POLYGON_RPC_URL || '', 'matic');
const MPC_CONTRACT_ID = 'v1.signer-prod.testnet';
const wallet = new Wallet({ networkId: 'testnet', createAccessKeyFor: MPC_CONTRACT_ID });

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sender = searchParams.get('sender');
    const receiver = searchParams.get('receiver');
    const amount = searchParams.get('amount');
    const data = searchParams.get('data') || '0x';
    const accountId = searchParams.get('accountId');
    const path = searchParams.get('path') || '';

    console.log(sender, receiver, amount, accountId, path, "from buildeth req");
    if (!sender || !receiver || !amount || !accountId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Derive Polygon address
    const { address: derivedAddress } = await polygon.deriveAddress(accountId, path);

    console.log(derivedAddress.toLowerCase(), sender.toLowerCase(), "compare");
    if (derivedAddress.toLowerCase() !== sender.toLowerCase()) {
      return NextResponse.json({ error: 'Derived address does not match sender' }, { status: 400 });
    }

    // Create transaction payload
    const { payload } = await polygon.createPayload(sender, receiver, amount, data);

    // Request signature from MPC
    const { big_r, s, recovery_id } = await polygon.requestSignatureToMPC(wallet, MPC_CONTRACT_ID, path, payload);

    // Reconstruct and verify signature
    const signedTransaction = await polygon.reconstructSignatureFromLocalSession(big_r, s, recovery_id, sender);

    // Relay transaction
    const txHash = await polygon.relayTransaction(signedTransaction);

    return NextResponse.json({ txHash });
  } catch (error) {
    console.error('Error building and executing Polygon transaction:', error);
    return NextResponse.json({ error: 'Failed to build and execute Polygon transaction' }, { status: 500 });
  }
}

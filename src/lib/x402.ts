// x402 Payment Protocol Mock Implementation
// Based on x402 starter kit patterns for Avalanche C-Chain

export const AVALANCHE_TESTNET = {
  chainId: 43113,
  name: 'Avalanche Fuji Testnet',
  rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
  explorerUrl: 'https://testnet.snowtrace.io',
};

export const SUPPORTED_ASSETS = {
  AVAX: {
    symbol: 'AVAX',
    name: 'Avalanche',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000', // Native token
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    address: '0x5425890298aed601595a70AB815c96711a31Bc65', // Fuji testnet USDC
  },
};

export interface X402PaymentRequest {
  amount: string;
  asset: 'USDC' | 'AVAX';
  recipient: string;
  memo?: string;
}

export interface X402PaymentResponse {
  success: boolean;
  txHash?: string;
  error?: string;
}

// Simulate HTTP 402 Payment Required flow
export async function initiatePayment(
  request: X402PaymentRequest
): Promise<{ status: 402; paymentDetails: X402PaymentRequest }> {
  // In real implementation, this would return HTTP 402 with payment requirements
  return {
    status: 402,
    paymentDetails: request,
  };
}

// Simulate X-PAYMENT header verification and on-chain settlement
export async function processPayment(
  paymentHeader: string,
  paymentSignature: string
): Promise<X402PaymentResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock successful payment (in production, this verifies signature and settles on-chain)
  const mockTxHash = `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;

  return {
    success: true,
    txHash: mockTxHash,
  };
}

// Format amount for display
export function formatAmount(amount: number, asset: 'USDC' | 'AVAX'): string {
  const decimals = asset === 'USDC' ? 2 : 4;
  return `${amount.toFixed(decimals)} ${asset}`;
}

// Mock Core Wallet connection
export async function connectCoreWallet(): Promise<{ address: string; connected: boolean }> {
  // Simulate wallet connection
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  // Generate mock address
  const mockAddress = `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`;
  
  return {
    address: mockAddress,
    connected: true,
  };
}

// Generate payment header (mock)
export function generatePaymentHeader(
  amount: string,
  asset: string,
  recipient: string
): { 'X-Payment': string; 'X-Payment-Signature': string } {
  const paymentData = btoa(JSON.stringify({ amount, asset, recipient, timestamp: Date.now() }));
  const mockSignature = btoa(`sig-${Math.random().toString(36).slice(2)}`);
  
  return {
    'X-Payment': paymentData,
    'X-Payment-Signature': mockSignature,
  };
}

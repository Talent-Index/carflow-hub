import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PaymentRequirements {
  resource: string;
  price: string;
  asset: string;
  network: string;
  recipient: string;
  facilitatorUrl: string;
}

interface X402Response<T> {
  success: boolean;
  data?: T;
  error?: string;
  paymentRequirements?: PaymentRequirements;
}

interface PaymentState {
  status: 'idle' | 'requires_payment' | 'signing' | 'settling' | 'complete' | 'error';
  requirements?: PaymentRequirements;
  error?: string;
}

// Simulated Core Wallet signing for testnet
async function signPaymentWithCoreWallet(
  requirements: PaymentRequirements
): Promise<string> {
  // In production, this would use Core Wallet SDK to:
  // 1. Connect to wallet
  // 2. Request signature for payment
  // 3. Submit transaction via facilitator
  // 4. Return transaction hash
  
  // For demo, simulate the signing and settlement
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const mockTxHash = `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2, 18)}`;
  
  return JSON.stringify({
    txHash: mockTxHash,
    amount: requirements.price,
    asset: requirements.asset,
    network: requirements.network,
    recipient: requirements.recipient,
    timestamp: new Date().toISOString(),
  });
}

export async function callPaidResource<T>(
  functionName: string,
  body: Record<string, unknown>,
  onStateChange?: (state: PaymentState) => void
): Promise<X402Response<T>> {
  try {
    // Initial call without X-Payment header
    onStateChange?.({ status: 'idle' });
    
    console.log(`[x402-client] Calling ${functionName} without payment`);
    
    const { data, error } = await supabase.functions.invoke(functionName, {
      body,
    });

    // Check if payment is required (402 response)
    if (error?.message?.includes('402') || data?.paymentRequirements) {
      const requirements = data?.paymentRequirements as PaymentRequirements;
      
      if (!requirements) {
        throw new Error('Payment required but no requirements provided');
      }

      console.log('[x402-client] Payment required:', requirements);
      onStateChange?.({ status: 'requires_payment', requirements });
      
      // Show payment modal/confirmation
      toast({
        title: 'Payment Required',
        description: `${requirements.price} ${requirements.asset} needed for this service`,
      });

      // Sign payment with Core Wallet
      onStateChange?.({ status: 'signing', requirements });
      console.log('[x402-client] Signing payment with Core Wallet');
      
      const xPaymentHeader = await signPaymentWithCoreWallet(requirements);
      
      // Retry with X-Payment header
      onStateChange?.({ status: 'settling', requirements });
      console.log('[x402-client] Retrying with X-Payment header');
      
      const { data: paidData, error: paidError } = await supabase.functions.invoke(functionName, {
        body,
        headers: {
          'X-Payment': xPaymentHeader,
        },
      });

      if (paidError) {
        console.error('[x402-client] Payment failed:', paidError);
        onStateChange?.({ status: 'error', error: paidError.message });
        return {
          success: false,
          error: paidError.message,
        };
      }

      console.log('[x402-client] Payment successful:', paidData);
      onStateChange?.({ status: 'complete' });
      
      toast({
        title: 'Payment Successful',
        description: `Transaction confirmed on Avalanche`,
      });

      return {
        success: true,
        data: paidData as T,
      };
    }

    if (error) {
      console.error('[x402-client] API error:', error);
      onStateChange?.({ status: 'error', error: error.message });
      return {
        success: false,
        error: error.message,
      };
    }

    // Success without payment needed
    onStateChange?.({ status: 'complete' });
    return {
      success: true,
      data: data as T,
    };

  } catch (err) {
    console.error('[x402-client] Error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    onStateChange?.({ status: 'error', error: message });
    return {
      success: false,
      error: message,
    };
  }
}

// Convenience functions for specific resources
export async function startWash(
  vehicleId: string,
  branchId: string,
  operatorId: string,
  washType: 'basic' | 'standard' | 'premium' | 'deluxe',
  customerId?: string,
  onStateChange?: (state: PaymentState) => void
) {
  return callPaidResource('x402-wash-start', {
    vehicleId,
    branchId,
    operatorId,
    washType,
    customerId,
  }, onStateChange);
}

export async function startService(
  vehicleId: string,
  branchId: string,
  operatorId: string,
  serviceType: 'oil_change' | 'tire_rotation' | 'brake_service' | 'inspection' | 'other',
  options?: {
    description?: string;
    mileage?: number;
    customerId?: string;
  },
  onStateChange?: (state: PaymentState) => void
) {
  return callPaidResource('x402-service-start', {
    vehicleId,
    branchId,
    operatorId,
    serviceType,
    ...options,
  }, onStateChange);
}

// Wash prices for UI display
export const WASH_PRICES = {
  basic: 5.00,
  standard: 10.00,
  premium: 18.00,
  deluxe: 25.00,
};

// Service prices for UI display
export const SERVICE_PRICES = {
  oil_change: 45.00,
  tire_rotation: 25.00,
  brake_service: 150.00,
  inspection: 35.00,
  other: 50.00,
};

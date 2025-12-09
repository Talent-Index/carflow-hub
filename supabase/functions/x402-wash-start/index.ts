import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-payment',
  'Access-Control-Expose-Headers': 'x-payment-response',
};

interface WashStartRequest {
  vehicleId: string;
  branchId: string;
  operatorId: string;
  washType: 'basic' | 'standard' | 'premium' | 'deluxe';
  customerId?: string;
}

interface PaymentRequirements {
  resource: string;
  price: string;
  asset: string;
  network: string;
  recipient: string;
  facilitatorUrl: string;
}

// Wash prices in USDC
const WASH_PRICES: Record<string, number> = {
  basic: 5.00,
  standard: 10.00,
  premium: 18.00,
  deluxe: 25.00,
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const payToAddress = Deno.env.get('PAY_TO_ADDRESS') || '0x742d35Cc6634C0532925a3b844Bc9e7595f8fCE8';
    const facilitatorUrl = Deno.env.get('X402_FACILITATOR_URL') || 'https://x402.org/facilitator';

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: WashStartRequest = await req.json();
    const { vehicleId, branchId, operatorId, washType, customerId } = body;

    console.log('[x402-wash-start] Received request:', { vehicleId, branchId, operatorId, washType, customerId });

    // Validate required fields
    if (!vehicleId || !branchId || !operatorId || !washType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: vehicleId, branchId, operatorId, washType' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const price = WASH_PRICES[washType] || WASH_PRICES.basic;

    // Check for X-Payment header
    const xPaymentHeader = req.headers.get('x-payment');

    if (!xPaymentHeader) {
      // No payment - return 402 with PaymentRequirements
      console.log('[x402-wash-start] No X-Payment header, returning 402');
      
      const paymentRequirements: PaymentRequirements = {
        resource: `/api/v1/wash/start?type=${washType}`,
        price: price.toFixed(6),
        asset: 'USDC',
        network: 'avalanche-fuji',
        recipient: payToAddress,
        facilitatorUrl: facilitatorUrl,
      };

      return new Response(
        JSON.stringify({ 
          error: 'Payment Required',
          paymentRequirements 
        }),
        { 
          status: 402, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify and settle payment with facilitator
    console.log('[x402-wash-start] Verifying X-Payment header');
    
    let settlementInfo;
    try {
      // In production, this would call the x402 facilitator to verify and settle
      // For testnet demo, we simulate the verification
      const paymentData = JSON.parse(xPaymentHeader);
      
      // Simulate facilitator verification (in production, POST to facilitatorUrl/verify)
      settlementInfo = {
        verified: true,
        txHash: paymentData.txHash || `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`,
        amount: price.toFixed(6),
        asset: 'USDC',
        network: 'avalanche-fuji',
        timestamp: new Date().toISOString(),
      };
      
      console.log('[x402-wash-start] Payment verified:', settlementInfo);
    } catch (e) {
      console.error('[x402-wash-start] Payment verification failed:', e);
      return new Response(
        JSON.stringify({ error: 'Invalid X-Payment header' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create payment session
    const { data: paymentSession, error: paymentError } = await supabase
      .from('payment_sessions')
      .insert({
        resource: `/api/v1/wash/start?type=${washType}`,
        amount: price,
        asset: 'USDC',
        tx_hash: settlementInfo.txHash,
        status: 'paid',
        customer_id: customerId || 'anonymous',
        settled_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (paymentError) {
      console.error('[x402-wash-start] Failed to create payment session:', paymentError);
      throw paymentError;
    }

    console.log('[x402-wash-start] Payment session created:', paymentSession.id);

    // Create wash session
    const { data: washSession, error: washError } = await supabase
      .from('wash_sessions')
      .insert({
        payment_session_id: paymentSession.id,
        vehicle_id: vehicleId,
        branch_id: branchId,
        operator_id: operatorId,
        wash_type: washType,
        status: 'in_progress',
        price_usdc: price,
      })
      .select()
      .single();

    if (washError) {
      console.error('[x402-wash-start] Failed to create wash session:', washError);
      throw washError;
    }

    console.log('[x402-wash-start] Wash session created:', washSession.id);

    // Update customer loyalty
    if (customerId) {
      const points = Math.floor(price * 10); // 10 points per dollar
      
      const { data: existingLoyalty } = await supabase
        .from('customer_loyalty')
        .select()
        .eq('customer_id', customerId)
        .maybeSingle();

      if (existingLoyalty) {
        await supabase
          .from('customer_loyalty')
          .update({
            points: existingLoyalty.points + points,
            total_spent_usdc: Number(existingLoyalty.total_spent_usdc) + price,
            wash_count: existingLoyalty.wash_count + 1,
          })
          .eq('customer_id', customerId);
      } else {
        await supabase
          .from('customer_loyalty')
          .insert({
            customer_id: customerId,
            points: points,
            total_spent_usdc: price,
            wash_count: 1,
          });
      }
      console.log('[x402-wash-start] Customer loyalty updated');
    }

    // Update operator rewards
    const operatorReward = price * 0.1; // 10% commission
    
    const { data: existingReward } = await supabase
      .from('operator_rewards')
      .select()
      .eq('operator_id', operatorId)
      .maybeSingle();

    if (existingReward) {
      await supabase
        .from('operator_rewards')
        .update({
          earned_usdc: Number(existingReward.earned_usdc) + operatorReward,
          pending_usdc: Number(existingReward.pending_usdc) + operatorReward,
          job_count: existingReward.job_count + 1,
        })
        .eq('operator_id', operatorId);
    } else {
      await supabase
        .from('operator_rewards')
        .insert({
          operator_id: operatorId,
          earned_usdc: operatorReward,
          pending_usdc: operatorReward,
          job_count: 1,
        });
    }
    console.log('[x402-wash-start] Operator rewards updated');

    // Return success with X-PAYMENT-RESPONSE header
    const response = new Response(
      JSON.stringify({
        success: true,
        washSession: washSession,
        paymentSession: paymentSession,
        settlementInfo: settlementInfo,
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-Payment-Response': JSON.stringify(settlementInfo),
        } 
      }
    );

    return response;

  } catch (error) {
    console.error('[x402-wash-start] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

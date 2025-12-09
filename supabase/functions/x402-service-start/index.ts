import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-payment',
  'Access-Control-Expose-Headers': 'x-payment-response',
};

interface ServiceStartRequest {
  vehicleId: string;
  branchId: string;
  operatorId: string;
  serviceType: 'oil_change' | 'tire_rotation' | 'brake_service' | 'inspection' | 'other';
  description?: string;
  mileage?: number;
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

// Service prices in USDC
const SERVICE_PRICES: Record<string, number> = {
  oil_change: 45.00,
  tire_rotation: 25.00,
  brake_service: 150.00,
  inspection: 35.00,
  other: 50.00,
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

    const body: ServiceStartRequest = await req.json();
    const { vehicleId, branchId, operatorId, serviceType, description, mileage, customerId } = body;

    console.log('[x402-service-start] Received request:', { vehicleId, branchId, operatorId, serviceType, customerId });

    // Validate required fields
    if (!vehicleId || !branchId || !operatorId || !serviceType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: vehicleId, branchId, operatorId, serviceType' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const price = SERVICE_PRICES[serviceType] || SERVICE_PRICES.other;

    // Check for X-Payment header
    const xPaymentHeader = req.headers.get('x-payment');

    if (!xPaymentHeader) {
      // No payment - return 402 with PaymentRequirements
      console.log('[x402-service-start] No X-Payment header, returning 402');
      
      const paymentRequirements: PaymentRequirements = {
        resource: `/api/v1/service/start?type=${serviceType}`,
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
    console.log('[x402-service-start] Verifying X-Payment header');
    
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
      
      console.log('[x402-service-start] Payment verified:', settlementInfo);
    } catch (e) {
      console.error('[x402-service-start] Payment verification failed:', e);
      return new Response(
        JSON.stringify({ error: 'Invalid X-Payment header' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create payment session
    const { data: paymentSession, error: paymentError } = await supabase
      .from('payment_sessions')
      .insert({
        resource: `/api/v1/service/start?type=${serviceType}`,
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
      console.error('[x402-service-start] Failed to create payment session:', paymentError);
      throw paymentError;
    }

    console.log('[x402-service-start] Payment session created:', paymentSession.id);

    // Create service session
    const { data: serviceSession, error: serviceError } = await supabase
      .from('service_sessions')
      .insert({
        payment_session_id: paymentSession.id,
        vehicle_id: vehicleId,
        branch_id: branchId,
        operator_id: operatorId,
        service_type: serviceType,
        description: description || `${serviceType.replace('_', ' ')} service`,
        status: 'in_progress',
        price_usdc: price,
        mileage: mileage,
      })
      .select()
      .single();

    if (serviceError) {
      console.error('[x402-service-start] Failed to create service session:', serviceError);
      throw serviceError;
    }

    console.log('[x402-service-start] Service session created:', serviceSession.id);

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
            service_count: existingLoyalty.service_count + 1,
          })
          .eq('customer_id', customerId);
      } else {
        await supabase
          .from('customer_loyalty')
          .insert({
            customer_id: customerId,
            points: points,
            total_spent_usdc: price,
            service_count: 1,
          });
      }
      console.log('[x402-service-start] Customer loyalty updated');
    }

    // Update operator rewards
    const operatorReward = price * 0.15; // 15% commission for service
    
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
    console.log('[x402-service-start] Operator rewards updated');

    // Return success with X-PAYMENT-RESPONSE header
    const response = new Response(
      JSON.stringify({
        success: true,
        serviceSession: serviceSession,
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
    console.error('[x402-service-start] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

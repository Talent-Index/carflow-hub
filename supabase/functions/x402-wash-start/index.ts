// supabase/functions/x402-wash-start/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Deno supports npm modules via "npm:" prefix
import { createThirdwebClient } from "npm:thirdweb";
import { facilitator, settlePayment } from "npm:thirdweb/x402";
import { avalancheFuji } from "npm:thirdweb/chains";

const client = createThirdwebClient({
  secretKey: Deno.env.get("THIRDWEB_SECRET_KEY")!,
});

const serverWalletAddress = Deno.env.get("SERVER_WALLET_ADDRESS")!;

const twFacilitator = facilitator({
  client,
  serverWalletAddress,
  waitUntil: "confirmed",
});

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await req.json().catch(() => ({}));
  const xPayment = req.headers.get("x-payment");

  // 1) No payment header => return 402 with payment requirements
  if (!xPayment) {
    const paymentRequirements = {
      resource: "/api/v1/wash/start?type=basic",
      price: "5.000000",
      asset: "USDC",
      network: "eip155:43113", // Fuji in CAIP-2 notation, or just avalancheFuji in settlePayment below
    };

    return new Response(
      JSON.stringify({
        error: "Payment Required",
        paymentRequirements,
      }),
      {
        status: 402,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // 2) There IS an X-PAYMENT header: verify + settle using thirdweb facilitator
  const paymentRequirements = {
    resource: "/api/v1/wash/start?type=basic",
    price: "5.000000",
    asset: "USDC",
    network: "eip155:43113",
  };

  const settlementResult = await settlePayment({
    facilitator: twFacilitator,
    paymentData: xPayment,
    // Note: thirdweb docs allow network either as CAIP-2 string or chain object
    network: avalancheFuji,
    payTo: serverWalletAddress,
    price: paymentRequirements.price,
    asset: paymentRequirements.asset,
    resourceId: paymentRequirements.resource,
  });

  if (!settlementResult.ok) {
    return new Response(
      JSON.stringify({
        error: "Payment verification failed",
        details: settlementResult.error,
      }),
      {
        status: 402,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // 3) Payment success: record wash session (stub DB for now)
  const washSession = {
    id: crypto.randomUUID(),
    type: "basic",
    carId: body.carId,
    branchId: body.branchId,
    operatorId: body.operatorId,
    amountPaid: paymentRequirements.price,
    asset: paymentRequirements.asset,
    chain: "avalanche-fuji",
    settledAt: new Date().toISOString(),
  };

  return new Response(JSON.stringify(washSession), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "X-PAYMENT-RESPONSE": JSON.stringify(settlementResult.settlement),
    },
  });
});

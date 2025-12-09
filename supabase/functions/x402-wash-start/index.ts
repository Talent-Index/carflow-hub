// supabase/functions/x402-wash-start/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
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

const WASH_PRICES_USDC: Record<string, string> = {
  basic: "5.000000",
  standard: "8.000000",
  premium: "12.000000",
  deluxe: "20.000000",
};

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await req.json().catch(() => ({} as any));
  const xPayment = req.headers.get("x-payment");

  const washType: string = body.type ?? body.washType ?? "basic";
  const price = WASH_PRICES_USDC[washType] ?? WASH_PRICES_USDC.basic;

  // Basic input validation
  if (!body.carId || !body.branchId || !body.operatorId) {
    return new Response(
      JSON.stringify({
        error: "Missing required fields (carId, branchId, operatorId)",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Shared payment requirements
  const paymentRequirements = {
    resource: `/api/v1/wash/start?type=${washType}`,
    price,
    asset: "USDC",
    network: "eip155:43113", // Fuji in CAIP-2
  };

  // 1) No payment header => return 402 with payment requirements
  if (!xPayment) {
    return new Response(
      JSON.stringify({
        error: "Payment Required",
        paymentRequirements: [paymentRequirements],
      }),
      {
        status: 402,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // 2) There IS an X-PAYMENT header: verify + settle using thirdweb facilitator
  const settlementResult = await settlePayment({
    facilitator: twFacilitator,
    paymentData: xPayment,
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

  // 3) Payment success: record wash session (stub - extend with DB/loyalty later)
  const washSession = {
    id: crypto.randomUUID(),
    type: washType,
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

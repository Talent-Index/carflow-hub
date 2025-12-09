import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AIChatWidget } from "@/components/chat/AIChatWidget";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Services from "./pages/Services";
import CarWash from "./pages/CarWash";
import Pricing from "./pages/Pricing";
import OwnerDashboard from "./pages/dashboard/OwnerDashboard";
import ManagerDashboard from "./pages/dashboard/ManagerDashboard";
import OperatorDashboard from "./pages/dashboard/OperatorDashboard";
import CustomerDashboard from "./pages/dashboard/CustomerDashboard";
import NotFound from "./pages/NotFound";

import { ConnectWallet, ThirdwebProvider } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { avalancheFuji } from "thirdweb/chains";

const queryClient = new QueryClient();

// thirdweb client for Core Wallet + x402 payments
const thirdwebClient = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID!,
});

const App = () => (
  <ThirdwebProvider client={thirdwebClient} activeChain={avalancheFuji}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-background text-foreground">
              {/* Global header with ConnectWallet */}
              <header className="w-full flex items-center justify-between px-4 md:px-8 py-3 border-b border-border/40 bg-background/80 backdrop-blur">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold tracking-tight">
                    TrackWash • AutoX402
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <ConnectWallet />
                </div>
              </header>

              {/* Main routed content */}
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/wash" element={<CarWash />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/dashboard/owner" element={<OwnerDashboard />} />
                  <Route path="/dashboard/manager" element={<ManagerDashboard />} />
                  <Route path="/dashboard/operator" element={<OperatorDashboard />} />
                  <Route path="/dashboard/customer" element={<CustomerDashboard />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              {/* Global AI mechanic widget */}
              <AIChatWidget />

              {/* Footer tagline */}
              <footer className="w-full px-4 md:px-8 py-4 border-t border-border/40 text-xs text-muted-foreground text-center">
                Established in 2025. Own your car. Love your car &lt;3
              </footer>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThirdwebProvider>
);

export default App;

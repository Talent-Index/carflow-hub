import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { PaymentSection } from '@/components/home/PaymentSection';
import { CTASection } from '@/components/home/CTASection';
import { X402DemoButton } from '@/components/payment/X402DemoButton';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        
        {/* x402 Demo Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Try the x402 Payment Protocol
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience the future of payments. Click below to trigger a demo wash payment 
              using the x402 protocol on Avalanche testnet.
            </p>
            <X402DemoButton />
            <p className="text-xs text-muted-foreground mt-4">
              This is a testnet demo - no real funds are transferred
            </p>
          </div>
        </section>
        
        <FeaturesSection />
        <PaymentSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

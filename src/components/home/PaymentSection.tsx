import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import blockchainBg from '@/assets/blockchain-bg.jpg';

const paymentSteps = [
  { step: 1, title: 'Request Service', description: 'Select your service or wash package' },
  { step: 2, title: 'HTTP 402', description: 'Server returns payment requirements' },
  { step: 3, title: 'X-PAYMENT Header', description: 'Wallet signs and sends payment proof' },
  { step: 4, title: 'On-Chain Settlement', description: 'Transaction confirmed on Avalanche' },
  { step: 5, title: 'Service Complete', description: 'HTTP 200 - Enjoy your service!' },
];

export function PaymentSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={blockchainBg}
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 mb-6">
              <span className="text-sm font-medium text-secondary">x402 Protocol</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Seamless Blockchain
              <span className="block text-primary">Payments</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              Built on Avalanche C-Chain, our x402 implementation enables instant, 
              low-cost payments with USDC stablecoins. No more waiting for card processing.
            </p>

            <ul className="space-y-4 mb-8">
              {['Sub-second finality', 'Less than $0.01 fees', 'Non-custodial payments', 'Core Wallet integration'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-foreground">
                  <Check className="w-5 h-5 text-primary" />
                  {item}
                </li>
              ))}
            </ul>

            <Button variant="hero" size="lg">
              Learn More
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Right - Payment Flow */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent" />
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border p-8 relative">
              <h3 className="text-xl font-semibold text-foreground mb-6">Payment Flow</h3>
              <div className="space-y-4">
                {paymentSteps.map((item, index) => (
                  <div
                    key={item.step}
                    className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary-foreground">{item.step}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    {index < paymentSteps.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto self-center" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

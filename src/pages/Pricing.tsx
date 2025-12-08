import { Check, Zap, Crown, Rocket } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Basic',
    description: 'Perfect for occasional car owners',
    monthlyPrice: 0,
    icon: Zap,
    features: [
      'Track 1 vehicle',
      'Basic wash history',
      'Service reminders (email)',
      'Pay per service with USDC',
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Premium',
    description: 'For car enthusiasts who want more',
    monthlyPrice: 9.99,
    icon: Crown,
    features: [
      'Track up to 5 vehicles',
      'Full maintenance history',
      'Smart AI reminders',
      '5% cashback in loyalty points',
      'Priority booking',
      'AI Mechanic Assistant',
    ],
    cta: 'Start Premium',
    popular: true,
  },
  {
    name: 'Fleet',
    description: 'For businesses with multiple vehicles',
    monthlyPrice: 49.99,
    icon: Rocket,
    features: [
      'Unlimited vehicles',
      'Fleet analytics dashboard',
      'Bulk service scheduling',
      '10% cashback in loyalty points',
      'Dedicated account manager',
      'API access',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Simple, Transparent <span className="text-primary">Pricing</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include blockchain-verified 
            payments and lifetime service records.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-card rounded-xl border p-6 transition-all ${
                  plan.popular 
                    ? 'border-primary ring-2 ring-primary/20 relative scale-105' 
                    : 'border-border hover:border-primary/30'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4 pt-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <plan.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">
                    ${plan.monthlyPrice}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  asChild 
                  className="w-full" 
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  <Link to="/login">{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-2">How do payments work?</h3>
              <p className="text-muted-foreground text-sm">
                All payments are processed using USDC stablecoin on the Avalanche network via 
                the x402 protocol. Connect your Core Wallet to pay instantly and securely.
              </p>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-2">Can I upgrade or downgrade anytime?</h3>
              <p className="text-muted-foreground text-sm">
                Yes! You can change your plan at any time. Upgrades take effect immediately, 
                and downgrades apply at the end of your billing period.
              </p>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-2">What's included in loyalty points?</h3>
              <p className="text-muted-foreground text-sm">
                Loyalty points can be redeemed for free washes, service discounts, or converted 
                to USDC. Points never expire as long as your account is active.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

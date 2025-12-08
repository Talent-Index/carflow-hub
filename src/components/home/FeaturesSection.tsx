import { Car, Droplets, Wallet, Gift, BarChart3, Users } from 'lucide-react';
import heroGarage from '@/assets/hero-garage.jpg';

const features = [
  {
    icon: Car,
    title: 'Full Service Tracking',
    description: 'Complete maintenance history for all your vehicles. Never miss an oil change or inspection again.',
  },
  {
    icon: Droplets,
    title: 'Premium Car Wash',
    description: 'From basic to deluxe packages, keep your vehicle spotless with our professional wash services.',
  },
  {
    icon: Wallet,
    title: 'x402 Payments',
    description: 'Pay with USDC or AVAX using the x402 protocol. Fast, secure, and transparent blockchain payments.',
  },
  {
    icon: Gift,
    title: 'Loyalty Rewards',
    description: 'Earn points on every service. Climb tiers from Bronze to Platinum and unlock exclusive benefits.',
  },
  {
    icon: BarChart3,
    title: 'Business Analytics',
    description: 'Owners and managers get real-time insights into revenue, services, and operator performance.',
  },
  {
    icon: Users,
    title: 'Multi-Role Access',
    description: 'Tailored dashboards for Owners, Managers, Operators, and Customers with role-specific features.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-card relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
        <img
          src={heroGarage}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-card" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete platform for car owners and service providers, powered by blockchain technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Droplets, Sparkles, Timer, Star, CheckCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { washPrices } from '@/lib/mock-data';
import heroCarwash from '@/assets/hero-carwash.jpg';

const washPackages = [
  {
    id: 'basic',
    title: 'Basic Wash',
    price: washPrices.basic,
    duration: '10 min',
    features: ['Exterior wash', 'Rinse & dry', 'Tire cleaning'],
    popular: false,
  },
  {
    id: 'standard',
    title: 'Standard Wash',
    price: washPrices.standard,
    duration: '15 min',
    features: ['Everything in Basic', 'Wheel shine', 'Window cleaning', 'Air freshener'],
    popular: false,
  },
  {
    id: 'premium',
    title: 'Premium Wash',
    price: washPrices.premium,
    duration: '25 min',
    features: ['Everything in Standard', 'Wax coating', 'Interior vacuum', 'Dashboard wipe'],
    popular: true,
  },
  {
    id: 'deluxe',
    title: 'Deluxe Detail',
    price: washPrices.deluxe,
    duration: '45 min',
    features: ['Everything in Premium', 'Full interior detail', 'Leather conditioning', 'Engine bay clean'],
    popular: false,
  },
];

export default function CarWash() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4">
        <div 
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: `url(${heroCarwash})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background z-0" />
        
        <div className="container mx-auto relative z-10 pt-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm mb-6">
              <Droplets className="w-4 h-4" />
              Premium Car Wash Experience
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Sparkling Clean, <span className="text-primary">Every Time</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Track your car washes, earn loyalty points, and pay seamlessly with 
              USDC on Avalanche. The future of car care is here.
            </p>
          </div>
        </div>
      </section>

      {/* Wash Packages */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Choose Your <span className="text-primary">Wash Package</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {washPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-card rounded-xl border p-6 transition-all hover:shadow-lg hover:shadow-primary/5 ${
                  pkg.popular 
                    ? 'border-primary ring-2 ring-primary/20 relative' 
                    : 'border-border hover:border-primary/30'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6 pt-2">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{pkg.title}</h3>
                  <p className="text-3xl font-bold text-foreground">
                    ${pkg.price}
                    <span className="text-sm font-normal text-muted-foreground">/wash</span>
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-2 text-sm text-muted-foreground">
                    <Timer className="w-4 h-4" />
                    {pkg.duration}
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  asChild 
                  className="w-full" 
                  variant={pkg.popular ? 'default' : 'outline'}
                >
                  <Link to="/login">Book Now</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-primary mb-1">10K+</p>
              <p className="text-sm text-muted-foreground">Cars Washed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary mb-1">4.9</p>
              <p className="text-sm text-muted-foreground">Customer Rating</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary mb-1">15min</p>
              <p className="text-sm text-muted-foreground">Avg. Wait Time</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary mb-1">100%</p>
              <p className="text-sm text-muted-foreground">Eco-Friendly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Wash Tracker CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium">Wash Tracker</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Track Every Wash, Earn Rewards
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            See your wash history per car and location. Earn points with every wash 
            and unlock exclusive discounts and free services.
          </p>
          <Button asChild size="lg">
            <Link to="/login">Join the Wash Club</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

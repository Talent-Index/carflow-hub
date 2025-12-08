import { Wrench, Clock, Shield, CheckCircle, Calendar, Gauge } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { servicePrices } from '@/lib/mock-data';

const services = [
  {
    id: 'oil_change',
    title: 'Oil Change',
    description: 'Full synthetic oil change with premium filters',
    price: servicePrices.oil_change,
    duration: '30-45 min',
    icon: Wrench,
    features: ['Premium synthetic oil', 'OEM filter', 'Multi-point inspection', 'Fluid top-off'],
  },
  {
    id: 'tire_rotation',
    title: 'Tire Rotation',
    description: 'Extend tire life with professional rotation',
    price: servicePrices.tire_rotation,
    duration: '20-30 min',
    icon: Gauge,
    features: ['4-tire rotation', 'Pressure check', 'Tread inspection', 'Alignment check'],
  },
  {
    id: 'brake_service',
    title: 'Brake Service',
    description: 'Complete brake inspection and replacement',
    price: servicePrices.brake_service,
    duration: '1-2 hours',
    icon: Shield,
    features: ['Brake pad replacement', 'Rotor inspection', 'Fluid flush', 'Road test'],
  },
  {
    id: 'inspection',
    title: 'Vehicle Inspection',
    description: 'Comprehensive multi-point safety inspection',
    price: servicePrices.inspection,
    duration: '45-60 min',
    icon: CheckCircle,
    features: ['50-point check', 'Safety report', 'Recommendations', 'Digital records'],
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Car Maintenance <span className="text-primary">Services</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Professional car maintenance with transparent blockchain-verified payments. 
            Track every service, build your maintenance history, and earn loyalty rewards.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>Fast Service</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Certified Mechanics</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Smart Reminders</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-card rounded-xl border border-border p-6 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">${service.price}</p>
                    <p className="text-sm text-muted-foreground">{service.duration}</p>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full">
                  <Link to="/login">Schedule Service</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Maintenance Tracker CTA */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Smart Maintenance Tracking
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Our AI-powered system tracks your maintenance history and sends 
            automated reminders when services are due. Never miss an oil change again.
          </p>
          <Button asChild size="lg">
            <Link to="/login">Start Tracking Your Car</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

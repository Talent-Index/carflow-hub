import { Car, Gift, Clock, DollarSign, Star, Droplets, Wrench } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { mockVehicles, mockLoyaltyWallets, mockServiceSessions, mockWashSessions } from '@/lib/mock-data';
import { Link } from 'react-router-dom';

const tierColors = {
  bronze: 'text-orange-400',
  silver: 'text-gray-400',
  gold: 'text-yellow-400',
  platinum: 'text-purple-400',
};

export default function CustomerDashboard() {
  const loyalty = mockLoyaltyWallets[0];
  const vehicles = mockVehicles.filter((v) => v.customerId === 'customer-1');

  const allSessions = [
    ...mockServiceSessions.map((s) => ({ ...s, sessionType: 'service' as const })),
    ...mockWashSessions.map((s) => ({ ...s, sessionType: 'wash' as const })),
  ].filter((s) => vehicles.some((v) => v.id === s.vehicleId));

  return (
    <DashboardLayout title="My Dashboard" subtitle="Track your vehicles, services, and rewards">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="My Vehicles" value={vehicles.length} subtitle="Registered" icon={Car} />
        <StatCard
          title="Loyalty Points"
          value={loyalty.points.toLocaleString()}
          subtitle={`${loyalty.tier} tier`}
          icon={Gift}
        />
        <StatCard
          title="Total Services"
          value={allSessions.length}
          subtitle="All time"
          icon={Clock}
        />
        <StatCard
          title="Total Spent"
          value={`$${loyalty.totalSpentUSDC.toFixed(2)}`}
          subtitle="USDC"
          icon={DollarSign}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Vehicles */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border border-border p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">My Vehicles</h2>
              <Button variant="outline" size="sm">
                Add Vehicle
              </Button>
            </div>
            <div className="space-y-4">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Car className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.licensePlate} • {vehicle.color}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View History
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {allSessions.slice(0, 5).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-background"
                >
                  <div className="flex items-center gap-3">
                    {session.sessionType === 'wash' ? (
                      <Droplets className="w-4 h-4 text-primary" />
                    ) : (
                      <Wrench className="w-4 h-4 text-secondary" />
                    )}
                    <div>
                      <span className="text-sm text-foreground capitalize">
                        {session.sessionType === 'wash' ? 'Car Wash' : 'Service'}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-foreground">
                      ${session.priceUSDC.toFixed(2)}
                    </span>
                    <span
                      className={`text-xs ${
                        session.paymentStatus === 'paid' ? 'text-success' : 'text-warning'
                      }`}
                    >
                      {session.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Loyalty Card */}
        <div>
          <div className="bg-gradient-to-br from-card via-primary/5 to-secondary/5 rounded-xl border border-primary/30 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Star className={`w-5 h-5 ${tierColors[loyalty.tier]}`} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground capitalize">{loyalty.tier} Member</h3>
                <p className="text-sm text-muted-foreground">Loyalty Program</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-4xl font-bold text-foreground">{loyalty.points.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Available Points</p>
            </div>

            {/* Progress to next tier */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress to Gold</span>
                <span className="text-foreground">65%</span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  style={{ width: '65%' }}
                />
              </div>
            </div>

            <Button className="w-full" variant="outline">
              View Rewards
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 space-y-3">
            <Button asChild className="w-full" variant="default">
              <Link to="/wash">Book Car Wash</Link>
            </Button>
            <Button asChild className="w-full" variant="outline">
              <Link to="/services">Schedule Service</Link>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

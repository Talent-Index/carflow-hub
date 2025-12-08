import { DollarSign, Car, Droplets, TrendingUp, Building, Users } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { mockBranches, mockServiceSessions, mockWashSessions } from '@/lib/mock-data';

export default function OwnerDashboard() {
  const totalRevenue = [...mockServiceSessions, ...mockWashSessions]
    .filter((s) => s.paymentStatus === 'paid')
    .reduce((sum, s) => sum + s.priceUSDC, 0);

  const totalServices = mockServiceSessions.length;
  const totalWashes = mockWashSessions.length;

  return (
    <DashboardLayout title="Owner Dashboard" subtitle="Overview of all your branches and operations">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          subtitle="USDC"
          icon={DollarSign}
          trend={{ value: 12.5, positive: true }}
        />
        <StatCard
          title="Branches"
          value={mockBranches.length}
          subtitle="Active locations"
          icon={Building}
        />
        <StatCard
          title="Services"
          value={totalServices}
          subtitle="This month"
          icon={Car}
          trend={{ value: 8.2, positive: true }}
        />
        <StatCard
          title="Car Washes"
          value={totalWashes}
          subtitle="This month"
          icon={Droplets}
          trend={{ value: 15.3, positive: true }}
        />
      </div>

      {/* Branches List */}
      <div className="bg-card rounded-xl border border-border p-6 mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Your Branches</h2>
        <div className="space-y-4">
          {mockBranches.map((branch) => (
            <div
              key={branch.id}
              className="flex items-center justify-between p-4 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{branch.name}</h3>
                  <p className="text-sm text-muted-foreground">{branch.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                  {branch.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Recent Payments</h2>
        <div className="space-y-3">
          {[...mockServiceSessions, ...mockWashSessions]
            .filter((s) => s.paymentStatus === 'paid')
            .slice(0, 5)
            .map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background"
              >
                <div className="flex items-center gap-3">
                  {'type' in session && session.type.includes('wash') || session.id.startsWith('ws') ? (
                    <Droplets className="w-4 h-4 text-primary" />
                  ) : (
                    <Car className="w-4 h-4 text-secondary" />
                  )}
                  <span className="text-sm text-foreground capitalize">
                    {session.id.startsWith('ws') ? 'Car Wash' : 'Service'}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground">
                    ${session.priceUSDC.toFixed(2)}
                  </span>
                  <span className="text-xs text-success">Paid</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

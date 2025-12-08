import { useState } from 'react';
import { DollarSign, Clock, Car, Droplets, Plus, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { mockOperatorRewards, mockWashSessions, mockServiceSessions, washPrices } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

export default function OperatorDashboard() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const rewards = mockOperatorRewards[0];

  const todaysJobs = [
    ...mockWashSessions.filter((w) => w.operatorId === 'operator-1'),
    ...mockServiceSessions.filter((s) => s.operatorId === 'operator-1'),
  ];

  const handleNewWash = async (type: keyof typeof washPrices) => {
    setIsProcessing(true);
    // Simulate x402 payment flow
    await new Promise((r) => setTimeout(r, 1500));
    setIsProcessing(false);
    toast({
      title: 'Wash Started',
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} wash initiated. Payment pending.`,
    });
  };

  return (
    <DashboardLayout title="Operator Dashboard" subtitle="Manage jobs and track your earnings">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Today's Earnings"
          value={`$${rewards.pendingUSDC.toFixed(2)}`}
          subtitle="Pending"
          icon={DollarSign}
        />
        <StatCard
          title="Total Earned"
          value={`$${rewards.earnedUSDC.toFixed(2)}`}
          subtitle="All time"
          icon={DollarSign}
          trend={{ value: 5.2, positive: true }}
        />
        <StatCard title="Jobs Today" value={todaysJobs.length} subtitle="Completed" icon={Clock} />
        <StatCard
          title="Paid Out"
          value={`$${rewards.paidUSDC.toFixed(2)}`}
          subtitle="To wallet"
          icon={CheckCircle}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Start New Job</h2>
            <div className="space-y-3">
              {(Object.entries(washPrices) as [keyof typeof washPrices, number][]).map(
                ([type, price]) => (
                  <button
                    key={type}
                    onClick={() => handleNewWash(type)}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-between p-4 rounded-lg bg-background border border-border hover:border-primary/50 transition-all group disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Droplets className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium text-foreground capitalize">{type} Wash</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        ${price.toFixed(2)}
                      </span>
                      <Plus className="w-4 h-4 text-primary" />
                    </div>
                  </button>
                )
              )}
            </div>

            <div className="border-t border-border mt-6 pt-6">
              <Button className="w-full" variant="outline">
                <Car className="w-4 h-4 mr-2" />
                New Service Job
              </Button>
            </div>
          </div>
        </div>

        {/* Today's Jobs */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Today's Jobs</h2>
            <div className="space-y-3">
              {todaysJobs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No jobs yet today</p>
              ) : (
                todaysJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-background border border-border"
                  >
                    <div className="flex items-center gap-4">
                      {job.id.startsWith('ws') ? (
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Droplets className="w-5 h-5 text-primary" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                          <Car className="w-5 h-5 text-secondary" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-foreground capitalize">
                          {job.id.startsWith('ws') ? 'Car Wash' : 'Service'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(job.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-foreground">
                        ${job.priceUSDC.toFixed(2)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.status === 'completed'
                            ? 'bg-success/10 text-success'
                            : job.status === 'in_progress'
                            ? 'bg-warning/10 text-warning'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {job.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

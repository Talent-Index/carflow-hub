import { useState } from 'react';
import { DollarSign, Clock, Car, Droplets, Plus, CheckCircle, Wrench } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { StartWashButton } from '@/components/payment/StartWashButton';
import { StartServiceButton } from '@/components/payment/StartServiceButton';
import { mockOperatorRewards, mockWashSessions, mockServiceSessions, washPrices, servicePrices } from '@/lib/mock-data';

export default function OperatorDashboard() {
  const rewards = mockOperatorRewards[0];

  const todaysJobs = [
    ...mockWashSessions.filter((w) => w.operatorId === 'operator-1'),
    ...mockServiceSessions.filter((s) => s.operatorId === 'operator-1'),
  ];

  const handleJobSuccess = (data: unknown) => {
    console.log('Job started successfully:', data);
    // In a real app, refresh the jobs list here
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
        {/* Quick Actions - Wash */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Droplets className="h-5 w-5 text-primary" />
              Start Car Wash
            </h2>
            <div className="space-y-3">
              {(['basic', 'standard', 'premium', 'deluxe'] as const).map((type) => (
                <StartWashButton
                  key={type}
                  vehicleId="demo-vehicle-001"
                  branchId="branch-1"
                  operatorId="operator-1"
                  washType={type}
                  customerId="customer-1"
                  onSuccess={handleJobSuccess}
                  className="w-full justify-between"
                  variant="outline"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions - Service */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Wrench className="h-5 w-5 text-secondary" />
              Start Service
            </h2>
            <div className="space-y-3">
              {(['oil_change', 'tire_rotation', 'brake_service', 'inspection'] as const).map((type) => (
                <StartServiceButton
                  key={type}
                  vehicleId="demo-vehicle-001"
                  branchId="branch-1"
                  operatorId="operator-1"
                  serviceType={type}
                  customerId="customer-1"
                  onSuccess={handleJobSuccess}
                  className="w-full justify-between"
                  variant="outline"
                  size="sm"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Today's Jobs */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Today's Jobs</h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {todaysJobs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No jobs yet today</p>
              ) : (
                todaysJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-background border border-border"
                  >
                    <div className="flex items-center gap-3">
                      {job.id.startsWith('ws') ? (
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Droplets className="w-4 h-4 text-primary" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                          <Car className="w-4 h-4 text-secondary" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-sm font-medium text-foreground capitalize">
                          {job.id.startsWith('ws') ? 'Car Wash' : 'Service'}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(job.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        ${job.priceUSDC.toFixed(2)}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          job.status === 'completed'
                            ? 'bg-green-500/10 text-green-500'
                            : job.status === 'in_progress'
                            ? 'bg-yellow-500/10 text-yellow-500'
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

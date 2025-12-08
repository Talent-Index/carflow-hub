import { Users, Wrench, AlertTriangle, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { mockUsers, mockServiceSessions, mockWashSessions, mockOperatorRewards } from '@/lib/mock-data';

export default function ManagerDashboard() {
  const operators = mockUsers.filter((u) => u.role === 'operator');
  const pendingSessions = [...mockServiceSessions, ...mockWashSessions].filter(
    (s) => s.status === 'pending'
  );
  const inProgressSessions = [...mockServiceSessions, ...mockWashSessions].filter(
    (s) => s.status === 'in_progress'
  );

  return (
    <DashboardLayout title="Manager Dashboard" subtitle="Branch operations and team performance">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Active Operators" value={operators.length} subtitle="On duty" icon={Users} />
        <StatCard
          title="Pending Jobs"
          value={pendingSessions.length}
          subtitle="Awaiting"
          icon={Clock}
        />
        <StatCard
          title="In Progress"
          value={inProgressSessions.length}
          subtitle="Active jobs"
          icon={Wrench}
        />
        <StatCard title="Alerts" value={2} subtitle="Require attention" icon={AlertTriangle} />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Operators Performance */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Operator Performance</h2>
          <div className="space-y-4">
            {operators.map((operator, index) => {
              const rewards = mockOperatorRewards[index];
              return (
                <div
                  key={operator.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-background border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {operator.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{operator.name}</h3>
                      <p className="text-sm text-muted-foreground">{operator.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      ${rewards?.earnedUSDC.toFixed(2) ?? '0.00'}
                    </p>
                    <p className="text-xs text-muted-foreground">Total earned</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Jobs */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Active Jobs</h2>
          <div className="space-y-3">
            {[...pendingSessions, ...inProgressSessions].slice(0, 6).map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background"
              >
                <div className="flex items-center gap-3">
                  {session.status === 'in_progress' ? (
                    <Wrench className="w-4 h-4 text-warning" />
                  ) : (
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="text-sm text-foreground capitalize">
                    {session.id.startsWith('ws') ? 'Wash' : 'Service'}
                  </span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    session.status === 'in_progress'
                      ? 'bg-warning/10 text-warning'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {session.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="mt-8 bg-card rounded-xl border border-destructive/30 p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          Alerts
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/20">
            <div>
              <h3 className="font-medium text-foreground">Low Inventory Alert</h3>
              <p className="text-sm text-muted-foreground">Premium wash soap running low</p>
            </div>
            <span className="text-xs text-destructive font-medium">High Priority</span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-warning/5 border border-warning/20">
            <div>
              <h3 className="font-medium text-foreground">Equipment Maintenance Due</h3>
              <p className="text-sm text-muted-foreground">Bay 2 pressure washer scheduled check</p>
            </div>
            <span className="text-xs text-warning font-medium">Medium Priority</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

import { useState, useMemo } from "react";
import {
  DollarSign,
  Clock,
  Car,
  Droplets,
  CheckCircle,
  Wrench,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { StartWashButton } from "@/components/payment/StartWashButton";
import { StartServiceButton } from "@/components/payment/StartServiceButton";
import {
  mockOperatorRewards,
  mockWashSessions,
  mockServiceSessions,
  washPrices,
  servicePrices,
} from "@/lib/mock-data";

type OperatorJobKind = "wash" | "service";

type OperatorJob = {
  id: string;
  createdAt: string;
  priceUSDC: number;
  status: string;
  kind: OperatorJobKind;
};

const OPERATOR_ID = "operator-1";
const BRANCH_ID = "branch-1";
const VEHICLE_ID = "demo-vehicle-001";
const CUSTOMER_ID = "customer-1";
const DEFAULT_COMMISSION_RATE = 0.1; // 10% per job

export default function OperatorDashboard() {
  // Rewards are now stateful so they react to new jobs
  const [rewards, setRewards] = useState(() => mockOperatorRewards[0]);

  // Seed today's jobs from mock data, but keep them in state so we can append
  const [jobs, setJobs] = useState<OperatorJob[]>(() => [
    ...mockWashSessions
      .filter((w) => w.operatorId === OPERATOR_ID)
      .map((w) => ({
        ...w,
        kind: "wash" as const,
      })),
    ...mockServiceSessions
      .filter((s) => s.operatorId === OPERATOR_ID)
      .map((s) => ({
        ...s,
        kind: "service" as const,
      })),
  ]);

  const todaysJobs = useMemo(
    () =>
      [...jobs].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [jobs],
  );

  const handleJobSuccess = (data: any) => {
    // The payment/x402 edge function should return a session object.
    // We defensively map whatever we get into our OperatorJob shape.
    const kind: OperatorJobKind =
      data?.serviceType || data?.service_type ? "service" : "wash";

    const washType = data?.washType || data?.wash_type;
    const serviceType = data?.serviceType || data?.service_type;

    const basePrice =
      typeof data?.priceUSDC === "number"
        ? data.priceUSDC
        : kind === "wash"
        ? washPrices[washType as keyof typeof washPrices] ?? 0
        : servicePrices[serviceType as keyof typeof servicePrices] ?? 0;

    const newJob: OperatorJob = {
      id: data?.id ?? `job-${Date.now()}`,
      createdAt: data?.createdAt ?? new Date().toISOString(),
      priceUSDC: basePrice,
      status: data?.status ?? "in_progress",
      kind,
    };

    setJobs((prev) => [newJob, ...prev]);

    const commission = basePrice * (rewards?.commissionRate ?? DEFAULT_COMMISSION_RATE ?? 0.1);

    setRewards((prev) => ({
      ...prev,
      pendingUSDC: prev.pendingUSDC + commission,
      earnedUSDC: prev.earnedUSDC + commission,
    }));

    // For debugging / visibility
    // eslint-disable-next-line no-console
    console.log("Job started successfully:", data);
  };

  return (
    <DashboardLayout
      title="Operator Dashboard"
      subtitle="Start jobs, accept x402 payments, and track your earnings in real time"
    >
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
        <StatCard
          title="Jobs Today"
          value={todaysJobs.length}
          subtitle="Completed & in progress"
          icon={Clock}
        />
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
            <p className="text-sm text-muted-foreground mb-4">
              Accept instant x402 payments on Avalanche Fuji and auto-track
              customer loyalty and your commission.
            </p>
            <div className="space-y-3">
              {(["basic", "standard", "premium", "deluxe"] as const).map(
                (type) => (
                  <StartWashButton
                    key={type}
                    vehicleId={VEHICLE_ID}
                    branchId={BRANCH_ID}
                    operatorId={OPERATOR_ID}
                    washType={type}
                    customerId={CUSTOMER_ID}
                    onSuccess={handleJobSuccess}
                    className="w-full justify-between"
                    variant="outline"
                  />
                ),
              )}
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
            <p className="text-sm text-muted-foreground mb-4">
              Log maintenance jobs with on-chain payments and automated
              maintenance scoring for each vehicle.
            </p>
            <div className="space-y-3">
              {(
                ["oil_change", "tire_rotation", "brake_service", "inspection"] as const
              ).map((type) => (
                <StartServiceButton
                  key={type}
                  vehicleId={VEHICLE_ID}
                  branchId={BRANCH_ID}
                  operatorId={OPERATOR_ID}
                  serviceType={type}
                  customerId={CUSTOMER_ID}
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
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Today&apos;s Jobs
            </h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {todaysJobs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No jobs yet today
                </p>
              ) : (
                todaysJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-background border border-border"
                  >
                    <div className="flex items-center gap-3">
                      {job.kind === "wash" ? (
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
                          {job.kind === "wash" ? "Car Wash" : "Service"}
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
                          job.status === "completed"
                            ? "bg-green-500/10 text-green-500"
                            : job.status === "in_progress"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {job.status.replace("_", " ")}
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

import { useState } from 'react';
import { Car, Gift, Clock, DollarSign, Star, Droplets, Wrench, Bell, Plus } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { VehicleCard } from '@/components/dashboard/VehicleCard';
import { ServiceReminder } from '@/components/dashboard/ServiceReminder';
import { AddVehicleDialog } from '@/components/dashboard/AddVehicleDialog';
import { mockVehicles, mockLoyaltyWallets, mockServiceSessions, mockWashSessions } from '@/lib/mock-data';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Vehicle } from '@/types';

const tierColors = {
  bronze: 'text-orange-400',
  silver: 'text-gray-400',
  gold: 'text-yellow-400',
  platinum: 'text-purple-400',
};

// Calculate maintenance rating based on service history
const calculateMaintenanceRating = (vehicleId: string): number => {
  const vehicleServices = mockServiceSessions.filter(s => s.vehicleId === vehicleId);
  if (vehicleServices.length === 0) return 50; // New vehicle, neutral rating
  
  const completedOnTime = vehicleServices.filter(s => s.status === 'completed').length;
  const total = vehicleServices.length;
  const baseRating = (completedOnTime / total) * 100;
  
  // Bonus for regular washes
  const washes = mockWashSessions.filter(w => w.vehicleId === vehicleId && w.status === 'completed').length;
  const washBonus = Math.min(washes * 2, 10);
  
  return Math.min(Math.round(baseRating + washBonus), 100);
};

// Generate reminder data
const generateReminders = (vehicles: Vehicle[]) => {
  const reminders = [
    {
      vehicleId: 'v-1',
      vehicleName: '2023 Tesla Model 3',
      serviceType: 'Oil Change',
      dueIn: 'Overdue by 500 miles',
      status: 'overdue' as const,
    },
    {
      vehicleId: 'v-2',
      vehicleName: '2022 BMW M4',
      serviceType: 'Tire Rotation',
      dueIn: 'Due in 3 days',
      status: 'due_soon' as const,
    },
    {
      vehicleId: 'v-1',
      vehicleName: '2023 Tesla Model 3',
      serviceType: 'Brake Inspection',
      dueIn: 'Due in 2 weeks',
      status: 'upcoming' as const,
    },
  ];

  return reminders.filter(r => vehicles.some(v => v.id === r.vehicleId));
};

export default function CustomerDashboard() {
  const loyalty = mockLoyaltyWallets[0];
  const [vehicles, setVehicles] = useState<Vehicle[]>(
    mockVehicles.filter((v) => v.customerId === 'customer-1')
  );

  const allSessions = [
    ...mockServiceSessions.map((s) => ({ ...s, sessionType: 'service' as const })),
    ...mockWashSessions.map((s) => ({ ...s, sessionType: 'wash' as const })),
  ].filter((s) => vehicles.some((v) => v.id === s.vehicleId));

  const reminders = generateReminders(vehicles);

  const handleAddVehicle = (newVehicle: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    color: string;
  }) => {
    const vehicle: Vehicle = {
      id: `v-${Date.now()}`,
      customerId: 'customer-1',
      ...newVehicle,
    };
    setVehicles([...vehicles, vehicle]);
  };

  const handleViewHistory = (vehicleId: string) => {
    toast.info('Vehicle history view coming soon!');
  };

  const handleScheduleService = () => {
    toast.info('Redirecting to service booking...');
  };

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

      {/* Reminders Section */}
      {reminders.filter(r => r.status !== 'upcoming').length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-warning" />
            <h2 className="text-xl font-semibold text-foreground">Service Reminders</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reminders
              .filter(r => r.status !== 'upcoming')
              .map((reminder, i) => (
                <ServiceReminder
                  key={i}
                  vehicleName={reminder.vehicleName}
                  serviceType={reminder.serviceType}
                  dueIn={reminder.dueIn}
                  status={reminder.status}
                  onSchedule={handleScheduleService}
                />
              ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Vehicles */}
        <div className="lg:col-span-2">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">My Vehicles</h2>
              <AddVehicleDialog onAdd={handleAddVehicle}>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Vehicle
                </Button>
              </AddVehicleDialog>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  services={mockServiceSessions.filter(s => s.vehicleId === vehicle.id)}
                  washes={mockWashSessions.filter(w => w.vehicleId === vehicle.id)}
                  maintenanceRating={calculateMaintenanceRating(vehicle.id)}
                  onViewHistory={() => handleViewHistory(vehicle.id)}
                />
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
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        session.paymentStatus === 'paid' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-warning/10 text-warning'
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
                <span className="text-muted-foreground">Progress to Platinum</span>
                <span className="text-foreground">65%</span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  style={{ width: '65%' }}
                />
              </div>
            </div>

            <Button className="w-full" variant="outline" onClick={() => toast.info('Rewards catalog coming soon!')}>
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

          {/* Upcoming Reminders */}
          <div className="mt-6 bg-card rounded-xl border border-border p-4">
            <h3 className="font-medium text-foreground mb-3 text-sm">Upcoming Maintenance</h3>
            <div className="space-y-2">
              {reminders
                .filter(r => r.status === 'upcoming')
                .slice(0, 2)
                .map((reminder, i) => (
                  <div key={i} className="text-xs text-muted-foreground flex justify-between">
                    <span>{reminder.serviceType}</span>
                    <span>{reminder.dueIn}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

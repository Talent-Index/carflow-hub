import { Car, Droplets, Wrench, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MaintenanceRating } from './MaintenanceRating';
import { Vehicle, ServiceSession, WashSession } from '@/types';

interface VehicleCardProps {
  vehicle: Vehicle;
  services: ServiceSession[];
  washes: WashSession[];
  maintenanceRating: number;
  onViewHistory: () => void;
}

export function VehicleCard({ 
  vehicle, 
  services, 
  washes, 
  maintenanceRating,
  onViewHistory 
}: VehicleCardProps) {
  const completedServices = services.filter(s => s.status === 'completed').length;
  const completedWashes = washes.filter(w => w.status === 'completed').length;

  return (
    <div className="bg-card rounded-xl border border-border p-5 hover:border-primary/30 transition-all group">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Car className="w-8 h-8 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-lg">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {vehicle.licensePlate} • {vehicle.color}
          </p>
          <MaintenanceRating rating={maintenanceRating} size="sm" />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Wrench className="w-4 h-4 text-secondary" />
            <span>{completedServices} services</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Droplets className="w-4 h-4 text-primary" />
            <span>{completedWashes} washes</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onViewHistory}>
          History
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

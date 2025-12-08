import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ServiceReminderProps {
  vehicleName: string;
  serviceType: string;
  dueIn: string; // e.g., "3 days", "200 miles", "Overdue"
  status: 'overdue' | 'due_soon' | 'upcoming';
  onSchedule?: () => void;
}

export function ServiceReminder({ 
  vehicleName, 
  serviceType, 
  dueIn, 
  status, 
  onSchedule 
}: ServiceReminderProps) {
  const statusConfig = {
    overdue: {
      icon: AlertTriangle,
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/30',
      iconColor: 'text-destructive',
      textColor: 'text-destructive',
    },
    due_soon: {
      icon: Clock,
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/30',
      iconColor: 'text-warning',
      textColor: 'text-warning',
    },
    upcoming: {
      icon: CheckCircle,
      bgColor: 'bg-muted',
      borderColor: 'border-border',
      iconColor: 'text-muted-foreground',
      textColor: 'text-muted-foreground',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`rounded-lg border p-4 ${config.bgColor} ${config.borderColor}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${status === 'overdue' ? 'bg-destructive/20' : status === 'due_soon' ? 'bg-warning/20' : 'bg-background'}`}>
          <Icon className={`w-4 h-4 ${config.iconColor}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground text-sm">{serviceType}</h4>
            <span className={`text-xs font-medium ${config.textColor}`}>
              {status === 'overdue' ? 'Overdue' : dueIn}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{vehicleName}</p>
        </div>
        {status !== 'upcoming' && onSchedule && (
          <Button size="sm" variant={status === 'overdue' ? 'destructive' : 'outline'} onClick={onSchedule}>
            Schedule
          </Button>
        )}
      </div>
    </div>
  );
}

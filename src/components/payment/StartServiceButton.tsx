import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PaymentDialog } from './PaymentDialog';
import { startService, SERVICE_PRICES } from '@/lib/x402-client';
import { Wrench, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PaymentState {
  status: 'idle' | 'requires_payment' | 'signing' | 'settling' | 'complete' | 'error';
  requirements?: {
    resource: string;
    price: string;
    asset: string;
    network: string;
    recipient: string;
    facilitatorUrl: string;
  };
  error?: string;
}

type ServiceType = 'oil_change' | 'tire_rotation' | 'brake_service' | 'inspection' | 'other';

interface StartServiceButtonProps {
  vehicleId: string;
  branchId: string;
  operatorId: string;
  serviceType: ServiceType;
  description?: string;
  mileage?: number;
  customerId?: string;
  onSuccess?: (data: unknown) => void;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
}

const SERVICE_LABELS: Record<ServiceType, string> = {
  oil_change: 'Oil Change',
  tire_rotation: 'Tire Rotation',
  brake_service: 'Brake Service',
  inspection: 'Inspection',
  other: 'Other Service',
};

export function StartServiceButton({
  vehicleId,
  branchId,
  operatorId,
  serviceType,
  description,
  mileage,
  customerId,
  onSuccess,
  className,
  variant = 'default',
  size = 'default',
}: StartServiceButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState>({ status: 'idle' });

  const price = SERVICE_PRICES[serviceType];
  const label = SERVICE_LABELS[serviceType];

  const handleStartService = async () => {
    setIsLoading(true);
    setDialogOpen(true);
    
    try {
      const result = await startService(
        vehicleId,
        branchId,
        operatorId,
        serviceType,
        { description, mileage, customerId },
        (state) => {
          setPaymentState(state);
        }
      );

      if (result.success) {
        toast({
          title: 'Service Started!',
          description: `${label} session initiated`,
        });
        onSuccess?.(result.data);
      }
    } catch (error) {
      console.error('Start service error:', error);
      toast({
        title: 'Error',
        description: 'Failed to start service session',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    // Payment flow is automatic
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setPaymentState({ status: 'idle' });
    setIsLoading(false);
  };

  return (
    <>
      <Button
        onClick={handleStartService}
        disabled={isLoading}
        variant={variant}
        size={size}
        className={className}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Wrench className="h-4 w-4 mr-2" />
        )}
        Start {label} - ${price}
      </Button>

      <PaymentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        status={paymentState.status}
        requirements={paymentState.requirements}
        error={paymentState.error}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}

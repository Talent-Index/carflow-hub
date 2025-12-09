import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PaymentDialog } from './PaymentDialog';
import { startWash, WASH_PRICES } from '@/lib/x402-client';
import { Droplets, Loader2 } from 'lucide-react';
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

interface StartWashButtonProps {
  vehicleId: string;
  branchId: string;
  operatorId: string;
  washType: 'basic' | 'standard' | 'premium' | 'deluxe';
  customerId?: string;
  onSuccess?: (data: unknown) => void;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
}

export function StartWashButton({
  vehicleId,
  branchId,
  operatorId,
  washType,
  customerId,
  onSuccess,
  className,
  variant = 'default',
  size = 'default',
}: StartWashButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState>({ status: 'idle' });

  const price = WASH_PRICES[washType];

  const handleStartWash = async () => {
    setIsLoading(true);
    setDialogOpen(true);
    
    try {
      const result = await startWash(
        vehicleId,
        branchId,
        operatorId,
        washType,
        customerId,
        (state) => {
          setPaymentState(state);
        }
      );

      if (result.success) {
        toast({
          title: 'Wash Started!',
          description: `${washType.charAt(0).toUpperCase() + washType.slice(1)} wash session initiated`,
        });
        onSuccess?.(result.data);
      }
    } catch (error) {
      console.error('Start wash error:', error);
      toast({
        title: 'Error',
        description: 'Failed to start wash session',
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
        onClick={handleStartWash}
        disabled={isLoading}
        variant={variant}
        size={size}
        className={className}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Droplets className="h-4 w-4 mr-2" />
        )}
        Start {washType.charAt(0).toUpperCase() + washType.slice(1)} Wash - ${price}
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

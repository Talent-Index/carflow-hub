import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PaymentDialog } from './PaymentDialog';
import { startWash, WASH_PRICES } from '@/lib/x402-client';
import { Zap, Loader2 } from 'lucide-react';
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

export function X402DemoButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState>({ status: 'idle' });

  const handleDemo = async () => {
    setIsLoading(true);
    setDialogOpen(true);
    
    try {
      const result = await startWash(
        'demo-vehicle-001',
        'demo-branch-001',
        'demo-operator-001',
        'basic',
        'demo-customer-001',
        (state) => {
          setPaymentState(state);
        }
      );

      if (result.success) {
        toast({
          title: 'x402 Demo Complete!',
          description: 'Successfully completed the full payment cycle',
        });
      }
    } catch (error) {
      console.error('Demo error:', error);
      toast({
        title: 'Demo Error',
        description: 'Failed to complete the demo',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    // Payment is handled automatically by the state machine
    // This callback is for UI feedback
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setPaymentState({ status: 'idle' });
    setIsLoading(false);
  };

  return (
    <>
      <Button
        onClick={handleDemo}
        disabled={isLoading}
        className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg"
        size="lg"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Zap className="h-4 w-4 mr-2" />
        )}
        Try x402 Payment Demo
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

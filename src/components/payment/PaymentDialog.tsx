import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle, Wallet, ArrowRight } from 'lucide-react';

interface PaymentRequirements {
  resource: string;
  price: string;
  asset: string;
  network: string;
  recipient: string;
}

type PaymentStatus = 'idle' | 'requires_payment' | 'signing' | 'settling' | 'complete' | 'error';
type ProcessingStatus = Exclude<PaymentStatus, 'complete' | 'error'>;

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: PaymentStatus;
  requirements?: PaymentRequirements;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PaymentDialog({
  open,
  onOpenChange,
  status,
  requirements,
  error,
  onConfirm,
  onCancel,
}: PaymentDialogProps) {
  const isProcessing = status === 'signing' || status === 'settling';
  const isComplete = status === 'complete';
  const hasError = status === 'error';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isComplete && <CheckCircle2 className="h-5 w-5 text-green-500" />}
            {hasError && <XCircle className="h-5 w-5 text-destructive" />}
            {!isComplete && !hasError && <Wallet className="h-5 w-5 text-primary" />}
            
            {status === 'requires_payment' && 'Payment Required'}
            {status === 'signing' && 'Signing Transaction'}
            {status === 'settling' && 'Settling Payment'}
            {status === 'complete' && 'Payment Complete'}
            {status === 'error' && 'Payment Failed'}
          </DialogTitle>
          <DialogDescription>
            {status === 'requires_payment' && 'Confirm payment with Core Wallet'}
            {status === 'signing' && 'Please sign the transaction in your wallet'}
            {status === 'settling' && 'Settling payment on Avalanche...'}
            {status === 'complete' && 'Your transaction has been confirmed'}
            {status === 'error' && (error || 'Something went wrong')}
          </DialogDescription>
        </DialogHeader>

        {requirements && !isComplete && !hasError && (
          <div className="space-y-4 py-4">
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="text-lg font-bold">
                  {requirements.price} {requirements.asset}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Network</span>
                <Badge variant="secondary">{requirements.network}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Recipient</span>
                <span className="text-xs font-mono truncate max-w-[200px]">
                  {requirements.recipient}
                </span>
              </div>
            </div>

            {/* x402 flow visualization */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className={status === 'requires_payment' ? 'text-primary font-medium' : ''}>
                HTTP 402
              </span>
              <ArrowRight className="h-3 w-3" />
              <span className={status === 'signing' ? 'text-primary font-medium' : ''}>
                Sign
              </span>
              <ArrowRight className="h-3 w-3" />
              <span className={status === 'settling' ? 'text-primary font-medium' : ''}>
                Settle
              </span>
              <ArrowRight className="h-3 w-3" />
              <span>
                200 OK
              </span>
            </div>
          </div>
        )}

        {isComplete && (
          <div className="py-4 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Transaction confirmed on Avalanche network
            </p>
          </div>
        )}

        <DialogFooter>
          {status === 'requires_payment' && (
            <>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={onConfirm}>
                <Wallet className="h-4 w-4 mr-2" />
                Pay with Core Wallet
              </Button>
            </>
          )}

          {isProcessing && (
            <Button disabled className="w-full">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {status === 'signing' ? 'Awaiting signature...' : 'Processing...'}
            </Button>
          )}

        {isComplete && (
            <Button 
              onClick={() => onOpenChange(false)} 
              className="w-full"
            >
              Done
            </Button>
          )}

          {hasError && (
            <Button 
              onClick={() => onOpenChange(false)} 
              className="w-full"
              variant="destructive"
            >
              Try Again
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

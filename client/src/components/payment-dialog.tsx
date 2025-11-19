import { DollarSign, Loader2, CheckCircle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ParsedIntent } from "@shared/schema";

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  parsedIntent: ParsedIntent | null;
  onPay: () => void;
  isProcessing: boolean;
  paymentStatus: "idle" | "pending" | "success" | "error";
  error?: string;
}

export function PaymentDialog({
  open,
  onClose,
  parsedIntent,
  onPay,
  isProcessing,
  paymentStatus,
  error,
}: PaymentDialogProps) {
  if (!parsedIntent) return null;

  const priceUSDC = parsedIntent.estimatedPrice || "0.5";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg" data-testid="dialog-payment">
        <DialogHeader>
          <DialogTitle className="text-2xl">Payment Required (HTTP 402)</DialogTitle>
          <DialogDescription>
            This API endpoint requires payment to access
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Action</span>
              <Badge variant="secondary" data-testid="badge-action">
                {parsedIntent.action}
              </Badge>
            </div>
            
            {parsedIntent.endpoint && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Endpoint</span>
                <code className="text-xs font-mono bg-muted px-2 py-1 rounded" data-testid="text-endpoint">
                  {parsedIntent.endpoint}
                </code>
              </div>
            )}

            {parsedIntent.params && Object.keys(parsedIntent.params).length > 0 && (
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Parameters</span>
                <div className="bg-muted rounded-md p-3">
                  <pre className="text-xs font-mono" data-testid="text-params">
                    {JSON.stringify(parsedIntent.params, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold">Total Cost</span>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <span className="text-3xl font-bold" data-testid="text-price">
                  {priceUSDC}
                </span>
                <span className="text-lg text-muted-foreground">USDC</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-right">
              One-time payment on Base network
            </p>
          </div>

          {paymentStatus === "error" && error && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <XCircle className="h-4 w-4 text-destructive mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">Payment Failed</p>
                <p className="text-xs text-destructive/80 mt-1" data-testid="text-error">{error}</p>
              </div>
            </div>
          )}

          {paymentStatus === "success" && (
            <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-md">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Payment Successful</p>
                <p className="text-xs text-green-600/80 dark:text-green-400/80 mt-1">
                  Access granted to API endpoint
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
            data-testid="button-cancel-payment"
          >
            Cancel
          </Button>
          <Button
            onClick={onPay}
            disabled={isProcessing || paymentStatus === "success"}
            className="gap-2"
            data-testid="button-confirm-payment"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : paymentStatus === "success" ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Paid
              </>
            ) : (
              <>
                <DollarSign className="h-4 w-4" />
                Pay {priceUSDC} USDC
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

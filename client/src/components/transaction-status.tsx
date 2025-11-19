import { CheckCircle, XCircle, Loader2, ExternalLink, Copy, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { TransactionStatus as TxStatus } from "@shared/schema";

interface TransactionStatusProps {
  status: TxStatus;
  chainId?: number;
}

const BLOCK_EXPLORERS: Record<number, string> = {
  8453: "https://basescan.org",
  84532: "https://sepolia.basescan.org",
  1: "https://etherscan.io",
};

export function TransactionStatus({ status, chainId = 84532 }: TransactionStatusProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (status.status === "idle") return null;

  const progress = status.step && status.totalSteps 
    ? (status.step / status.totalSteps) * 100 
    : 0;

  const explorerUrl = status.txHash 
    ? `${BLOCK_EXPLORERS[chainId] || BLOCK_EXPLORERS[84532]}/tx/${status.txHash}`
    : null;

  const copyTxHash = async () => {
    if (status.txHash) {
      await navigator.clipboard.writeText(status.txHash);
      setCopied(true);
      toast({
        title: "Transaction hash copied",
        description: "Copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncateTxHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  return (
    <Card data-testid="card-transaction-status">
      <CardHeader>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="text-lg">Transaction Status</CardTitle>
            <CardDescription>Real-time blockchain confirmation</CardDescription>
          </div>
          <Badge 
            variant={
              status.status === "success" ? "default" : 
              status.status === "error" ? "destructive" : 
              "secondary"
            }
            data-testid="badge-status"
          >
            {status.status === "success" ? (
              <><CheckCircle className="h-3 w-3 mr-1" /> Success</>
            ) : status.status === "error" ? (
              <><XCircle className="h-3 w-3 mr-1" /> Failed</>
            ) : status.status === "confirming" ? (
              <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Confirming</>
            ) : (
              <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Pending</>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {status.step && status.totalSteps && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium" data-testid="text-progress">
                Step {status.step} of {status.totalSteps}
              </span>
            </div>
            <Progress value={progress} className="h-2" data-testid="progress-bar" />
          </div>
        )}

        {status.txHash && (
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Transaction Hash</span>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs font-mono bg-muted px-3 py-2 rounded" data-testid="text-tx-hash">
                {truncateTxHash(status.txHash)}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={copyTxHash}
                data-testid="button-copy-tx-hash"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              {explorerUrl && (
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  data-testid="button-view-explorer"
                >
                  <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}

        {status.error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive" data-testid="text-error">
              {status.error}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

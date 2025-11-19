import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { IntentComposer } from "@/components/intent-composer";
import { PaymentDialog } from "@/components/payment-dialog";
import { TransactionStatus } from "@/components/transaction-status";
import { AccessHistoryTable } from "@/components/access-history-table";
import { AnalyticsCards } from "@/components/analytics-cards";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ParsedIntent, TransactionStatus as TxStatus, AccessRecord } from "@shared/schema";

interface DashboardProps {
  walletAddress: string | null;
  chainId: number | null;
}

export default function Dashboard({ walletAddress, chainId }: DashboardProps) {
  const { toast } = useToast();
  const [parsedIntent, setParsedIntent] = useState<ParsedIntent | null>(null);
  const [currentIntentId, setCurrentIntentId] = useState<string | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [paymentError, setPaymentError] = useState<string>();
  const [txStatus, setTxStatus] = useState<TxStatus>({ status: "idle" });

  const { data: accessHistory = [], isLoading: isLoadingHistory } = useQuery<AccessRecord[]>({
    queryKey: ["/api/access-history"],
    refetchInterval: 5000,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/analytics"],
    refetchInterval: 10000,
  });

  const parseIntentMutation = useMutation({
    mutationFn: async (data: { rawIntent: string; userType: "human" | "agent" }) => {
      const response = await apiRequest("POST", "/api/parse-intent", {
        ...data,
        walletAddress,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setParsedIntent(data.parsedIntent);
      setCurrentIntentId(data.intentId);
      setShowPaymentDialog(true);
      setPaymentStatus("idle");
      setPaymentError(undefined);
      toast({
        title: "Intent parsed successfully",
        description: `Action: ${data.parsedIntent.action}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to parse intent",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const processPaymentMutation = useMutation({
    mutationFn: async (data: {
      intentId: string;
      walletAddress: string;
      amount: string;
      endpoint: string;
      params?: Record<string, any>;
    }) => {
      const response = await apiRequest("POST", "/api/process-payment", data);
      return response.json();
    },
    onSuccess: () => {
      setPaymentStatus("success");
      setTxStatus({
        status: "success",
        step: 3,
        totalSteps: 3,
        txHash: "0x" + Math.random().toString(16).slice(2, 66),
      });

      queryClient.invalidateQueries({ queryKey: ["/api/access-history"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });

      toast({
        title: "Payment successful",
        description: "Access granted to API endpoint",
      });

      setTimeout(() => {
        setShowPaymentDialog(false);
        setTxStatus({ status: "idle" });
      }, 2000);
    },
    onError: (error: any) => {
      setPaymentStatus("error");
      setPaymentError(error.message || "Payment failed");
      setTxStatus({
        status: "error",
        error: error.message || "Transaction failed",
      });

      toast({
        title: "Payment failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleParseIntent = async (intent: string, userType: "human" | "agent") => {
    parseIntentMutation.mutate({ rawIntent: intent, userType });
  };

  const handlePayment = async () => {
    if (!walletAddress || !parsedIntent || !currentIntentId) return;

    setPaymentStatus("pending");
    setTxStatus({
      status: "pending",
      step: 1,
      totalSteps: 3,
    });

    setTimeout(() => {
      setTxStatus({
        status: "confirming",
        step: 2,
        totalSteps: 3,
        txHash: "0x" + Math.random().toString(16).slice(2, 66),
      });

      processPaymentMutation.mutate({
        intentId: currentIntentId,
        walletAddress,
        amount: parsedIntent.estimatedPrice || "0.5",
        endpoint: parsedIntent.endpoint || "/api/general",
        params: parsedIntent.params,
      });
    }, 1500);
  };

  const defaultStats = {
    totalTransactions: stats?.totalTransactions || 0,
    totalSpent: stats?.totalSpent || "0.00",
    successRate: stats?.successRate || 0,
    avgResponseTime: stats?.avgResponseTime || "0ms",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Compose intents and access pay-per-use APIs on Base
        </p>
      </div>

      <AnalyticsCards stats={defaultStats} />

      <div id="composer">
        <IntentComposer 
          onParse={handleParseIntent} 
          isParsing={parseIntentMutation.isPending} 
        />
      </div>

      {txStatus.status !== "idle" && (
        <TransactionStatus status={txStatus} chainId={chainId || undefined} />
      )}

      <div id="history">
        <AccessHistoryTable
          history={accessHistory}
          isLoading={isLoadingHistory}
          chainId={chainId || undefined}
        />
      </div>

      <PaymentDialog
        open={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        parsedIntent={parsedIntent}
        onPay={handlePayment}
        isProcessing={paymentStatus === "pending"}
        paymentStatus={paymentStatus}
        error={paymentError}
      />
    </div>
  );
}

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { parseIntent } from "./services/intent-parser";
import {
  getNFTMints,
  getGasPrice,
  getWhaleTxs,
  getTokenPrice,
  getArbitrageOpportunities,
  getWalletBalance,
  executeSwap,
} from "./services/mock-apis";
import { z } from "zod";

const parseIntentSchema = z.object({
  rawIntent: z.string().min(1, "Intent cannot be empty"),
  userType: z.enum(["human", "agent"], {
    errorMap: () => ({ message: "userType must be 'human' or 'agent'" }),
  }),
  walletAddress: z.string().nullable().optional(),
});

const processPaymentSchema = z.object({
  intentId: z.string().min(1, "Intent ID is required"),
  walletAddress: z.string().min(1, "Wallet address is required"),
  amount: z.string().min(1, "Amount is required"),
  endpoint: z.string().min(1, "Endpoint is required"),
  params: z.record(z.any()).optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/parse-intent", async (req, res) => {
    try {
      const validation = parseIntentSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          error: "Validation failed",
          details: validation.error.errors.map(e => e.message).join(", "),
        });
      }

      const { rawIntent, userType, walletAddress } = validation.data;

      const parsedIntent = await parseIntent(rawIntent, userType);

      const intent = await storage.createIntent({
        rawIntent,
        parsedAction: parsedIntent,
        userType,
        walletAddress: walletAddress || null,
        status: "parsed",
      });

      res.json({
        success: true,
        intentId: intent.id,
        parsedIntent,
      });
    } catch (error: any) {
      console.error("Error parsing intent:", error);
      res.status(500).json({ 
        error: "Failed to parse intent",
        message: error.message || "Internal server error",
      });
    }
  });

  app.post("/api/process-payment", async (req, res) => {
    try {
      const validation = processPaymentSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          error: "Validation failed",
          details: validation.error.errors.map(e => e.message).join(", "),
        });
      }

      const { intentId, walletAddress, amount, endpoint, params } = validation.data;

      const payment = await storage.createPayment({
        intentId,
        amount,
        currency: "USDC",
        walletAddress,
        status: "pending",
        txHash: null,
        blockNumber: null,
        confirmations: "0",
      });

      setTimeout(async () => {
        const mockTxHash = "0x" + Math.random().toString(16).slice(2, 66);
        await storage.updatePaymentStatus(
          payment.id,
          "confirmed",
          mockTxHash,
          String(Math.floor(Math.random() * 1000000) + 1000000),
          "12"
        );

        let apiResponse;
        switch (endpoint) {
          case "/api/nft-mints":
            apiResponse = getNFTMints(params || {});
            break;
          case "/api/gas-price":
            apiResponse = getGasPrice(params || {});
            break;
          case "/api/whale-txs":
            apiResponse = getWhaleTxs(params || {});
            break;
          case "/api/token-price":
            apiResponse = getTokenPrice(params || {});
            break;
          case "/api/arbitrage":
            apiResponse = getArbitrageOpportunities(params || {});
            break;
          case "/api/wallet-balance":
            apiResponse = getWalletBalance(params || {});
            break;
          case "/api/swap":
            apiResponse = executeSwap(params || {});
            break;
          default:
            apiResponse = { success: true, data: "API response" };
        }

        await storage.updateIntentStatus(intentId, "fulfilled");

        await storage.createAccessRecord({
          paymentId: payment.id,
          intentId,
          endpoint,
          apiResponse,
          accessGranted: true,
          proofTxHash: mockTxHash,
        });
      }, 1000);

      res.json({
        success: true,
        paymentId: payment.id,
        status: "processing",
      });
    } catch (error: any) {
      console.error("Error processing payment:", error);
      res.status(500).json({ 
        error: "Failed to process payment",
        message: error.message || "Internal server error",
      });
    }
  });

  app.get("/api/payment-status/:paymentId", async (req, res) => {
    try {
      const { paymentId } = req.params;
      const payment = await storage.getPayment(paymentId);

      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      res.json({
        success: true,
        payment,
      });
    } catch (error) {
      console.error("Error fetching payment status:", error);
      res.status(500).json({ error: "Failed to fetch payment status" });
    }
  });

  app.get("/api/access-history", async (req, res) => {
    try {
      const { walletAddress } = req.query;

      if (!walletAddress || typeof walletAddress !== "string") {
        const allRecords = await storage.getAllAccessRecords();
        const allIntents = await storage.getAllIntents();
        const allPayments = await storage.getAllPayments();

        const enrichedRecords = allRecords.map((record) => ({
          ...record,
          intent: allIntents.find((i) => i.id === record.intentId),
          payment: allPayments.find((p) => p.id === record.paymentId),
        }));

        return res.json(enrichedRecords);
      }

      const records = await storage.getAccessRecordsByWallet(walletAddress);
      const allIntents = await storage.getAllIntents();
      const allPayments = await storage.getAllPayments();

      const enrichedRecords = records.map((record) => ({
        ...record,
        intent: allIntents.find((i) => i.id === record.intentId),
        payment: allPayments.find((p) => p.id === record.paymentId),
      }));

      res.json(enrichedRecords);
    } catch (error) {
      console.error("Error fetching access history:", error);
      res.status(500).json({ error: "Failed to fetch access history" });
    }
  });

  app.get("/api/analytics", async (req, res) => {
    try {
      const { walletAddress } = req.query;

      const allPayments = walletAddress
        ? await storage.getPaymentsByWallet(walletAddress as string)
        : await storage.getAllPayments();

      const totalTransactions = allPayments.length;
      const totalSpent = allPayments
        .reduce((sum, p) => sum + parseFloat(p.amount), 0)
        .toFixed(2);
      const successfulPayments = allPayments.filter((p) => p.status === "confirmed").length;
      const successRate = totalTransactions > 0 
        ? Math.round((successfulPayments / totalTransactions) * 100) 
        : 0;

      res.json({
        totalTransactions,
        totalSpent,
        successRate,
        avgResponseTime: "125ms",
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.get("/api/endpoints", async (req, res) => {
    try {
      const endpoints = await storage.getActiveApiEndpoints();
      res.json(endpoints);
    } catch (error) {
      console.error("Error fetching endpoints:", error);
      res.status(500).json({ error: "Failed to fetch endpoints" });
    }
  });

  app.post("/api/nft-mints", (req, res) => {
    res.status(402).json({
      error: "Payment Required",
      message: "This endpoint requires payment to access",
      priceUSDC: "0.5",
      endpoint: "/api/nft-mints",
    });
  });

  app.post("/api/gas-price", (req, res) => {
    res.status(402).json({
      error: "Payment Required",
      message: "This endpoint requires payment to access",
      priceUSDC: "0.25",
      endpoint: "/api/gas-price",
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}

import {
  type Intent,
  type InsertIntent,
  type Payment,
  type InsertPayment,
  type AccessRecord,
  type InsertAccessRecord,
  type ApiEndpoint,
  type InsertApiEndpoint,
} from "@shared/schema";
import { randomUUID } from "crypto";

var MemStorage = class {
  intents: Map<string, Intent>;
  payments: Map<string, Payment>;
  accessRecords: Map<string, AccessRecord>;
  apiEndpoints: Map<string, ApiEndpoint>;
  constructor() {
    this.intents = /* @__PURE__ */ new Map<string, Intent>();
    this.payments = /* @__PURE__ */ new Map<string, Payment>();
    this.accessRecords = /* @__PURE__ */ new Map<string, AccessRecord>();
    this.apiEndpoints = /* @__PURE__ */ new Map<string, ApiEndpoint>();
    this.seedApiEndpoints();
  }
  seedApiEndpoints() {
    const endpoints = [
      { name: "NFT Mints API", path: "/api/nft-mints", description: "Fetch top NFT mints in the last hour", priceUSDC: "0.5", category: "NFT", isActive: true },
      { name: "Gas Price Oracle", path: "/api/gas-price", description: "Get current gas prices on Base network", priceUSDC: "0.25", category: "Analytics", isActive: true },
      { name: "Whale Transaction Monitor", path: "/api/whale-txs", description: "Monitor large transactions on Base", priceUSDC: "1.0", category: "Analytics", isActive: true },
      { name: "Token Price Oracle", path: "/api/token-price", description: "Real-time token price data", priceUSDC: "0.3", category: "Oracle", isActive: true },
      { name: "DEX Arbitrage Scanner", path: "/api/arbitrage", description: "Find arbitrage opportunities across DEXs", priceUSDC: "2.0", category: "DeFi", isActive: true }
    ];
    endpoints.forEach((endpoint) => {
      const id = randomUUID();
      const apiEndpoint: ApiEndpoint = {
        ...endpoint,
        id,
        createdAt: /* @__PURE__ */ new Date(),
        isActive: endpoint.isActive ?? true
      };
      this.apiEndpoints.set(id, apiEndpoint);
    });
  }
  async createIntent(insertIntent: InsertIntent): Promise<Intent> {
    const id = randomUUID();
    const intent: Intent = {
      ...insertIntent,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      status: insertIntent.status ?? "parsed",
      walletAddress: insertIntent.walletAddress ?? null
    };
    this.intents.set(id, intent);
    return intent;
  }
  async getIntent(id: string): Promise<Intent | undefined> {
    return this.intents.get(id);
  }
  async getAllIntents(): Promise<Intent[]> {
    return Array.from(this.intents.values());
  }
  async getIntentsByWallet(walletAddress: string): Promise<Intent[]> {
    return Array.from(this.intents.values()).filter(
      (intent) => intent.walletAddress === walletAddress
    );
  }
  async updateIntentStatus(id: string, status: Intent["status"]): Promise<Intent | undefined> {
    const intent = this.intents.get(id);
    if (!intent) return void 0;
    const updatedIntent: Intent = {
      ...intent,
      status,
    };
    this.intents.set(id, updatedIntent);
    return updatedIntent;
  }
  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = randomUUID();
    const payment: Payment = {
      ...insertPayment,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      confirmedAt: null,
      status: insertPayment.status ?? "pending",
      currency: insertPayment.currency ?? "USDC",
      txHash: insertPayment.txHash ?? null,
      blockNumber: insertPayment.blockNumber != null ? String(insertPayment.blockNumber) : null,
      confirmations: insertPayment.confirmations ?? null
    };
    this.payments.set(id, payment);
    return payment;
  }
  async getPayment(id: string): Promise<Payment | undefined> {
    return this.payments.get(id);
  }
  async getAllPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }
  async getPaymentsByWallet(walletAddress: string): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      (payment) => payment.walletAddress === walletAddress
    );
  }
  async updatePaymentStatus(
    id: string,
    status: Payment["status"],
    txHash?: string | null,
    blockNumber?: number | null,
    confirmations?: number | null
  ): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return void 0;
    const updatedPayment: Payment = {
      ...payment,
      status,
      txHash: txHash ?? payment.txHash,
      blockNumber: blockNumber != null ? String(blockNumber) : payment.blockNumber,
      confirmations: confirmations != null ? String(confirmations) : payment.confirmations,
      confirmedAt: status === "confirmed" ? /* @__PURE__ */ new Date() : payment.confirmedAt,
    };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }
  async createAccessRecord(insertRecord: InsertAccessRecord): Promise<AccessRecord> {
    const id = randomUUID();
    const record: AccessRecord = {
      ...insertRecord,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      apiResponse: insertRecord.apiResponse ?? null,
      accessGranted: insertRecord.accessGranted ?? false,
      proofTxHash: insertRecord.proofTxHash ?? null
    };
    this.accessRecords.set(id, record);
    return record;
  }
  async getAccessRecord(id: string): Promise<AccessRecord | undefined> {
    return this.accessRecords.get(id);
  }
  async getAllAccessRecords(): Promise<AccessRecord[]> {
    return Array.from(this.accessRecords.values());
  }
  async getAccessRecordsByWallet(walletAddress: string): Promise<AccessRecord[]> {
    const allRecords = Array.from(this.accessRecords.values());
    const allPayments = Array.from(this.payments.values());
    return allRecords.filter((record) => {
      const payment = allPayments.find((p) => p.id === record.paymentId);
      return payment?.walletAddress === walletAddress;
    });
  }
  async updateAccessRecordProof(id: string, proofTxHash: string): Promise<AccessRecord | undefined> {
    const record = this.accessRecords.get(id);
    if (!record) return void 0;
    const updatedRecord: AccessRecord = {
      ...record,
      proofTxHash,
    };
    this.accessRecords.set(id, updatedRecord);
    return updatedRecord;
  }
  async createApiEndpoint(insertEndpoint: InsertApiEndpoint): Promise<ApiEndpoint> {
    const id = randomUUID();
    const endpoint: ApiEndpoint = {
      ...insertEndpoint,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      isActive: insertEndpoint.isActive ?? true
    };
    this.apiEndpoints.set(id, endpoint);
    return endpoint;
  }
  async getApiEndpoint(id: string): Promise<ApiEndpoint | undefined> {
    return this.apiEndpoints.get(id);
  }
  async getApiEndpointByPath(path3: string) {
    return Array.from(this.apiEndpoints.values()).find(
      (endpoint) => endpoint.path === path3
    );
  }
  async getAllApiEndpoints(): Promise<ApiEndpoint[]> {
    return Array.from(this.apiEndpoints.values());
  }
  async getActiveApiEndpoints(): Promise<ApiEndpoint[]> {
    return Array.from(this.apiEndpoints.values()).filter(
      (endpoint) => endpoint.isActive
    );
  }
};
var storage = new MemStorage();

export { storage };

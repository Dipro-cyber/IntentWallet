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

export interface IStorage {
  createIntent(intent: InsertIntent): Promise<Intent>;
  getIntent(id: string): Promise<Intent | undefined>;
  getAllIntents(): Promise<Intent[]>;
  getIntentsByWallet(walletAddress: string): Promise<Intent[]>;
  updateIntentStatus(id: string, status: string): Promise<Intent | undefined>;

  createPayment(payment: InsertPayment): Promise<Payment>;
  getPayment(id: string): Promise<Payment | undefined>;
  getAllPayments(): Promise<Payment[]>;
  getPaymentsByWallet(walletAddress: string): Promise<Payment[]>;
  updatePaymentStatus(
    id: string,
    status: string,
    txHash?: string,
    blockNumber?: string,
    confirmations?: string
  ): Promise<Payment | undefined>;

  createAccessRecord(record: InsertAccessRecord): Promise<AccessRecord>;
  getAccessRecord(id: string): Promise<AccessRecord | undefined>;
  getAllAccessRecords(): Promise<AccessRecord[]>;
  getAccessRecordsByWallet(walletAddress: string): Promise<AccessRecord[]>;
  updateAccessRecordProof(id: string, proofTxHash: string): Promise<AccessRecord | undefined>;

  createApiEndpoint(endpoint: InsertApiEndpoint): Promise<ApiEndpoint>;
  getApiEndpoint(id: string): Promise<ApiEndpoint | undefined>;
  getApiEndpointByPath(path: string): Promise<ApiEndpoint | undefined>;
  getAllApiEndpoints(): Promise<ApiEndpoint[]>;
  getActiveApiEndpoints(): Promise<ApiEndpoint[]>;
}

export class MemStorage implements IStorage {
  private intents: Map<string, Intent>;
  private payments: Map<string, Payment>;
  private accessRecords: Map<string, AccessRecord>;
  private apiEndpoints: Map<string, ApiEndpoint>;

  constructor() {
    this.intents = new Map();
    this.payments = new Map();
    this.accessRecords = new Map();
    this.apiEndpoints = new Map();
    this.seedApiEndpoints();
  }

  private seedApiEndpoints() {
    const endpoints: InsertApiEndpoint[] = [
      {
        name: "NFT Mints API",
        path: "/api/nft-mints",
        description: "Fetch top NFT mints in the last hour",
        priceUSDC: "0.5",
        category: "NFT",
        isActive: true,
      },
      {
        name: "Gas Price Oracle",
        path: "/api/gas-price",
        description: "Get current gas prices on Base network",
        priceUSDC: "0.25",
        category: "Analytics",
        isActive: true,
      },
      {
        name: "Whale Transaction Monitor",
        path: "/api/whale-txs",
        description: "Monitor large transactions on Base",
        priceUSDC: "1.0",
        category: "Analytics",
        isActive: true,
      },
      {
        name: "Token Price Oracle",
        path: "/api/token-price",
        description: "Real-time token price data",
        priceUSDC: "0.3",
        category: "Oracle",
        isActive: true,
      },
      {
        name: "DEX Arbitrage Scanner",
        path: "/api/arbitrage",
        description: "Find arbitrage opportunities across DEXs",
        priceUSDC: "2.0",
        category: "DeFi",
        isActive: true,
      },
    ];

    endpoints.forEach((endpoint) => {
      const id = randomUUID();
      const apiEndpoint: ApiEndpoint = {
        ...endpoint,
        id,
        createdAt: new Date(),
      };
      this.apiEndpoints.set(id, apiEndpoint);
    });
  }

  async createIntent(insertIntent: InsertIntent): Promise<Intent> {
    const id = randomUUID();
    const intent: Intent = {
      ...insertIntent,
      id,
      createdAt: new Date(),
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

  async updateIntentStatus(id: string, status: string): Promise<Intent | undefined> {
    const intent = this.intents.get(id);
    if (!intent) return undefined;

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
      createdAt: new Date(),
      confirmedAt: null,
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
    status: string,
    txHash?: string,
    blockNumber?: string,
    confirmations?: string
  ): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;

    const updatedPayment: Payment = {
      ...payment,
      status,
      txHash: txHash || payment.txHash,
      blockNumber: blockNumber || payment.blockNumber,
      confirmations: confirmations || payment.confirmations,
      confirmedAt: status === "confirmed" ? new Date() : payment.confirmedAt,
    };

    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }

  async createAccessRecord(insertRecord: InsertAccessRecord): Promise<AccessRecord> {
    const id = randomUUID();
    const record: AccessRecord = {
      ...insertRecord,
      id,
      createdAt: new Date(),
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

  async updateAccessRecordProof(
    id: string,
    proofTxHash: string
  ): Promise<AccessRecord | undefined> {
    const record = this.accessRecords.get(id);
    if (!record) return undefined;

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
      createdAt: new Date(),
    };
    this.apiEndpoints.set(id, endpoint);
    return endpoint;
  }

  async getApiEndpoint(id: string): Promise<ApiEndpoint | undefined> {
    return this.apiEndpoints.get(id);
  }

  async getApiEndpointByPath(path: string): Promise<ApiEndpoint | undefined> {
    return Array.from(this.apiEndpoints.values()).find(
      (endpoint) => endpoint.path === path
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
}

export const storage = new MemStorage();

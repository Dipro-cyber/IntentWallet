import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const intents = pgTable("intents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rawIntent: text("raw_intent").notNull(),
  parsedAction: jsonb("parsed_action").notNull(),
  userType: text("user_type").notNull(),
  walletAddress: text("wallet_address"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertIntentSchema = createInsertSchema(intents).omit({
  id: true,
  createdAt: true,
});

export type InsertIntent = z.infer<typeof insertIntentSchema>;
export type Intent = typeof intents.$inferSelect;

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  intentId: varchar("intent_id").notNull(),
  amount: text("amount").notNull(),
  currency: text("currency").notNull().default("USDC"),
  txHash: text("tx_hash"),
  walletAddress: text("wallet_address").notNull(),
  status: text("status").notNull().default("pending"),
  blockNumber: text("block_number"),
  confirmations: text("confirmations").default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  confirmedAt: timestamp("confirmed_at"),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  confirmedAt: true,
});

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

export const accessRecords = pgTable("access_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  paymentId: varchar("payment_id").notNull(),
  intentId: varchar("intent_id").notNull(),
  endpoint: text("endpoint").notNull(),
  apiResponse: jsonb("api_response"),
  accessGranted: boolean("access_granted").notNull().default(false),
  proofTxHash: text("proof_tx_hash"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAccessRecordSchema = createInsertSchema(accessRecords).omit({
  id: true,
  createdAt: true,
});

export type InsertAccessRecord = z.infer<typeof insertAccessRecordSchema>;
export type AccessRecord = typeof accessRecords.$inferSelect;

export const apiEndpoints = pgTable("api_endpoints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  path: text("path").notNull().unique(),
  description: text("description").notNull(),
  priceUSDC: text("price_usdc").notNull(),
  category: text("category").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertApiEndpointSchema = createInsertSchema(apiEndpoints).omit({
  id: true,
  createdAt: true,
});

export type InsertApiEndpoint = z.infer<typeof insertApiEndpointSchema>;
export type ApiEndpoint = typeof apiEndpoints.$inferSelect;

export interface ParsedIntent {
  action: string;
  endpoint?: string;
  params?: Record<string, any>;
  estimatedPrice?: string;
  confidence?: number;
}

export interface IntentExample {
  text: string;
  category: string;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  balance: {
    eth: string;
    usdc: string;
  };
}

export interface TransactionStatus {
  status: "idle" | "pending" | "confirming" | "success" | "error";
  txHash?: string;
  error?: string;
  step?: number;
  totalSteps?: number;
}

import OpenAI from "openai";
import type { ParsedIntent } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const API_ENDPOINTS = {
  "swap-tokens": { path: "/api/swap", price: "0.5" },
  "nft-mints": { path: "/api/nft-mints", price: "0.5" },
  "gas-price": { path: "/api/gas-price", price: "0.25" },
  "whale-transactions": { path: "/api/whale-txs", price: "1.0" },
  "token-price": { path: "/api/token-price", price: "0.3" },
  "arbitrage": { path: "/api/arbitrage", price: "2.0" },
  "wallet-balance": { path: "/api/wallet-balance", price: "0.1" },
};

export async function parseIntent(
  rawIntent: string,
  userType: "human" | "agent"
): Promise<ParsedIntent> {
  if (!openai) {
    console.warn("OPENAI_API_KEY not configured, using mock intent parser");
    return mockParseIntent(rawIntent);
  }

  try {
    const systemPrompt = `You are an expert blockchain intent parser for a Web3 wallet system. 
Your job is to analyze user intents and map them to specific API endpoints with parameters.

Available endpoints and their pricing (in USDC):
- /api/swap - Token swaps (0.5 USDC)
- /api/nft-mints - NFT mint data (0.5 USDC)
- /api/gas-price - Gas price data (0.25 USDC)
- /api/whale-txs - Large transaction monitoring (1.0 USDC)
- /api/token-price - Token price oracle (0.3 USDC)
- /api/arbitrage - DEX arbitrage scanner (2.0 USDC)
- /api/wallet-balance - Wallet balance check (0.1 USDC)

Parse the intent and respond with JSON containing:
{
  "action": "brief description of action",
  "endpoint": "API path",
  "params": { key-value pairs of extracted parameters },
  "estimatedPrice": "price in USDC",
  "confidence": 0.0-1.0
}`;

    const userPrompt = `User type: ${userType}
Intent: "${rawIntent}"

Parse this intent and determine the appropriate API endpoint and parameters.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const parsed: ParsedIntent = JSON.parse(content);

    if (!parsed.estimatedPrice) {
      const endpointKey = Object.keys(API_ENDPOINTS).find((key) =>
        parsed.action.toLowerCase().includes(key.replace(/-/g, " "))
      );
      if (endpointKey) {
        parsed.estimatedPrice = API_ENDPOINTS[endpointKey as keyof typeof API_ENDPOINTS].price;
      } else {
        parsed.estimatedPrice = "0.5";
      }
    }

    return parsed;
  } catch (error) {
    console.error("Error parsing intent with OpenAI, falling back to mock:", error);
    return mockParseIntent(rawIntent);
  }
}

function mockParseIntent(rawIntent: string): ParsedIntent {
  const intentLower = rawIntent.toLowerCase();

  if (intentLower.includes("swap") || intentLower.includes("exchange")) {
    return {
      action: "Token Swap",
      endpoint: "/api/swap",
      params: {
        fromToken: "ETH",
        toToken: "USDC",
        amount: "2",
        slippage: "0.5",
      },
      estimatedPrice: "0.5",
      confidence: 0.85,
    };
  }

  if (intentLower.includes("nft") && intentLower.includes("mint")) {
    return {
      action: "Fetch NFT Mints",
      endpoint: "/api/nft-mints",
      params: {
        timeframe: "1h",
        network: "base",
      },
      estimatedPrice: "0.5",
      confidence: 0.9,
    };
  }

  if (intentLower.includes("gas")) {
    return {
      action: "Get Gas Prices",
      endpoint: "/api/gas-price",
      params: {
        network: "base",
      },
      estimatedPrice: "0.25",
      confidence: 0.95,
    };
  }

  if (intentLower.includes("whale") || intentLower.includes("large transaction")) {
    return {
      action: "Monitor Whale Transactions",
      endpoint: "/api/whale-txs",
      params: {
        threshold: "100 ETH",
        network: "base",
      },
      estimatedPrice: "1.0",
      confidence: 0.88,
    };
  }

  if (intentLower.includes("arbitrage")) {
    return {
      action: "DEX Arbitrage Scanner",
      endpoint: "/api/arbitrage",
      params: {
        minProfit: "100",
        dexes: ["uniswap", "base-dex"],
      },
      estimatedPrice: "2.0",
      confidence: 0.82,
    };
  }

  if (intentLower.includes("balance") || intentLower.includes("wallet")) {
    return {
      action: "Check Wallet Balance",
      endpoint: "/api/wallet-balance",
      params: {
        tokens: ["ETH", "USDC"],
      },
      estimatedPrice: "0.1",
      confidence: 0.92,
    };
  }

  if (intentLower.includes("price") && intentLower.includes("oracle")) {
    return {
      action: "Token Price Oracle",
      endpoint: "/api/token-price",
      params: {
        pair: "ETH/USD",
      },
      estimatedPrice: "0.3",
      confidence: 0.87,
    };
  }

  return {
    action: "General API Request",
    endpoint: "/api/general",
    params: {},
    estimatedPrice: "0.5",
    confidence: 0.6,
  };
}

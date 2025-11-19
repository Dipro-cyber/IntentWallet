export function getNFTMints(params: any) {
  return {
    success: true,
    data: {
      mints: [
        {
          collection: "Base Punks",
          contractAddress: "0x1234...5678",
          count: 1247,
          floorPrice: "0.05 ETH",
          volume24h: "12.5 ETH",
        },
        {
          collection: "Base Apes",
          contractAddress: "0x8765...4321",
          count: 892,
          floorPrice: "0.08 ETH",
          volume24h: "8.2 ETH",
        },
        {
          collection: "Onchain Summer",
          contractAddress: "0xabcd...efgh",
          count: 2103,
          floorPrice: "Free Mint",
          volume24h: "0 ETH",
        },
      ],
      timeframe: params.timeframe || "1h",
      timestamp: new Date().toISOString(),
    },
  };
}

export function getGasPrice(params: any) {
  const baseGwei = Math.random() * 0.5 + 0.1;
  return {
    success: true,
    data: {
      network: params.network || "base",
      slow: {
        gwei: baseGwei.toFixed(4),
        usd: (baseGwei * 0.000001 * 2000).toFixed(6),
        time: "~30 seconds",
      },
      standard: {
        gwei: (baseGwei * 1.2).toFixed(4),
        usd: (baseGwei * 1.2 * 0.000001 * 2000).toFixed(6),
        time: "~15 seconds",
      },
      fast: {
        gwei: (baseGwei * 1.5).toFixed(4),
        usd: (baseGwei * 1.5 * 0.000001 * 2000).toFixed(6),
        time: "~5 seconds",
      },
      timestamp: new Date().toISOString(),
    },
  };
}

export function getWhaleTxs(params: any) {
  return {
    success: true,
    data: {
      transactions: [
        {
          hash: "0x" + Math.random().toString(16).slice(2, 66),
          from: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
          to: "0x1234567890123456789012345678901234567890",
          value: "152.5 ETH",
          usdValue: "$305,000",
          timestamp: new Date(Date.now() - 120000).toISOString(),
        },
        {
          hash: "0x" + Math.random().toString(16).slice(2, 66),
          from: "0x9876543210987654321098765432109876543210",
          to: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
          value: "200.0 ETH",
          usdValue: "$400,000",
          timestamp: new Date(Date.now() - 300000).toISOString(),
        },
      ],
      threshold: params.threshold || "100 ETH",
      network: params.network || "base",
    },
  };
}

export function getTokenPrice(params: any) {
  const basePrice = 2000 + Math.random() * 100;
  return {
    success: true,
    data: {
      pair: params.pair || "ETH/USD",
      price: basePrice.toFixed(2),
      change24h: (Math.random() * 10 - 5).toFixed(2) + "%",
      volume24h: "$" + (Math.random() * 1000000000).toFixed(0),
      high24h: (basePrice * 1.02).toFixed(2),
      low24h: (basePrice * 0.98).toFixed(2),
      timestamp: new Date().toISOString(),
    },
  };
}

export function getArbitrageOpportunities(params: any) {
  return {
    success: true,
    data: {
      opportunities: [
        {
          id: "arb-1",
          tokenPair: "ETH/USDC",
          buyDex: "Uniswap",
          sellDex: "Base DEX",
          buyPrice: "2000.50",
          sellPrice: "2005.25",
          profitUSD: "237.50",
          profitPercent: "0.24%",
          gasEstimate: "0.002 ETH",
          netProfit: "233.50",
        },
        {
          id: "arb-2",
          tokenPair: "USDC/DAI",
          buyDex: "Base DEX",
          sellDex: "SushiSwap",
          buyPrice: "0.9995",
          sellPrice: "1.0015",
          profitUSD: "200.00",
          profitPercent: "0.20%",
          gasEstimate: "0.0015 ETH",
          netProfit: "197.00",
        },
      ],
      minProfit: params.minProfit || "100",
      timestamp: new Date().toISOString(),
    },
  };
}

export function getWalletBalance(params: any) {
  return {
    success: true,
    data: {
      balances: {
        ETH: {
          balance: "1.5432",
          usdValue: "$3,086.40",
        },
        USDC: {
          balance: "500.00",
          usdValue: "$500.00",
        },
        DAI: {
          balance: "250.50",
          usdValue: "$250.50",
        },
      },
      totalUSD: "$3,836.90",
      network: "base",
      timestamp: new Date().toISOString(),
    },
  };
}

export function executeSwap(params: any) {
  return {
    success: true,
    data: {
      transactionHash: "0x" + Math.random().toString(16).slice(2, 66),
      fromToken: params.fromToken || "ETH",
      toToken: params.toToken || "USDC",
      amountIn: params.amount || "2",
      amountOut: "4000.25",
      slippage: params.slippage || "0.5",
      gasUsed: "0.002 ETH",
      status: "pending",
      timestamp: new Date().toISOString(),
    },
  };
}

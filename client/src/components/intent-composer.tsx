import { useState } from "react";
import { Sparkles, User, Bot, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { IntentExample } from "@shared/schema";

interface IntentComposerProps {
  onParse: (intent: string, userType: "human" | "agent") => void;
  isParsing: boolean;
}

const HUMAN_EXAMPLES: IntentExample[] = [
  { text: "Swap 2 ETH to USDC with <0.5% slippage", category: "DeFi" },
  { text: "Fetch top NFT mints in the last hour", category: "NFT" },
  { text: "Get current gas prices on Base", category: "Analytics" },
  { text: "Check USDC balance for my wallet", category: "Wallet" },
];

const AGENT_EXAMPLES: IntentExample[] = [
  { text: "Execute arbitrage between Uniswap and Base DEX if profit > $100", category: "DeFi" },
  { text: "Monitor whale transactions > 100 ETH and alert", category: "Analytics" },
  { text: "Auto-compound staking rewards every 24h", category: "DeFi" },
  { text: "Fetch real-time oracle price data for ETH/USD", category: "Oracle" },
];

export function IntentComposer({ onParse, isParsing }: IntentComposerProps) {
  const [intent, setIntent] = useState("");
  const [userType, setUserType] = useState<"human" | "agent">("human");

  const examples = userType === "human" ? HUMAN_EXAMPLES : AGENT_EXAMPLES;
  const placeholder = userType === "human" 
    ? "Enter your intent (e.g., swap tokens, fetch NFT data, check balance)..."
    : "Enter agent intent (e.g., execute automated strategy, monitor conditions)...";

  const handleParse = () => {
    if (intent.trim()) {
      onParse(intent, userType);
    }
  };

  const handleExampleClick = (example: string) => {
    setIntent(example);
  };

  return (
    <Card data-testid="card-intent-composer">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="text-2xl font-semibold">Intent Composer</CardTitle>
            <CardDescription className="mt-2">
              Describe what you want to do in natural language
            </CardDescription>
          </div>
          <Tabs value={userType} onValueChange={(v) => setUserType(v as "human" | "agent")}>
            <TabsList data-testid="tabs-user-type">
              <TabsTrigger value="human" className="gap-2" data-testid="tab-human">
                <User className="h-4 w-4" />
                Human
              </TabsTrigger>
              <TabsTrigger value="agent" className="gap-2" data-testid="tab-agent">
                <Bot className="h-4 w-4" />
                AI Agent
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Textarea
            placeholder={placeholder}
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            className="min-h-32 resize-none text-base"
            data-testid="input-intent"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleParse}
              disabled={!intent.trim() || isParsing}
              size="lg"
              className="gap-2"
              data-testid="button-parse-intent"
            >
              {isParsing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Parsing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Parse Intent
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Example Intents:</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="cursor-pointer hover-elevate active-elevate-2 px-3 py-1.5 text-xs"
                onClick={() => handleExampleClick(example.text)}
                data-testid={`badge-example-${idx}`}
              >
                {example.text}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

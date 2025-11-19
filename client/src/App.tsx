import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { AppSidebar } from "@/components/app-sidebar";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";
import type { WalletState } from "@shared/schema";

function Router() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
    balance: {
      eth: "0.0",
      usdc: "0.0",
    },
  });

  const handleConnect = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        setWallet({
          address: accounts[0],
          isConnected: true,
          chainId: parseInt(chainId, 16),
          balance: {
            eth: "1.5",
            usdc: "500.0",
          },
        });
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      const mockAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1";
      setWallet({
        address: mockAddress,
        isConnected: true,
        chainId: 84532,
        balance: {
          eth: "1.5",
          usdc: "500.0",
        },
      });
    }
  };

  const handleDisconnect = () => {
    setWallet({
      address: null,
      isConnected: false,
      chainId: null,
      balance: {
        eth: "0.0",
        usdc: "0.0",
      },
    });
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          handleDisconnect();
        } else {
          setWallet((prev) => ({ ...prev, address: accounts[0] }));
        }
      });

      window.ethereum.on("chainChanged", (chainId: string) => {
        setWallet((prev) => ({ ...prev, chainId: parseInt(chainId, 16) }));
      });
    }
  }, []);

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar chainId={wallet.chainId} />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b gap-4 flex-wrap">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-3 ml-auto">
              {wallet.isConnected && wallet.balance && (
                <div className="hidden sm:flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">ETH:</span>
                    <span className="font-mono font-medium" data-testid="text-balance-eth">
                      {wallet.balance.eth}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">USDC:</span>
                    <span className="font-mono font-medium" data-testid="text-balance-usdc">
                      {wallet.balance.usdc}
                    </span>
                  </div>
                </div>
              )}
              <WalletConnectButton
                address={wallet.address}
                isConnected={wallet.isConnected}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
              />
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto p-6">
              <Switch>
                <Route path="/">
                  <Dashboard walletAddress={wallet.address} chainId={wallet.chainId} />
                </Route>
                <Route component={NotFound} />
              </Switch>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

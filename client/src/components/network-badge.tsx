import { Badge } from "@/components/ui/badge";
import { Circle } from "lucide-react";

interface NetworkBadgeProps {
  chainId: number | null;
}

const NETWORKS: Record<number, { name: string; color: string }> = {
  8453: { name: "Base", color: "rgb(0, 82, 255)" },
  84532: { name: "Base Sepolia", color: "rgb(0, 82, 255)" },
  1: { name: "Ethereum", color: "rgb(99, 102, 241)" },
};

export function NetworkBadge({ chainId }: NetworkBadgeProps) {
  const network = chainId ? NETWORKS[chainId] : null;

  if (!network) {
    return (
      <Badge variant="secondary" className="gap-1.5" data-testid="badge-network-unknown">
        <Circle className="h-2 w-2 fill-muted-foreground" />
        <span className="text-xs">Unknown Network</span>
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="gap-1.5" data-testid={`badge-network-${network.name.toLowerCase().replace(" ", "-")}`}>
      <Circle className="h-2 w-2" style={{ fill: network.color }} />
      <span className="text-xs">{network.name}</span>
    </Badge>
  );
}

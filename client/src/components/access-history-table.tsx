import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AccessRecord, Intent, Payment } from "@shared/schema";

interface AccessHistoryItem extends AccessRecord {
  intent?: Intent;
  payment?: Payment;
}

interface AccessHistoryTableProps {
  history: AccessHistoryItem[];
  isLoading?: boolean;
  chainId?: number;
}

const ITEMS_PER_PAGE = 10;

const BLOCK_EXPLORERS: Record<number, string> = {
  8453: "https://basescan.org",
  84532: "https://sepolia.basescan.org",
  1: "https://etherscan.io",
};

export function AccessHistoryTable({ 
  history, 
  isLoading = false,
  chainId = 84532 
}: AccessHistoryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredHistory = history.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.endpoint.toLowerCase().includes(searchLower) ||
      item.intent?.rawIntent.toLowerCase().includes(searchLower) ||
      item.id.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedHistory = filteredHistory.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const explorerUrl = (txHash: string) => {
    return `${BLOCK_EXPLORERS[chainId] || BLOCK_EXPLORERS[84532]}/tx/${txHash}`;
  };

  return (
    <Card data-testid="card-access-history">
      <CardHeader>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="text-2xl">Access History</CardTitle>
            <CardDescription>Your payment and access records</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9"
              data-testid="input-search-history"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Intent</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Proof</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : paginatedHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No matching records found" : "No access history yet"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedHistory.map((item) => (
                  <TableRow key={item.id} data-testid={`row-access-${item.id}`}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <span className="text-sm" data-testid={`text-intent-${item.id}`}>
                        {truncateText(item.intent?.rawIntent || "N/A", 50)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                        {item.endpoint}
                      </code>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {item.payment?.amount || "0"} USDC
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={item.accessGranted ? "default" : "secondary"}
                        data-testid={`badge-status-${item.id}`}
                      >
                        {item.accessGranted ? "Granted" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.proofTxHash ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1"
                          asChild
                          data-testid={`button-proof-${item.id}`}
                        >
                          <a
                            href={explorerUrl(item.proofTxHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredHistory.length)} of{" "}
              {filteredHistory.length} records
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                data-testid="button-prev-page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm px-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                data-testid="button-next-page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

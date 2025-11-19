import { TrendingUp, TrendingDown, Activity, DollarSign, Zap, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: React.ReactNode;
}

function StatCard({ title, value, trend, icon }: StatCardProps) {
  return (
    <Card data-testid={`card-stat-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold" data-testid={`text-value-${title.toLowerCase().replace(/\s+/g, "-")}`}>
          {value}
        </div>
        {trend && (
          <div className="flex items-center gap-1 mt-2 text-xs">
            {trend.isPositive ? (
              <>
                <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                <span className="text-green-600 dark:text-green-400 font-medium">
                  +{trend.value}%
                </span>
              </>
            ) : (
              <>
                <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                <span className="text-red-600 dark:text-red-400 font-medium">
                  {trend.value}%
                </span>
              </>
            )}
            <span className="text-muted-foreground">from last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface AnalyticsCardsProps {
  stats: {
    totalTransactions: number;
    totalSpent: string;
    successRate: number;
    avgResponseTime: string;
  };
}

export function AnalyticsCards({ stats }: AnalyticsCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Transactions"
        value={stats.totalTransactions}
        trend={{ value: 12.5, isPositive: true }}
        icon={<Activity className="h-4 w-4" />}
      />
      <StatCard
        title="Total Spent"
        value={`${stats.totalSpent} USDC`}
        trend={{ value: 8.2, isPositive: true }}
        icon={<DollarSign className="h-4 w-4" />}
      />
      <StatCard
        title="Success Rate"
        value={`${stats.successRate}%`}
        trend={{ value: 2.1, isPositive: true }}
        icon={<Zap className="h-4 w-4" />}
      />
      <StatCard
        title="Avg Response"
        value={stats.avgResponseTime}
        trend={{ value: 15.3, isPositive: false }}
        icon={<Database className="h-4 w-4" />}
      />
    </div>
  );
}

import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export const DashboardMetrics = ({ metrics }: { metrics: any }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Revenue"
        value={`$${metrics?.totalRevenue?.toLocaleString() || '0'}`}
        change="+12.5%"
        trend="up"
        icon={DollarSign}
        onClick={() => window.location.href = '/revenue'}
      />
      <MetricCard
        title="Total Expenses"
        value={`$${metrics?.totalExpenses?.toLocaleString() || '0'}`}
        change="-2.3%"
        trend="down"
        icon={Wallet}
        onClick={() => window.location.href = '/write-offs'}
      />
      <MetricCard
        title="Net Profit"
        value={`$${metrics?.netProfit?.toLocaleString() || '0'}`}
        change="+8.2%"
        trend="up"
        icon={TrendingUp}
        onClick={() => window.location.href = '/income-statement'}
      />
      <MetricCard
        title="Available Balance"
        value={`$${metrics?.availableBalance?.toLocaleString() || '0'}`}
        change="+3.1%"
        trend="up"
        icon={Wallet}
        onClick={() => window.location.href = '/balance-sheet'}
      />
    </div>
  );
};

const MetricCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon,
  onClick 
}: { 
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
  onClick?: () => void;
}) => {
  return (
    <Card 
      className={cn(
        "p-6 bg-gradient-to-br from-card via-card to-muted/20 border-none",
        "hover:shadow-lg transition-all cursor-pointer",
        "transform hover:scale-105 transition-transform duration-200"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className={`flex items-center gap-1 ${
          trend === 'up' ? 'text-green-500' : 'text-red-500'
        }`}>
          {trend === 'up' ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownRight className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">{change}</span>
        </div>
      </div>
      <h3 className="text-sm text-muted-foreground mb-1">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </Card>
  );
};
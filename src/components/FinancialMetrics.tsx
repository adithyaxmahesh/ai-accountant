import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FinancialMetrics = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card 
        className="glass-card p-6 hover-scale cursor-pointer"
        onClick={() => navigate('/revenue')}
      >
        <DollarSign className="h-8 w-8 mb-4 text-primary" />
        <h3 className="text-lg font-semibold">Revenue</h3>
        <p className="text-2xl font-bold truncate">$84,234</p>
        <p className="text-sm text-muted-foreground">+12.5% from last month</p>
      </Card>
      <Card 
        className="glass-card p-6 hover-scale cursor-pointer"
        onClick={() => navigate('/forecast')}
      >
        <TrendingUp className="h-8 w-8 mb-4 text-primary" />
        <h3 className="text-lg font-semibold">Growth</h3>
        <p className="text-3xl font-bold">23.8%</p>
        <p className="text-sm text-muted-foreground">Year over year</p>
      </Card>
      <Card 
        className="glass-card p-6 hover-scale cursor-pointer"
        onClick={() => navigate('/audit')}
      >
        <AlertTriangle className="h-8 w-8 mb-4 text-destructive" />
        <h3 className="text-lg font-semibold">Alerts</h3>
        <p className="text-3xl font-bold">2</p>
        <p className="text-sm text-muted-foreground">Require attention</p>
      </Card>
    </div>
  );
};
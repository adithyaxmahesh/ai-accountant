import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { categorizeTransaction } from "@/utils/expenseCategories";

export const BusinessIntelligence = () => {
  const { session } = useAuth();
  const { toast } = useToast();

  const { data: financialData } = useQuery({
    queryKey: ['financial-metrics', session?.user.id],
    queryFn: async () => {
      // Fetch all financial transactions
      const { data: transactions } = await supabase
        .from('revenue_records')
        .select('*')
        .eq('user_id', session?.user.id);

      const { data: expenses } = await supabase
        .from('write_offs')
        .select('*')
        .eq('user_id', session?.user.id);

      // Categorize and analyze all transactions
      const categorizedTransactions = await Promise.all([
        ...(transactions || []).map(async t => ({
          ...t,
          ...(await categorizeTransaction(t.description, t.amount))
        })),
        ...(expenses || []).map(async e => ({
          ...e,
          ...(await categorizeTransaction(e.description, -e.amount))
        }))
      ]);

      // Calculate metrics by month
      const monthlyData = categorizedTransactions.reduce((acc, curr) => {
        const date = new Date(curr.date);
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const key = `${month} ${year}`;

        if (!acc[key]) {
          acc[key] = { revenue: 0, expenses: 0, profit: 0, month: key };
        }

        if (curr.isExpense) {
          acc[key].expenses += Math.abs(Number(curr.amount));
        } else {
          acc[key].revenue += Number(curr.amount);
        }
        acc[key].profit = acc[key].revenue - acc[key].expenses;

        return acc;
      }, {} as Record<string, any>);

      return Object.values(monthlyData);
    }
  });

  const { data: insights, refetch } = useQuery({
    queryKey: ['business-insights', session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_insights')
        .select('*')
        .eq('user_id', session?.user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      return data;
    }
  });

  const generateInsights = async () => {
    try {
      toast({
        title: "Generating Insights",
        description: "Analyzing your business data...",
      });

      const { error } = await supabase.functions.invoke('generate-insights', {
        body: { userId: session?.user.id }
      });

      if (error) throw error;
      await refetch();

      toast({
        title: "Insights Generated",
        description: "New business insights are available",
      });
    } catch (error) {
      console.error("Error generating insights:", error);
      toast({
        title: "Error",
        description: "Failed to generate insights. Please try again.",
        variant: "destructive",
      });
    }
  };

  const totalRevenue = financialData?.reduce((sum, month) => sum + month.revenue, 0) || 0;
  const totalExpenses = financialData?.reduce((sum, month) => sum + month.expenses, 0) || 0;
  const totalProfit = totalRevenue - totalExpenses;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <LineChart className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Business Intelligence</h2>
        </div>
        <Button onClick={generateInsights} className="hover-scale">
          <RefreshCw className="mr-2 h-4 w-4" />
          Generate New Insights
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-muted rounded-lg">
          <DollarSign className="h-5 w-5 text-green-500 mb-2" />
          <h3 className="text-sm font-medium">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-500">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <ArrowDownRight className="h-5 w-5 text-red-500 mb-2" />
          <h3 className="text-sm font-medium">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-500">${totalExpenses.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <ArrowUpRight className="h-5 w-5 text-blue-500 mb-2" />
          <h3 className="text-sm font-medium">Net Profit</h3>
          <p className="text-2xl font-bold text-blue-500">${totalProfit.toLocaleString()}</p>
        </div>
      </div>

      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={financialData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" name="Revenue" fill="#22c55e" />
            <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
            <Bar dataKey="profit" name="Profit" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-6">
        {insights?.map((insight) => (
          <div key={insight.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="font-medium">{insight.category}</span>
              </div>
              <span className={`text-sm font-medium ${
                insight.priority === 'high' ? 'text-red-500' : 
                insight.priority === 'medium' ? 'text-yellow-500' : 
                'text-green-500'
              }`}>
                {insight.priority?.toUpperCase()}
              </span>
            </div>

            <div className="space-y-2">
              {insight.recommendations?.map((rec, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                  {rec.includes('increase') || rec.includes('growth') ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500 mt-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500 mt-1" />
                  )}
                  <p className="text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { categorizeTransaction } from "@/utils/expenseCategories";

export const ExpenseCategoriesCard = () => {
  const { session } = useAuth();

  const { data: expenses } = useQuery({
    queryKey: ['categorized-expenses', session?.user.id],
    queryFn: async () => {
      // Fetch both revenue and expense transactions
      const [{ data: writeOffs }, { data: revenues }] = await Promise.all([
        supabase
          .from('write_offs')
          .select('amount, description, date')
          .eq('user_id', session?.user.id),
        supabase
          .from('revenue_records')
          .select('amount, description, date')
          .eq('user_id', session?.user.id)
      ]);

      const transactions = [
        ...(writeOffs || []).map(t => ({ ...t, amount: -Math.abs(t.amount) })),
        ...(revenues || [])
      ];

      const categorizedExpenses = await Promise.all(
        transactions.map(async (transaction) => {
          const { category, isExpense } = await categorizeTransaction(
            transaction.description,
            transaction.amount
          );
          return {
            ...transaction,
            category,
            isExpense
          };
        })
      );

      const categories = categorizedExpenses.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(categories).map(([name, value]) => ({
        name,
        value: Math.abs(value)
      }));
    }
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Expense Categories</h3>
      <ScrollArea className="h-[300px]">
        <div className="h-[200px] mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenses}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenses?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2">
          {expenses?.map((category, index) => (
            <div key={category.name} className="flex justify-between items-center p-2">
              <span className="font-medium">{category.name}</span>
              <span>${category.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
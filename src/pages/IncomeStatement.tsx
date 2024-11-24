import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const IncomeStatement = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const { data: statements, isLoading } = useQuery({
    queryKey: ['income-statements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('income_statements')
        .select('*')
        .eq('user_id', session?.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user.id,
  });

  if (!session) {
    return (
      <div className="container mx-auto p-6">
        <Button onClick={() => navigate('/auth')}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Income Statement</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : statements && statements.length > 0 ? (
            <div className="space-y-4">
              {statements.map((statement) => (
                <div key={statement.id} className="p-4 border rounded-lg">
                  <h3 className="font-semibold">{statement.name}</h3>
                  <p className="text-sm text-muted-foreground">{statement.description}</p>
                  <p className="mt-2">Amount: ${statement.amount}</p>
                  <p className="text-sm">Category: {statement.category}</p>
                  <p className="text-sm">Type: {statement.type}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No income statements found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IncomeStatement;
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Send, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";

export const QueryInterface = () => {
  const { toast } = useToast();
  const { session } = useAuth();
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch financial data for context
  const { data: writeOffs } = useQuery({
    queryKey: ['write-offs', session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('write_offs')
        .select('*')
        .eq('user_id', session?.user.id);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: revenueRecords } = useQuery({
    queryKey: ['revenue-records', session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('revenue_records')
        .select('*')
        .eq('user_id', session?.user.id);
      
      if (error) throw error;
      return data;
    }
  });

  const handleQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-query', {
        body: { 
          query,
          userId: session?.user.id,
          context: {
            writeOffs,
            revenueRecords
          }
        }
      });

      if (error) throw error;

      setAnswer(data.answer);
      toast({
        title: "Analysis Complete",
        description: "Your query has been processed",
      });
    } catch (error) {
      console.error("Error processing query:", error);
      toast({
        title: "Query Failed",
        description: "There was an error processing your query",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 glass-card">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">AI Tax Assistant</h2>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about expenses, tax write-offs, or financial optimization..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
            className="flex-1"
          />
          <Button onClick={handleQuery} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {answer && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="whitespace-pre-wrap">{answer}</p>
          </div>
        )}

        {!answer && (
          <div className="text-sm text-muted-foreground">
            <p>You can ask questions like:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>"What was my largest expense last month?"</li>
              <li>"How can I optimize my tax deductions?"</li>
              <li>"What vehicle expenses can I write off?"</li>
              <li>"Show me my tax savings opportunities"</li>
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};
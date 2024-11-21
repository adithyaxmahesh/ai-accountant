import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { TaxSummaryCard } from "./tax-summary/TaxSummaryCard";
import { TaxSummarySelects } from "./tax-summary/TaxSummarySelects";
import { calculateTaxes } from "./tax-summary/TaxCalculationUtils";
import { DollarSign, Calculator } from "lucide-react";
import { useState } from "react";

interface TaxSummaryProps {
  audit?: any;
}

const TaxSummaryTab = ({ audit }: TaxSummaryProps) => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>('corporation');
  const [selectedState, setSelectedState] = useState<string>('California');

  const { data: taxAnalysis, isError } = useQuery({
    queryKey: ['tax-analysis', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('tax_analysis')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('analysis_type', 'summary')
        .order('created_at', { ascending: false })
        .maybeSingle();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching tax analysis",
          description: error.message
        });
        return null;
      }
      return data;
    }
  });

  const updateTaxAnalysis = useMutation({
    mutationFn: async (values: { businessType: string; state: string }) => {
      if (!session?.user?.id) return;
      
      const { error } = await supabase
        .from('tax_analysis')
        .upsert({
          user_id: session.user.id,
          analysis_type: 'summary',
          jurisdiction: values.state,
          recommendations: {
            business_type: values.businessType,
            state: values.state
          }
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tax-analysis'] });
      toast({
        title: "Settings Updated",
        description: "Your tax analysis settings have been saved."
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update settings. Please try again."
      });
    }
  });

  const handleBusinessTypeChange = (value: string) => {
    setSelectedBusinessType(value);
    updateTaxAnalysis.mutate({ businessType: value, state: selectedState });
  };

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    updateTaxAnalysis.mutate({ businessType: selectedBusinessType, state: value });
  };

  const {
    totalAmount = 0,
    deductions = 0,
    estimatedTax = 0,
    effectiveRate = 0,
    taxableIncome = 0,
    minimumTax = 800
  } = calculateTaxes(taxAnalysis, audit) || {};

  if (isError) {
    return <div>Error loading tax summary</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TaxSummarySelects
          selectedBusinessType={selectedBusinessType}
          selectedState={selectedState}
          onBusinessTypeChange={handleBusinessTypeChange}
          onStateChange={handleStateChange}
        />

        <TaxSummaryCard
          icon={DollarSign}
          title="Total Revenue"
          value={`$${totalAmount.toLocaleString()}`}
          className="text-primary"
        />

        <TaxSummaryCard
          icon={DollarSign}
          title="Deductions"
          value={`$${deductions.toLocaleString()}`}
          className="text-green-500"
        />

        <TaxSummaryCard
          icon={DollarSign}
          title="Taxable Income"
          value={`$${taxableIncome.toLocaleString()}`}
          className="text-yellow-500"
        />

        <TaxSummaryCard
          icon={Calculator}
          title="Minimum Tax"
          value={`$${minimumTax.toLocaleString()}`}
          className="text-purple-500"
        />

        <TaxSummaryCard
          icon={DollarSign}
          title="Estimated Tax"
          value={`$${estimatedTax.toLocaleString()}`}
          className="text-red-500"
        />

        <TaxSummaryCard
          icon={DollarSign}
          title="Effective Rate"
          value={`${effectiveRate.toFixed(2)}%`}
          className="text-indigo-500"
        />
      </div>
    </div>
  );
};

export default TaxSummaryTab;
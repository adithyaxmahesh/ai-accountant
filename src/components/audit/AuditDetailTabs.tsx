import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuditItemsSection from "./AuditItemsSection";
import AuditHealthSection from "./AuditHealthSection";
import AuditStatusSection from "./AuditStatusSection";
import AuditTrailSection from "./AuditTrailSection";
import { AutomatedAuditSection } from "./AutomatedAuditSection";
import { AutomatedAuditResults } from "./AutomatedAuditResults";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AuditDetailTabsProps {
  auditId: string;
  onStatusChange?: () => void;
}

const getRiskLevelExplanation = (level: string) => {
  const explanations: Record<string, string> = {
    low: "Minimal risk identified - standard monitoring sufficient",
    medium: "Moderate risk - enhanced monitoring recommended",
    high: "Significant risk - immediate attention required",
    critical: "Critical risk level - urgent intervention needed"
  };
  return explanations[level] || "Risk level explanation not available";
};

const getStatusExplanation = (status: string) => {
  const explanations: Record<string, string> = {
    planning: "Initial audit planning and scope definition",
    control_evaluation: "Evaluating internal controls and processes",
    evidence_gathering: "Collecting and analyzing audit evidence",
    review: "Reviewing findings and preparing report",
    completed: "Audit completed and report finalized"
  };
  return explanations[status] || "Status explanation not available";
};

const AuditDetailTabs = ({ auditId, onStatusChange }: AuditDetailTabsProps) => {
  const { data: audit } = useQuery({
    queryKey: ['audit', auditId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_reports')
        .select('*')
        .eq('id', auditId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="items">Audit Items</TabsTrigger>
        <TabsTrigger value="automated">Automated Analysis</TabsTrigger>
        <TabsTrigger value="trail">Audit Trail</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="grid gap-4 md:grid-cols-2">
          <AuditHealthSection 
            audit={audit} 
            getRiskLevelExplanation={getRiskLevelExplanation}
          />
          <AuditStatusSection 
            audit={audit} 
            getStatusExplanation={getStatusExplanation}
            onUpdate={onStatusChange}
          />
        </div>
      </TabsContent>

      <TabsContent value="items">
        <AuditItemsSection auditItems={audit?.audit_items || []} />
      </TabsContent>

      <TabsContent value="automated">
        <div className="space-y-6">
          <AutomatedAuditSection 
            auditId={auditId}
            onComplete={onStatusChange}
          />
          {audit?.automated_analysis && (
            <AutomatedAuditResults 
              results={{
                riskScores: audit.risk_scores,
                controlEffectiveness: audit.control_effectiveness,
                anomaly_detection: audit.anomaly_detection
              }}
            />
          )}
        </div>
      </TabsContent>

      <TabsContent value="trail">
        <AuditTrailSection auditId={auditId} />
      </TabsContent>
    </Tabs>
  );
};

export default AuditDetailTabs;
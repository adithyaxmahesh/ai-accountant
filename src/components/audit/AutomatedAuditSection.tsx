import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, CheckCircle, Clock, Activity } from "lucide-react";

interface AutomatedAuditSectionProps {
  auditId: string;
  onComplete?: () => void;
}

export const AutomatedAuditSection = ({ auditId, onComplete }: AutomatedAuditSectionProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const startAutomatedAudit = async () => {
    setIsRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke('automated-audit', {
        body: { auditId }
      });

      if (error) throw error;

      toast({
        title: "Automated Audit Complete",
        description: "The audit analysis has been completed successfully.",
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error running automated audit:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete automated audit. Please try again.",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Automated Audit Analysis</h3>
        <Button 
          onClick={startAutomatedAudit} 
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <Activity className="mr-2 h-4 w-4 animate-spin" />
              Running Analysis...
            </>
          ) : (
            "Start Automated Audit"
          )}
        </Button>
      </div>

      {isRunning && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Analysis in progress...</span>
          </div>
          <Progress value={45} className="h-2" />
        </div>
      )}
    </Card>
  );
};
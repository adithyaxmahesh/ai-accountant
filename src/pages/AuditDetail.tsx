import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthProvider";
import AuditDetailHeader from "@/components/audit/AuditDetailHeader";
import AuditDetailTabs from "@/components/audit/AuditDetailTabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const AuditDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const { data: audit, isLoading, error } = useQuery({
    queryKey: ['audit', id],
    queryFn: async () => {
      if (!id || !session?.user?.id) {
        throw new Error('No audit ID provided or user not authenticated');
      }
      
      const { data, error } = await supabase
        .from('audit_reports')
        .select(`
          *,
          audit_items(*)
        `)
        .eq('id', id)
        .eq('user_id', session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session && !!id
  });

  if (!session) {
    navigate('/auth');
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : 'Failed to load audit details',
      variant: "destructive"
    });
    navigate('/audit');
    return null;
  }

  if (!audit) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Audit Not Found</h2>
          <button 
            onClick={() => navigate('/audit')}
            className="text-primary hover:underline"
          >
            Return to Audits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <AuditDetailHeader 
        audit={audit}
        flaggedItems={audit?.audit_items?.filter(item => item.status === 'flagged') || []}
        selectedItemId={selectedItemId}
        setSelectedItemId={setSelectedItemId}
      />
      <AuditDetailTabs 
        auditId={id!} 
        onStatusChange={() => {
          window.location.reload();
        }}
      />
    </div>
  );
};

export default AuditDetail;
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  FileCheck, 
  Users,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type AssuranceEngagement = Tables<"assurance_engagements">;

export const AssuranceLearning = () => {
  const { data: engagements, isLoading } = useQuery({
    queryKey: ["assurance-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assurance_engagements")
        .select("*, assurance_procedures(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as AssuranceEngagement[];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-muted/50 rounded-lg animate-pulse" />
        <div className="h-32 bg-muted/50 rounded-lg animate-pulse" />
        <div className="h-32 bg-muted/50 rounded-lg animate-pulse" />
      </div>
    );
  }

  // Calculate analytics
  const totalEngagements = engagements?.length || 0;
  const completedEngagements = engagements?.filter(e => e.status === 'completed').length || 0;
  const inProgressEngagements = engagements?.filter(e => e.status === 'in_progress').length || 0;
  const highRiskEngagements = engagements?.filter(e => 
    e.risk_assessment && (e.risk_assessment as any).level === 'high'
  ).length || 0;
  const compliantEngagements = engagements?.filter(e => 
    e.findings && (e.findings as any[]).length === 0
  ).length || 0;
  const complianceRate = totalEngagements ? (compliantEngagements / totalEngagements) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Assurance Analytics</h2>
          <p className="text-muted-foreground">Comprehensive analysis of assurance engagements</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Assurance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Engagements</span>
                <span className="text-2xl font-bold">{totalEngagements}</span>
              </div>
              <Progress value={completedEngagements / totalEngagements * 100} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {((completedEngagements / totalEngagements) * 100).toFixed(1)}% completion rate
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-3xl font-bold">{Math.round(complianceRate)}%</p>
              <p className="text-sm text-muted-foreground">Overall compliance rate</p>
              <div className="flex items-center gap-2 mt-4">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">{highRiskEngagements} high-risk items</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Engagement Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Completed</span>
                </div>
                <span className="font-medium">{completedEngagements}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">In Progress</span>
                </div>
                <span className="font-medium">{inProgressEngagements}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {engagements?.slice(0, 5).map((engagement) => (
                <div 
                  key={engagement.id} 
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium">{engagement.client_name}</p>
                    <p className="text-sm text-muted-foreground">{engagement.engagement_type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      engagement.status === 'completed' ? 'bg-green-100 text-green-800' :
                      engagement.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {engagement.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
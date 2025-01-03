import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AuditItemCard from "@/components/AuditItemCard";

interface AuditItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  status: string;
}

interface AuditItemsSectionProps {
  auditItems: AuditItem[];
}

const AuditItemsSection = ({ auditItems }: AuditItemsSectionProps) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const getFraudInsights = (item: AuditItem) => {
    const insights = [];
    
    if (item.status === 'flagged') {
      insights.push({
        description: 'Transaction has been flagged for suspicious activity',
        severity: 'high' as const,
        amount: item.amount
      });
    }

    if (item.amount > 10000) {
      insights.push({
        description: 'Large transaction amount detected',
        severity: 'medium' as const,
        amount: item.amount
      });
    }

    return insights;
  };

  if (!Array.isArray(auditItems)) {
    return (
      <p className="text-muted-foreground text-center py-4">
        No audit items available
      </p>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-lg font-semibold">
          Audit Items ({auditItems.length})
        </h3>
        <Badge variant="outline" className="ml-2">
          {auditItems.filter(item => item.status === 'flagged').length} Flagged
        </Badge>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Individual transactions or records being reviewed</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <div className="space-y-4">
        {auditItems.map((item) => {
          const insights = getFraudInsights(item);
          return (
            <div key={item.id} className="relative">
              <AuditItemCard 
                item={item}
                insights={insights}
                isSelected={selectedItemId === item.id}
                onSelect={() => setSelectedItemId(item.id === selectedItemId ? null : item.id)}
              />
            </div>
          );
        })}
        {auditItems.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            No audit items added yet
          </p>
        )}
      </div>
    </div>
  );
};

export default AuditItemsSection;
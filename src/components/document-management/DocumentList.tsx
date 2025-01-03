import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Trash2, FileText } from "lucide-react";
import { ProcessedDocument } from "@/components/types";
import { cn } from "@/lib/utils";

interface DocumentListProps {
  documents: ProcessedDocument[];
  processing: boolean;
  onAnalyze: (documentId: string) => void;
  onDelete: (documentId: string) => void;
}

export const DocumentList = ({ documents, processing, onAnalyze, onDelete }: DocumentListProps) => {
  if (!documents.length) {
    return (
      <div className="text-center text-muted-foreground">
        No documents uploaded yet
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{doc.name}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Uploaded on {formatDate(doc.uploadedAt)}
                </p>
                
                {/* Display detected write-offs if available */}
                {doc.extracted_data?.writeOffs && doc.extracted_data.writeOffs.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">Recent Write-offs:</p>
                    {doc.extracted_data.writeOffs.map((writeOff: any, index: number) => (
                      <div 
                        key={index}
                        className="text-sm p-3 bg-muted/50 rounded-md flex justify-between items-start"
                      >
                        <div className="space-y-1">
                          <div className="font-medium">{writeOff.description}</div>
                          <div className="text-xs text-muted-foreground">
                            {writeOff.category} - {writeOff.taxCodeId || "Pending Tax Code"}
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-medium">${writeOff.amount.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(doc.uploadedAt)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {writeOff.status || "Pending"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAnalyze(doc.id)}
                  disabled={processing || doc.status === 'analyzed'}
                  className={cn(
                    "hover-scale",
                    doc.status === 'analyzed' && "bg-green-50 text-green-600 hover:bg-green-50"
                  )}
                >
                  <Brain className="h-4 w-4 mr-1" />
                  {doc.status === 'analyzed' ? 'Analyzed' : 'Analyze'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(doc.id)}
                  className="hover-scale text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};
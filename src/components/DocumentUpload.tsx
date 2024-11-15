import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Brain } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { DocumentList } from "./DocumentList";
import { ProcessedDocument } from "./types";

export const DocumentUpload = () => {
  const { toast } = useToast();
  const { session } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [processing, setProcessing] = useState(false);

  const analyzeDocument = async (documentId: string) => {
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-document', {
        body: { documentId }
      });

      if (error) throw error;

      toast({
        title: "Analysis Complete",
        description: "Document has been processed successfully",
      });

      // Update the document status in the UI
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { 
              ...doc, 
              status: 'Analyzed',
              confidence: data?.confidence_score || 95
            }
          : doc
      ));
    } catch (error) {
      console.error("Error analyzing document:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "There was an error analyzing your document.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);
      toast({
        title: "Upload Started",
        description: "Processing your document...",
      });

      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create document record in the database
      const { data: docRecord, error: dbError } = await supabase
        .from('processed_documents')
        .insert({
          user_id: session?.user.id,
          original_filename: file.name,
          storage_path: fileName,
          processing_status: 'uploaded',
          document_type: fileExt
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Add document to UI list
      const newDoc: ProcessedDocument = {
        id: docRecord.id,
        name: file.name,
        status: "Uploaded",
        confidence: 0,
        uploadedAt: new Date().toISOString(),
        type: fileExt || 'unknown'
      };

      setDocuments(prev => [newDoc, ...prev]);

      toast({
        title: "Upload Successful",
        description: "Your document has been uploaded and is ready for analysis.",
      });

      // Start analysis
      await analyzeDocument(docRecord.id);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "There was an error uploading your document.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (event.target) {
        event.target.value = '';  // Reset file input
      }
    }
  };

  return (
    <Card className="glass-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Document Processing</h3>
        <div className="relative">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
            onChange={handleFileUpload}
            disabled={uploading || processing}
          />
          <label htmlFor="file-upload">
            <Button
              className="hover-scale cursor-pointer"
              disabled={uploading || processing}
              asChild
            >
              <div>
                {uploading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : processing ? (
                  <Brain className="h-4 w-4 mr-2 animate-pulse" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                {uploading ? "Uploading..." : processing ? "Analyzing..." : "Upload Documents"}
              </div>
            </Button>
          </label>
        </div>
      </div>

      <DocumentList 
        documents={documents}
        processing={processing}
        onAnalyze={analyzeDocument}
      />
    </Card>
  );
};
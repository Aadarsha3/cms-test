import { useRef, ChangeEvent } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Download } from "lucide-react";
import { UserDetail } from "../../users";
import { useToast } from "@/hooks/use-toast";

interface UserDocumentsProps {
  user: UserDetail;
}

export function UserDocuments({ user }: UserDocumentsProps) {
  const { toast } = useToast();
  const documentInputRef = useRef<HTMLInputElement>(null);

  const triggerDocumentInput = () => {
    documentInputRef.current?.click();
  };

  const handleDocumentUpload = (e: ChangeEvent<HTMLInputElement>) => {
    toast({
      title: "Document upload not supported by backend yet.",
      variant: "default",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Documents</CardTitle>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={documentInputRef}
            className="hidden"
            onChange={handleDocumentUpload}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={triggerDocumentInput}
            className="gap-2"
            disabled={true}
          >
            <Upload className="h-3 w-3" /> Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {user.documents && user.documents.length > 0 ? (
            user.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="h-10 w-10 rounded bg-background flex items-center justify-center border shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.size} • {doc.uploadDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    disabled
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-md bg-muted/10">
              No documents available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

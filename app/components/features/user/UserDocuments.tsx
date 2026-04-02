import { useRef, ChangeEvent, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Download, Loader2 } from "lucide-react";
import { UserDetail } from "@/pages/sidebar/user/user.types";
import { useToast } from "@/hooks/use-toast";
import { userApi } from "@/lib/api";

interface UserDocumentsProps {
  user: UserDetail;
  isEditing?: boolean;
}

export function UserDocuments({ user, isEditing = false }: UserDocumentsProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const triggerDocumentInput = () => {
    documentInputRef.current?.click();
  };

  const handleDocumentUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user.id) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await userApi.post(`/users/${user.id}/documents`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Success",
        description: "Document uploaded successfully.",
      });

      // Note: Ideally, we should trigger a re-fetch of the user data here
      // But for now, we'll just indicate success.
    } catch (err: any) {
      console.error("Document upload failed:", err);
      toast({
        title: "Upload failed",
        description: err.response?.data?.detail || err.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (documentInputRef.current) documentInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Documents</CardTitle>
        {isEditing && (
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={documentInputRef}
              className="hidden"
              onChange={handleDocumentUpload}
              disabled={uploading}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={triggerDocumentInput}
              className="gap-2"
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Upload className="h-3 w-3" />
              )}
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        )}
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

import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";
import { useRef, ChangeEvent } from "react";
import { useToast } from "@/hooks/use-toast";

interface DocumentItem {
    id: string;
    name: string;
    type: string;
    size: string;
    uploadDate: string;
}

interface UserDocumentUploadProps {
    documents: DocumentItem[];
    setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
}

export function UserDocumentUpload({ documents, setDocuments }: UserDocumentUploadProps) {
    const newDocumentInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const triggerNewDocumentInput = () => {
        newDocumentInputRef.current?.click();
    };

    const handleNewDocumentUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const newDoc = {
                id: Date.now().toString(),
                name: file.name,
                type: file.type,
                size: (file.size / 1024 / 1024).toFixed(2) + " MB",
                uploadDate: new Date().toISOString().split('T')[0],
            };
            setDocuments(prev => [...prev, newDoc]);
            toast({ title: "Document added locally (upload not connected)" });
        }
    };

    const removeNewDocument = (docId: string) => {
        setDocuments(prev => prev.filter(d => d.id !== docId));
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Documents</h3>
                <div className="flex items-center gap-2">
                    <input
                        type="file"
                        ref={newDocumentInputRef}
                        className="hidden"
                        onChange={handleNewDocumentUpload}
                    />
                    <Button variant="outline" size="sm" onClick={triggerNewDocumentInput} className="gap-2">
                        <Upload className="h-3 w-3" />
                        Add Document
                    </Button>
                </div>
            </div>

            {documents.length > 0 && (
                <div className="space-y-2">
                    {documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium truncate">{doc.name}</p>
                                    <p className="text-xs text-muted-foreground">{doc.size} • {doc.type.split('/')[1]?.toUpperCase()}</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() => removeNewDocument(doc.id)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

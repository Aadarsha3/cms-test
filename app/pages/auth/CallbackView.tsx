import React from "react";
import { Loader2 } from "lucide-react";

export function CallbackView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h2 className="text-xl font-semibold">Authenticating…</h2>
      <p className="text-muted-foreground">Please wait while we log you in.</p>
    </div>
  );
}

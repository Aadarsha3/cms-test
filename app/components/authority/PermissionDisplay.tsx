import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Check, User, ExternalLink } from "lucide-react";
import { PERMISSION_GROUPS } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface PermissionDisplayProps {
  authorities: Record<string, string[]>;
  loading?: boolean;
  variant?: "compact" | "full";
  title?: string;
  manageUrl?: string;
  canManage?: boolean;
}

export function PermissionDisplay({
  authorities,
  loading,
  variant = "full",
  title,
  manageUrl,
  canManage = true,
}: PermissionDisplayProps) {
  const hasAuthorities = !loading && Object.values(authorities).some((perms) => perms.length > 0);

  const renderPermissionItem = (auth: string, colorClass: string, groupName?: string) => {
    const normalizedAuth = auth.replace(/^SCOPE_/, "");
    let permLabel = auth;
    
    if (groupName && normalizedAuth === groupName) {
      permLabel = "Full Access";
    } else {
      for (const group of PERMISSION_GROUPS) {
        const match = group.permissions.find((p) => p.id === normalizedAuth);
        if (match) {
          permLabel = match.name;
          break;
        }
      }
    }

    return (
      <div key={auth} className="flex items-start gap-2 text-sm group">
        <div className={`h-4.5 w-4.5 rounded-full ${colorClass} flex items-center justify-center shrink-0 mt-0.5 group-hover:opacity-80 transition-opacity`}>
          <Check className="h-2.5 w-2.5" />
        </div>
        <span className="font-medium text-[#1A2E56]/90 dark:text-slate-200 leading-tight">
          {permLabel}
        </span>
      </div>
    );
  };

  return (
    <Card className="border-none shadow-sm ring-1 ring-zinc-200/50 dark:ring-zinc-800/50 rounded-2xl overflow-hidden">
      {(title || manageUrl) && (
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 py-3.5 px-6 border-b border-[#243F76]/5 bg-zinc-50/50 dark:bg-zinc-900/10">
          <div className="flex items-center gap-2">
            <Shield className="h-4.5 w-4.5 text-primary" />
            {title && <CardTitle className="text-base font-bold text-[#1A2E56] dark:text-zinc-100">{title}</CardTitle>}
          </div>
          {manageUrl && canManage && (
            <Link href={manageUrl}>
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary hover:bg-primary/5 border border-primary/10 rounded-lg">
                <ExternalLink className="h-3 w-3" />
                Manage
              </Button>
            </Link>
          )}
        </CardHeader>
      )}

      <CardContent className="p-5 sm:p-6">
        {loading ? (
          /* Loading State: Skeletons */
          <div className="flex animate-pulse gap-2 flex-wrap pb-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-6 w-24 bg-muted/50 rounded-full"></div>
            ))}
          </div>
        ) : !hasAuthorities ? (
          /* Empty State: Informational Message */
          <div className="py-4 text-center">
            <p className="text-sm text-muted-foreground italic font-medium">No special permissions or authorities assigned.</p>
          </div>
        ) : variant === "compact" ? (
          /* Compact View: Pills/Tags */
          <div className="flex flex-wrap gap-2">
            {Object.values(authorities).flat().slice(0, 15).map((auth) => {
              const normalizedAuth = auth.replace(/^SCOPE_/, "");
              let permLabel = auth;
              for (const group of PERMISSION_GROUPS) {
                const match = group.permissions.find((p) => p.id === normalizedAuth);
                if (match) {
                  permLabel = match.name;
                  break;
                }
              }
              return (
                <div key={auth} className="px-2.5 py-1 bg-primary/5 text-primary border border-primary/10 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                  {permLabel}
                </div>
              );
            })}
            {Object.values(authorities).flat().length > 15 && (
              <div className="px-2.5 py-1 bg-muted/30 text-muted-foreground rounded-lg text-[10px] font-bold uppercase tracking-wider">
                +{Object.values(authorities).flat().length - 15} more
              </div>
            )}
          </div>
        ) : (
          /* Full View: Categorized List */
          <div className="space-y-6">
            {authorities["USER_AUTHORITY"]?.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
                  <User className="h-3 w-3" /> Individual Permissions
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2.5">
                  {authorities["USER_AUTHORITY"].map((auth) => 
                    renderPermissionItem(auth, "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400")
                  )}
                </div>
              </div>
            )}

            {Object.entries(authorities).map(([groupName, perms]) => {
              if (groupName === "USER_AUTHORITY" || perms.length === 0) return null;

              return (
                <div key={groupName} className="space-y-3 pt-5 border-t border-slate-100 dark:border-zinc-800/50 first:border-t-0 first:pt-0">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
                    <Shield className="h-3 w-3" /> {groupName}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2.5">
                    {perms.map((auth) => 
                      renderPermissionItem(auth, "bg-blue-500/10 text-blue-600 dark:text-blue-400", groupName)
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

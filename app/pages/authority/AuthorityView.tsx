import React from "react";
import {
  Shield,
  Search,
  User,
  Save,
  Loader2,
  Check,
  AlertCircle,
  ArrowRight,
  LayoutDashboard,
  Megaphone,
  GraduationCap,
  Users,
  BookOpen,
  UserCog,
  CalendarDays,
  ShieldAlert
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PERMISSION_GROUPS } from "@/lib/permissions";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, any> = {
  LayoutDashboard,
  Megaphone,
  GraduationCap,
  Users,
  BookOpen,
  UserCog,
  CalendarDays,
  User,
  ShieldAlert,
  Shield
};
interface AuthorityManagementViewProps {
  userId: string;
  setUserId: (id: string) => void;
  managedUserId: string | null;
  onFetch: () => void;
  isLoading: boolean;
  userAuthorities: string[];
  onTogglePermission: (permissionId: string) => void;
  onSave: () => void;
  isSaving: boolean;
  hasFetched: boolean;
  error: string | null;
}

export function AuthorityManagementView({
  userId,
  setUserId,
  managedUserId,
  onFetch,
  isLoading,
  userAuthorities,
  onTogglePermission,
  onSave,
  isSaving,
  hasFetched,
  error
}: AuthorityManagementViewProps) {
  return (
    <MainLayout title="Authority Management">
      <div className="max-w-[1200px] mx-auto space-y-6 pb-24">

        {/* Professional Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-primary">Permissions Control</h2>
            <p className="text-muted-foreground text-sm max-w-md">
              Assign or revoke granular authorities for system users by their unique identifier.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="User ID (UUID)..."
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="pl-9 h-11 bg-background border-primary/10 focus-visible:ring-primary/20 shadow-sm font-mono text-sm"
                onKeyDown={(e) => e.key === "Enter" && onFetch()}
              />
            </div>
            <Button
              onClick={onFetch}
              disabled={isLoading || !userId}
              className="h-11 px-6 shadow-md bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ArrowRight className="h-4 w-4 mr-2" />}
              Fetch User
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3 text-destructive shadow-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        {!hasFetched && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-muted rounded-3xl bg-muted/5 space-y-6">
            <div className="h-24 w-24 rounded-full bg-primary/5 flex items-center justify-center relative">
              <Search className="h-10 w-10 text-primary/40" />
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20 animate-[spin_10s_linear_infinite]"></div>
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-xl font-bold text-foreground/80 tracking-tight">Lookup Required</h3>
              <p className="text-muted-foreground text-sm max-w-[280px] mx-auto leading-relaxed">
                Enter a verified User ID in the search bar above to audit and manage assigned authorities.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* User Info Bar */}
            {!isLoading && (
              <div className="bg-card border rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Currently Managing</p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold bg-muted px-2 py-0.5 rounded leading-none">{managedUserId || userId}</span>
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/15 text-[10px] font-bold">
                        Connected
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block mr-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Selection Status</p>
                    <p className="text-sm font-bold">{userAuthorities.length} total permissions active</p>
                  </div>
                  <Button
                    onClick={onSave}
                    disabled={isSaving}
                    className="gap-2 px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 text-primary-foreground font-bold h-11 transition-all hover:scale-[1.02]"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Commit Changes
                  </Button>
                </div>
              </div>
            )}

            {/* Structured Grid of Permissions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
              <div className="lg:col-span-12 space-y-6">
                {PERMISSION_GROUPS.map((group) => {
                  const IconRef = ICON_MAP[group.icon] || Shield;
                  return (
                    <Card key={group.id} className="border border-border/60 shadow-sm overflow-hidden group/card hover:shadow-md transition-shadow">
                      <CardHeader className="bg-muted/30 py-4 border-b flex flex-row items-center justify-between space-y-0 text-card-foreground">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-background border flex items-center justify-center text-primary">
                            <IconRef className="h-4 w-4" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-bold text-primary">{group.name}</CardTitle>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[10px] bg-background">
                          {group.permissions.length} &nbsp; Permissions
                        </Badge>
                      </CardHeader>
                      <CardContent className="pt-6 pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                          {group.permissions.map((perm) => {
                            const isActive = userAuthorities.includes(perm.id);
                            return (
                              <div
                                key={perm.id}
                                onClick={() => onTogglePermission(perm.id)}
                                className={cn(
                                  "relative flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer select-none",
                                  isActive
                                    ? "bg-primary/5 border-primary/40 shadow-sm ring-1 ring-primary/5"
                                    : "bg-card hover:bg-muted/30 border-border hover:border-primary/20"
                                )}
                              >
                                <div className="flex items-start gap-4 min-w-0 pr-8 text-card-foreground">
                                  <div className={cn(
                                    "mt-0.5 h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 active:scale-90",
                                    isActive
                                      ? "bg-primary border-primary"
                                      : "border-muted-foreground/30 bg-background"
                                  )}>
                                    {isActive && <Check className="h-3.5 w-3.5 text-primary-foreground stroke-[3px]" />}
                                  </div>
                                  <div className="space-y-1 overflow-hidden">
                                    <p className={cn(
                                      "text-sm font-bold leading-none truncate",
                                      isActive ? "text-primary" : "text-foreground/80"
                                    )}>
                                      {perm.name}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground/80 line-clamp-1">
                                      {perm.description || `Capability: ${perm.id}`}
                                    </p>
                                  </div>
                                </div>

                                {isActive && (
                                  <Badge className="absolute top-2 right-2 bg-primary/10 text-primary border-0 hover:bg-primary/10 text-[8px] h-4 px-1 leading-none uppercase tracking-tighter">
                                    Enabled
                                  </Badge>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Summary Action Card */}
            <div className="p-8 border-2 border-dashed rounded-2xl bg-card flex flex-col items-center justify-center space-y-4 text-center">
              <div>
                <h4 className="font-bold text-lg text-foreground">Finalize Authorities</h4>
              </div>
              <Button
                onClick={onSave}
                disabled={isSaving}
                className="mt-4 gap-2 px-12 h-12 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 text-primary-foreground font-bold transition-all hover:scale-105 active:scale-95"
              >
                {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                Save Permission
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

import { useMemo, type ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, Fingerprint, Calendar, type LucideIcon } from "lucide-react";

export interface ProfileHeaderProps {
  displayName: string;
  roleLabel: string;
  roleColor?: string;
  username?: string;
  email?: string;
  userId?: string;
  createdDate?: string | null;
  isTerminated?: boolean;
  statusLabel?: string;
  statusColor?: string;
}

/** Small metadata row used in the header card (icon + text) */
interface MetaItemProps {
  icon: LucideIcon;
  children: ReactNode;
  mono?: boolean;
}

const MetaItem = ({ icon: Icon, children, mono }: MetaItemProps): React.JSX.Element => (
  <div className="flex items-center gap-2">
    <Icon className="h-4 w-4 shrink-0 opacity-70" />
    <span className={`truncate ${mono ? "font-mono text-xs" : ""}`}>
      {children}
    </span>
  </div>
);

export function ProfileHeader({
  displayName,
  roleLabel,
  roleColor = "bg-primary text-primary-foreground",
  username,
  email,
  userId,
  createdDate,
  isTerminated,
  statusLabel,
  statusColor = "bg-secondary text-secondary-foreground",
}: ProfileHeaderProps): React.JSX.Element {
  
  const initials = useMemo((): string => {
    if (!displayName) return "??";
    return displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [displayName]);

  return (
    <Card className="shadow-sm border-muted/20 overflow-hidden bg-card/40 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <Avatar className="h-24 w-24 ring-4 ring-background shadow-md">
            <AvatarFallback className="text-2xl font-bold bg-muted">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center sm:text-left space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <h2 className="text-2xl font-bold text-foreground/90">{displayName}</h2>
              <div className="flex gap-2">
                <Badge variant="secondary" className={`${roleColor} border-none uppercase text-[10px] py-0.5 px-2 font-black tracking-widest`}>
                    {roleLabel}
                </Badge>
                {statusLabel && (
                    <Badge variant="secondary" className={`${statusColor} border-none uppercase text-[10px] py-0.5 px-2 font-black tracking-widest`}>
                        {statusLabel}
                    </Badge>
                )}
                {isTerminated && (
                    <Badge variant="destructive" className="uppercase text-[10px] py-0.5 px-2 font-black tracking-widest">Terminated</Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-8 text-sm text-muted-foreground/80 font-medium">
              {username && <MetaItem icon={User}>@{username}</MetaItem>}
              {email && <MetaItem icon={Mail}>{email}</MetaItem>}
              {userId && <MetaItem icon={Fingerprint} mono>{userId}</MetaItem>}
              {createdDate && <MetaItem icon={Calendar}>Created {createdDate}</MetaItem>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


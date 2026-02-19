import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";
import { UserDetail, roleLabels, roleColors } from "../../user.types";

interface UserProfileCardProps {
  user: UserDetail;
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayRole = user.role || "member";
  const displayDepartment = user.department || "N/A";

  return (
    <Card>
      <CardContent className="pt-6 flex flex-col items-center gap-4">
        <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback className="text-4xl bg-muted">
            {getInitials(user.username || "User")}
          </AvatarFallback>
        </Avatar>
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <Badge className={roleColors[displayRole] || "bg-slate-500"}>
              {roleLabels[displayRole] || displayRole}
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="w-full space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{user.primaryEmail}</span>
          </div>
          {user.phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{user.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{displayDepartment}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Badge
              variant={user.status === "active" ? "secondary" : "outline"}
              className="ml-auto w-full justify-center"
            >
              {user.status === "active" ? "Active Account" : "Unknown Status"}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              Joined:{" "}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

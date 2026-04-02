import { useState } from "react";
import { User, Mail, Phone, Calendar } from "lucide-react";
import { MainLayout } from "@/components/core/layout/MainLayout";
import { InfoField } from "@/components/common/InfoField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChangePasswordDialog } from "@/components/features/ChangePasswordDialog";
import { useAuth } from "@/lib/auth-context";

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  staff: "Staff Member",
  student: "Student",
  teacher: "Teacher",
};

const roleColors: Record<string, string> = {
  super_admin: "bg-destructive text-destructive-foreground",
  admin: "bg-primary text-primary-foreground",
  staff: "bg-primary text-primary-foreground",
  student: "bg-primary text-primary-foreground",
  teacher: "bg-primary text-primary-foreground",
};

export function ProfilePage() {
  const { user } = useAuth();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <MainLayout title="Profile">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Profile Header Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="mt-2">
                  <Badge className={roleColors[user.role]}>{roleLabels[user.role]}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoField label="Full Name" value={user.name} icon={User} />
              <InfoField label="Email Address" value={user.email} icon={Mail} />
              <InfoField label="Phone Number" value={user.phone || "N/A"} icon={Phone} />
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoField label="Role" value={roleLabels[user.role]} icon={User} />
              <InfoField label="Member Since" value="September 2024" icon={Calendar} />
            </div>
          </CardContent>
        </Card>
      </div>

      <ChangePasswordDialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      />
    </MainLayout>
  );
}

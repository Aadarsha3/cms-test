import { useState, useRef, ChangeEvent } from "react";
import { Camera, Save, User, Mail, Phone, Building, Calendar } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChangePasswordDialog } from "@/components/features/auth/ChangePasswordDialog";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+1 555-0100",
    department: user?.department || "",
  });

  if (!user) return null;

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image size should be less than 5MB", variant: "destructive" });
      return;
    }

    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
    toast({ title: "Profile picture updated" });
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({ title: "Profile updated successfully" });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const InfoField = ({ label, value, icon: Icon, isEditable = false, fieldKey = "" }: any) => (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        {label}
      </Label>
      {isEditable && isEditing ? (
        <Input
          value={value}
          onChange={(e) => setFormData({ ...formData, [fieldKey]: e.target.value })}
        />
      ) : (
        <p className="text-sm font-medium py-2">{value}</p>
      )}
    </div>
  );

  return (
    <MainLayout title="Profile">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Profile Header Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl} alt={user.name} />
                  <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
                </Avatar>

                {user.role === "super_admin" && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute -bottom-2 -right-2 rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="mt-2">
                  <Badge className={roleColors[user.role]}>{roleLabels[user.role]}</Badge>
                </div>
              </div>

              {user.role === "super_admin" && (
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  className="gap-2"
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  ) : (
                    "Edit Profile"
                  )}
                </Button>
              )}
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
              <InfoField label="Full Name" value={formData.name} icon={User} isEditable fieldKey="name" />
              <InfoField label="Email Address" value={formData.email} icon={Mail} isEditable fieldKey="email" />
              <InfoField label="Phone Number" value={user.phone || formData.phone} icon={Phone} isEditable fieldKey="phone" />
              <InfoField label="Department" value={formData.department} icon={Building} />
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

        {isEditing && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        )}
      </div>

      <ChangePasswordDialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      />
    </MainLayout>
  );
}

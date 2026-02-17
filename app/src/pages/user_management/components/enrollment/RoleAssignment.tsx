import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, X } from "lucide-react";
import { ProfileFormData, roleLabels } from "../../users";
import { useRef, ChangeEvent } from "react";
import { useToast } from "@/hooks/use-toast";

interface RoleAssignmentProps {
  data: ProfileFormData;
  setData: (data: ProfileFormData) => void;
  userFullName: string;
  avatarUpload: string | null;
  setAvatarUpload: (url: string | null) => void;
  isSuperAdmin: boolean;
}

const mainRoleIds = ["admin", "staff", "student", "teacher"];

export function RoleAssignment({
  data,
  setData,
  userFullName,
  avatarUpload,
  setAvatarUpload,
  isSuperAdmin,
}: RoleAssignmentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      const url = URL.createObjectURL(file);
      setAvatarUpload(url);
      toast({ title: "Photo selected" });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
              <AvatarImage src={avatarUpload || ""} />
              <AvatarFallback className="text-4xl bg-muted">
                {userFullName.trim() ? (
                  getInitials(userFullName)
                ) : (
                  <Camera className="h-10 w-10 text-muted-foreground/50" />
                )}
              </AvatarFallback>
            </Avatar>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute bottom-0 right-0 rounded-full shadow-md"
              onClick={triggerFileInput}
            >
              <Upload className="h-4 w-4" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
          <div className="text-center">
            <h3 className="font-medium text-lg">{userFullName}</h3>
            <p className="text-sm text-muted-foreground">
              {roleLabels[data.role]}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Role Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="role">Primary Role</Label>
            <Select
              value={data.role}
              onValueChange={(v) => setData({ ...data, role: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                {isSuperAdmin && <SelectItem value="admin">Admin</SelectItem>}
                {isSuperAdmin && (
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Additional Sub-Roles</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {data.subRoles?.map((role) => (
                <Badge key={role} variant="secondary" className="gap-1 pr-1">
                  {roleLabels[role] || role}
                  <button
                    type="button"
                    className="hover:bg-destructive/10 hover:text-destructive rounded-full p-0.5"
                    onClick={() => {
                      setData({
                        ...data,
                        subRoles:
                          data.subRoles?.filter((r) => r !== role) || [],
                      });
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Select
              value=""
              onValueChange={(value) => {
                if (value && !data.subRoles?.includes(value)) {
                  setData({
                    ...data,
                    subRoles: [...(data.subRoles || []), value],
                  });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Add sub-role..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(roleLabels)
                  .filter(
                    ([id]) => !mainRoleIds.includes(id) && id !== "super_admin",
                  )
                  .map(([id, label]) => (
                    <SelectItem
                      key={id}
                      value={id}
                      disabled={data.subRoles?.includes(id)}
                    >
                      {label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

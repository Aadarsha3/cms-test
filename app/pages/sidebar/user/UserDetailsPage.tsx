import * as React from "react";
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/core/layout/MainLayout";
import { InfoField } from "@/components/common/InfoField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { userApi } from "@/lib/api";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Loader2,
  Save,
  User,
  Mail,
  Phone,
  Calendar,
  Hash,
  Activity,
  MapPin,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@/hooks/use-toast";

import { UserDocuments } from "@/components/features/user/UserDocuments";
import { UserDetail, roleLabels, roleColors } from "./user.types";



export function UserDetailsPage() {
  const { user: currentUser } = useAuth();
  const [, params] = useRoute("/users/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<UserDetail>>({});
  const [saving, setSaving] = useState(false);

  const userId = params?.id;
  const isSelf = currentUser?.id === userId;
  const canEdit = currentUser?.role === "admin";

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const response = await userApi.get<UserDetail>(`/users/${userId}`);
        setUser(response.data);
        setEditFormData(response.data);
      } catch (err: any) {
        console.error("Failed to fetch user details:", err);
        setError(err.message || "Failed to fetch user details");
        toast({
          title: "Error",
          description: "Could not load user details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, toast]);

  const goBack = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const from = searchParams.get("from");

    if (from && from !== "dashboard") {
      setLocation(`/${from}`);
      return;
    }

    if (!user) {
      setLocation("/dashboard");
      return;
    }
    const role = user.role?.toLowerCase();
    if (role === "student") setLocation("/students");
    else if (role === "teacher") setLocation("/teachers");
    else if (role && ["staff", "admin"].includes(role))
      setLocation("/staff");
    else setLocation("/dashboard");
  };

  const getBackLabel = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const from = searchParams.get("from");

    if (from === "students") return "Student Management";
    if (from === "teachers") return "Teacher Management";
    if (from === "staff") return "Staff Management";

    if (!user) return "Users";

    const role = user.role?.toLowerCase();
    if (role === "student") return "Student Management";
    if (role === "teacher") return "Teacher Management";
    if (role && ["staff", "admin"].includes(role))
      return "Staff Management";

    return "Users";
  };

  const handleDelete = async () => {
    if (!user || !user.id) return;
    if (
      confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      try {
        await userApi.delete(`/users/${user.id}`);
        toast({ title: "User deleted successfully" });
        goBack();
      } catch (err: any) {
        console.error("Failed to delete user:", err);
        toast({
          title: "Delete failed",
          description: err.message || "Could not delete user",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = () => {
    if (user) {
      setEditFormData(user);
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!userId || !editFormData) return;
    setSaving(true);
    try {
      await userApi.put(`/users/${userId}`, editFormData);
      setUser({ ...user, ...editFormData } as UserDetail);
      setIsEditing(false);
      toast({ title: "Success", description: "User details updated successfully." });
    } catch (err: any) {
      console.error("Failed to update user:", err);
      toast({
        title: "Update failed",
        description: err.response?.data?.detail || err.message || "Could not update user",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditFormData(user || {});
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getJoinedDate = () => {
    if (!user) return "N/A";

    // Check for createdDate array (e.g., [2024, 3, 19])
    const dateSource = (user as any).createdDate || user.createdAt;
    if (Array.isArray(dateSource) && dateSource.length >= 3) {
      return new Date(
        dateSource[0],
        dateSource[1] - 1,
        dateSource[2],
      ).toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    }

    if (user.createdTimestamp) {
      return new Date(user.createdTimestamp).toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    if (typeof user.createdAt === "string") {
      return new Date(user.createdAt).toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    return "N/A";
  };



  if (loading) {
    return (
      <MainLayout title="User Details">
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </MainLayout>
    );
  }

  if (error || !user) {
    return (
      <MainLayout title="User Details">
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
          <p className="text-muted-foreground">{error || "User not found"}</p>
          <Button onClick={goBack}>Back to {getBackLabel()}</Button>
        </div>
      </MainLayout>
    );
  }

  const displayRole = user.role || "member";

  return (
    <MainLayout title="User Details">
      <div className="max-w-4xl mx-auto space-y-6 pb-10">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to {getBackLabel()}
          </Button>

          {canEdit && !isSelf && (
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={saving}
                    className="gap-2"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEdit}
                    className="gap-2 shadow-sm"
                  >
                    <Edit className="h-4 w-4" /> Edit Profile
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    className="gap-2 shadow-sm"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Profile Header Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatarUrl} alt={user.username} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(user.username || "")}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-semibold">{user.username}</h2>
                <p className="text-muted-foreground">{user.primaryEmail}</p>
                <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                  <Badge className={roleColors[displayRole] || "bg-slate-500"}>
                    {roleLabels[displayRole] || displayRole}
                  </Badge>
                  <Badge
                    variant={user.status === "active" ? "secondary" : "outline"}
                  >
                    {user.status === "active" ? "Active Account" : "Unknown Status"}
                  </Badge>
                </div>
              </div>


            </div>
          </CardContent>
        </Card>

        {/* Personal Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoField
                label="Full Name"
                value={user.username}
                icon={User}
                isEditable
                isEditing={isEditing}
                fieldKey="username"
                editFormData={editFormData}
                setEditFormData={setEditFormData}
              />
              <InfoField
                label="Email Address"
                value={user.primaryEmail}
                icon={Mail}
                isEditable
                isEditing={isEditing}
                fieldKey="primaryEmail"
                editFormData={editFormData}
                setEditFormData={setEditFormData}
              />
              <InfoField
                label="Phone Number"
                value={user.phone}
                icon={Phone}
                isEditable
                isEditing={isEditing}
                fieldKey="phone"
                editFormData={editFormData}
                setEditFormData={setEditFormData}
              />
              {user.User_Id && (
                <InfoField
                  label="Internal ID"
                  value={user.User_Id}
                  icon={Hash}
                  isEditable
                  isEditing={isEditing}
                  fieldKey="User_Id"
                  editFormData={editFormData}
                  setEditFormData={setEditFormData}
                />
              )}
              {user.universityId && displayRole === "student" && (
                <InfoField
                  label="University ID"
                  value={user.universityId}
                  icon={Hash}
                  isEditable
                  isEditing={isEditing}
                  fieldKey="universityId"
                  editFormData={editFormData}
                  setEditFormData={setEditFormData}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoField
                label="System Role"
                value={roleLabels[displayRole] || displayRole}
                icon={User}
              />
              <InfoField
                label="Member Since"
                value={getJoinedDate()}
                icon={Calendar}
              />
              <InfoField
                label="Account Status"
                value={user.status}
                icon={Activity}
                isEditable
                isEditing={isEditing}
                fieldKey="status"
                editFormData={editFormData}
                setEditFormData={setEditFormData}
                options={[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <UserDocuments user={user} isEditing={isEditing} />
      </div>
    </MainLayout>
  );
}

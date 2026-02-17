import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { userApi } from "@/lib/api";
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@/hooks/use-toast";

import { UserProfileCard } from "./components/features/UserProfileCard";
import { UserPersonalInfo } from "./components/features/UserPersonalInfo";
import { UserDocuments } from "./components/features/UserDocuments";
import { UserDetail } from "./users";

export function UserDetailsPage() {
  const { user: currentUser } = useAuth();
  const [, params] = useRoute("/users/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = params?.id;
  const isSelf = currentUser?.id === userId;
  const canEdit =
    currentUser?.role === "super_admin" || currentUser?.role === "admin";

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const response = await userApi.get<UserDetail>(`/users/${userId}`);
        setUser(response.data);
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

  const handleDelete = async () => {
    if (!user) return;
    if (
      confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      try {
        await userApi.delete(`/users/${user.id}`);
        toast({ title: "User deleted successfully" });
        setLocation("/users");
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
      setLocation(`/users/${user.id}/edit`);
    }
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
          <Button onClick={() => setLocation("/users")}>Back to Users</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="User Details">
      <div className="max-w-4xl mx-auto space-y-6 pb-10">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/users")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Users
          </Button>
          {canEdit && !isSelf && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="gap-2"
              >
                <Edit className="h-4 w-4" /> Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          <UserProfileCard user={user} />

          <div className="space-y-6">
            <UserPersonalInfo user={user} />
            <UserDocuments user={user} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

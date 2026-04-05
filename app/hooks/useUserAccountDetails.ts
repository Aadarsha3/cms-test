import { useState, useEffect } from "react";
import { userApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { UserDetail } from "@/pages/users/user.types";

export function useUserAccountDetails(userId?: string) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<UserDetail>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const response = await userApi.get<UserDetail>(`/users/${userId}`);
        setUser(response.data);
        setEditFormData(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch user details");
        toast({ title: "Error", description: "Could not load user details.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, toast]);

  const handleDelete = async (onSuccess: () => void) => {
    if (!userId) return;
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await userApi.delete(`/users/${userId}`);
        toast({ title: "User deleted successfully" });
        onSuccess();
      } catch (err: any) {
        toast({ title: "Delete failed", description: err.message, variant: "destructive" });
      }
    }
  };

  const handleSave = async () => {
    if (!userId || !editFormData) return;
    setSaving(true);
    try {
      await userApi.put(`/users/${userId}`, editFormData);
      const updated = { ...user, ...editFormData } as UserDetail;
      setUser(updated);
      setIsEditing(false);
      toast({ title: "Success", description: "User details updated successfully." });
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return {
    user,
    loading,
    error,
    isEditing,
    setIsEditing,
    editFormData,
    setEditFormData,
    saving,
    handleDelete,
    handleSave,
    handleCancel: () => {
      setEditFormData(user || {});
      setIsEditing(false);
    },
    handleEdit: () => {
      setIsEditing(true);
    }
  };
}

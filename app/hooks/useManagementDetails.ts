import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { dashboardApi, userApi } from "@/lib/api";
import { fixDateArray } from "@/lib/utils";

interface UseManagementDetailsOptions<T> {
  entityType: "students" | "staffs";
  entityId?: string;
  onSuccessPath: string;
  editableFields: (keyof T)[];
  dateFields?: (keyof T)[];
  roleLabel?: string;
}


export function useManagementDetails<T extends { id: string; userId?: string; user?: string; fullName?: string; email?: string; primaryEmail?: string; username?: string; accountCreatedDate?: string; userAccountId?: string }>({
  entityType,
  entityId,
  onSuccessPath,
  editableFields,
  dateFields = [],
}: UseManagementDetailsOptions<T>) {
  const { toast } = useToast();
  const { user: authUser, setAuthUser } = useAuth();
  const [, setLocation] = useLocation();

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<T>>({});
  const [saving, setSaving] = useState(false);

  const fetchEntity = useCallback(async () => {
    if (!entityId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch domain data (student/staff)
      const res = await dashboardApi.get<T>(`/${entityType}/${entityId}`);
      const entity = res.data;

      // 2. Standardize dates
      for (const field of dateFields) {
        if (Array.isArray(entity[field])) {
          entity[field] = fixDateArray(entity[field]) as any;
        }
      }

      try {
        const lookupId = entity.userId || entity.user || entityId;
        const lookupEmail = entity.email || entity.primaryEmail;

        const allUsersRes = await userApi.get("/users", { params: { size: 500 } });
        const allUsers = Array.isArray(allUsersRes.data) ? allUsersRes.data : (allUsersRes.data as any)?.content || [];

        const matchedUser = allUsers.find((u: any) =>
          u.id === lookupId ||
          (u.primaryEmail && lookupEmail && u.primaryEmail.toLowerCase() === lookupEmail.toLowerCase())
        );

        if (matchedUser) {
          entity.username = matchedUser.username;
          entity.primaryEmail = matchedUser.primaryEmail;
          entity.userAccountId = matchedUser.id;
          entity.accountCreatedDate = fixDateArray(matchedUser.createdDate) || fixDateArray(matchedUser.createdAt) || "N/A";
        }
      } catch (e) {
        console.warn(`[DetailsHook] Failed to resolve account metadata`, e);
      }

      setData(entity);
      setEditFormData(entity);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || `Failed to fetch ${entityType} details`;
      setError(msg);
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [entityId, entityType, dateFields, toast]);

  useEffect(() => {
    fetchEntity();
  }, [fetchEntity]);

  const handleDelete = async () => {
    if (!entityId) return;
    if (confirm(`Are you sure you want to delete this record? This action cannot be undone.`)) {
      try {
        await dashboardApi.delete(`/${entityType}/${entityId}`, { data: {} });
        toast({ title: "Success", description: "Record deleted successfully" });
        setLocation(onSuccessPath);
      } catch (err: any) {
        toast({ title: "Delete failed", description: err.message, variant: "destructive" });
      }
    }
  };

  const handleSave = async () => {
    if (!entityId || !data) return;
    setSaving(true);
    try {
      const patchOps = editableFields.reduce((ops, field) => {
        if (editFormData[field] !== undefined && editFormData[field] !== data[field]) {
          ops.push({ op: "add", path: `/${String(field)}`, value: editFormData[field] });
        }
        return ops;
      }, [] as { op: string, path: string, value: any }[]);

      if (patchOps.length === 0) {
        setIsEditing(false);
        return;
      }

      const res = await dashboardApi.patch(`/${entityType}/${entityId}`, patchOps);
      const updated = res.data;

      if (entityType === "staffs") {
        const nameChange = patchOps.find(op => op.path === "/fullName");
        const emailChange = patchOps.find(op => op.path === "/email");

        if (nameChange || emailChange) {
          try {
            console.log(`[Sync] Updating User API (8001):`, { displayName: nameChange?.value, primaryEmail: emailChange?.value });

            const userRes = await userApi.get(`/users/${entityId}`);
            const updatedUser = { ...userRes.data };

            if (nameChange) updatedUser.displayName = nameChange.value;
            if (emailChange) updatedUser.primaryEmail = emailChange.value;

            await userApi.put(`/users/${entityId}`, updatedUser);
          } catch (userErrByPut: any) {
            console.warn("[Sync] API sync failed, relying on local session update:", userErrByPut);
          }
        }
      }

      if (authUser && (data.username === authUser.id || updated.username === authUser.id)) {
        const newName = (editFormData as any).fullName || (updated as any).fullName || authUser.name;
        const newEmail = (editFormData as any).email || (updated as any).email || authUser.email;

        if (newName !== authUser.name || newEmail !== authUser.email) {
          setAuthUser({
            ...authUser,
            name: newName,
            email: newEmail
          });
        }
      }

      for (const field of dateFields) {
        if (Array.isArray(updated[field])) {
          updated[field] = fixDateArray(updated[field]) as any;
        }
      }

      // Preserve local metadata not returned by dashboard
      if (!updated.username) updated.username = data.username;
      if (!updated.accountCreatedDate) updated.accountCreatedDate = data.accountCreatedDate;
      if (!updated.userAccountId) updated.userAccountId = data.userAccountId;

      setData(updated);
      setIsEditing(false);
      toast({ title: "Updated", description: "Details saved successfully" });
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return {
    data,
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
      setEditFormData(data || {});
      setIsEditing(false);
    },
    handleEdit: () => {
      setIsEditing(true);
    },
    goBack: () => setLocation(onSuccessPath)
  };
}

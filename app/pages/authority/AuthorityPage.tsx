import { useState, useCallback, useEffect } from "react";
import { userApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AuthorityManagementView } from "./AuthorityView";
import { logError, extractErrorMessage } from "@/lib/error-handler";

export function AuthorityManagementPage() {
  const { toast } = useToast();
  const [userId, setUserId] = useState("");
  const [managedUserId, setManagedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [userAuthorities, setUserAuthorities] = useState<string[]>([]);
  const [originalAuthorities, setOriginalAuthorities] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  const onFetch = useCallback(async () => {
    if (!userId.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setHasFetched(false);
    
    try {
      const response = await userApi.get(`/users/${userId.trim()}/authorities`);
      const authorities = (response.data as any[]).map(a => a.authority);
      setUserAuthorities(authorities);
      setOriginalAuthorities(authorities);
      setManagedUserId(userId.trim());
      setHasFetched(true);
    } catch (err: any) {
      logError("FetchUserAuthorities", err);
      const msg = extractErrorMessage(err, "User not found or API error.");
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get("uid");
    if (uid && !initialFetchDone) {
      setUserId(uid);
      setInitialFetchDone(true);
    }
  }, [initialFetchDone]);

  // Trigger fetch if userId was set from URL and hasn't been fetched yet
  useEffect(() => {
    if (initialFetchDone && userId && !hasFetched && !isLoading) {
      onFetch();
    }
  }, [initialFetchDone, userId, hasFetched, isLoading, onFetch]);

  const onTogglePermission = useCallback((permissionId: string) => {
    setUserAuthorities((prev) => 
      prev.includes(permissionId) 
        ? prev.filter(id => id !== permissionId) 
        : [...prev, permissionId]
    );
  }, []);

  const onSave = useCallback(async () => {
    if (!userId.trim()) return;
    
    setIsSaving(true);
    try {
      const added = userAuthorities.filter(a => !originalAuthorities.includes(a));
      const removed = originalAuthorities.filter(a => !userAuthorities.includes(a));
      
      // Process removals
      for (const auth of removed) {
        await userApi.delete(`/users/${userId.trim()}/authorities`, { data: { authority: auth } });
      }

      // Process additions
      for (const auth of added) {
        await userApi.post(`/users/${userId.trim()}/authorities`, { authority: auth });
      }

      setOriginalAuthorities([...userAuthorities]);
      toast({
        title: "Success",
        description: added.length === 0 && removed.length === 0 
          ? "Permissions are already up to date."
          : `Successfully updated ${added.length + removed.length} permissions.`,
      });
    } catch (err: any) {
      logError("UpdateUserAuthorities", err);
      toast({
        title: "Update Failed",
        description: extractErrorMessage(err, "Could not synchronize some permissions."),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [userId, userAuthorities, originalAuthorities, toast]);

  return (
    <AuthorityManagementView
      userId={userId}
      setUserId={setUserId}
      managedUserId={managedUserId}
      onFetch={onFetch}
      isLoading={isLoading}
      userAuthorities={userAuthorities}
      onTogglePermission={onTogglePermission}
      onSave={onSave}
      isSaving={isSaving}
      hasFetched={hasFetched}
      error={error}
    />
  );
}

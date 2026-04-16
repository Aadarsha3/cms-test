import React from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Shield, ExternalLink } from "lucide-react";
import { PermissionDisplay } from "@/components/authority/PermissionDisplay";
import { userApi } from "@/lib/api";
import { useManagementDetails } from "@/hooks/useManagementDetails";
import { StaffDetail } from "@/pages/users/user.types";
import { DetailsLoading } from "@/components/common/details/DetailsLoading";
import { DetailsError } from "@/components/common/details/DetailsError";
import { useAuth } from "@/lib/auth-context";

export function StaffPermissionsPage() {
  const { id: staffId } = useParams();
  const [, setLocation] = useLocation();
  const { hasPermission: checkPermission } = useAuth();

  const {
    data: staff,
    loading: loadingStaff,
    error,
  } = useManagementDetails<StaffDetail>({
    entityType: "staffs",
    entityId: staffId,
    onSuccessPath: "/staff",
    editableFields: [],
  });

  const uid = staff?.userAccountId || staff?.userId;

  const { data: authorities = {}, isLoading: queryLoading } = useQuery({
    queryKey: ["staffAuthorities", uid],
    queryFn: async () => {
      if (!uid) return {};
      const response = await userApi.get(`/users/${uid}/authorities/all`);
      return response.data.authorities || {};
    },
    enabled: !!uid,
  });

  const loadingAuthorities = !!uid && queryLoading;

  if (loadingStaff) return <DetailsLoading title="Staff Permissions" />;
  if (error || !staff) {
    return (
      <DetailsError
        title="Staff Permissions"
        error={error || "Staff member not found"}
        backLabel="Go Back"
        onBack={() => setLocation(`/staff/${staffId}`)}
      />
    );
  }

  return (
    <MainLayout title="Staff Permissions">
      <div className="max-w-5xl mx-auto space-y-6 pb-10">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => setLocation(`/staff/${staffId}`)}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Profile
          </Button>

          {checkPermission("access_control_manage") && (
            <Link href={`/authority?uid=${staff.userAccountId || staff.id}`}>
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Manage Raw Authorities
              </Button>
            </Link>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight text-[#1A2E56] dark:text-white">
            Permissions & Access
          </h2>
          <p className="text-muted-foreground">
            Reviewing access levels for <span className="font-semibold text-foreground">{staff.fullName}</span>
          </p>
        </div>

        <PermissionDisplay
          authorities={authorities}
          loading={loadingAuthorities}
          variant="full"
        />
      </div>
    </MainLayout>
  );
}

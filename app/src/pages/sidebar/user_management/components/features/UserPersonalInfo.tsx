import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserDetail } from "../../user.types";
interface UserPersonalInfoProps {
  user: UserDetail;
}

export function UserPersonalInfo({ user }: UserPersonalInfoProps) {
  const displayRole = user.role || "member";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">User ID</p>
            <p className="text-base font-mono">{user.id}</p>
          </div>
          {user.User_Id && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Internal ID
              </p>
              <p className="text-base">{user.User_Id}</p>
            </div>
          )}
        </div>

        {displayRole === "student" && (
          <>
            <Separator />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {user.universityId && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    University ID
                  </p>
                  <p className="text-base">{user.universityId}</p>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

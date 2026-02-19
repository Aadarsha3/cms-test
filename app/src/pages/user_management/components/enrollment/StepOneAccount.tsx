import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { AccountFormData } from "../../user.types";
import { useState } from "react";

interface StepOneAccountProps {
  data: AccountFormData;
  setData: (data: AccountFormData) => void;
  editingUserId: string | null;
}

export function StepOneAccount({
  data,
  setData,
  editingUserId,
}: StepOneAccountProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            First Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="firstName"
            value={data.firstName}
            onChange={(e) => {
              const v = e.target.value;
              setData({ ...data, firstName: v.charAt(0).toUpperCase() + v.slice(1) });
            }}
            placeholder="e.g. John"
            autoComplete="given-name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">
            Last Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="lastName"
            value={data.lastName}
            onChange={(e) => {
              const v = e.target.value;
              setData({ ...data, lastName: v.charAt(0).toUpperCase() + v.slice(1) });
            }}
            placeholder="e.g. Smith"
            autoComplete="family-name"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="enroll-user-id">
            User ID (Username) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="enroll-user-id"
            value={data.userId}
            onChange={(e) => setData({ ...data, userId: e.target.value })}
            placeholder="e.g. COL2024001"
            autoComplete="username"
          />
          <p className="text-[10px] text-muted-foreground">
            Unique identifier for system login.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="enroll-user-email">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="enroll-user-email"
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            placeholder="e.g. john.smith@college.edu"
            autoComplete="email"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="enroll-user-password">
          Password{" "}
          {editingUserId ? (
            "(Leave blank to keep current)"
          ) : (
            <span className="text-destructive">*</span>
          )}
        </Label>
        <div className="relative flex items-center max-w-md">
          <Input
            id="enroll-user-password"
            type={showPassword ? "text" : "password"}
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            placeholder="Create a strong password (min 6 chars)"
            className="pr-10"
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

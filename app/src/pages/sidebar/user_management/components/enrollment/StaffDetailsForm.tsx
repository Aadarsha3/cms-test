// /app/src/pages/sidebar/user_management/components/enrollment/StaffDetailsForm.tsx

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ProfileFormData, StudentFormData, roleLabels } from "../../user.types";

interface StaffDetailsFormProps {
  data: ProfileFormData;
  setData: (data: ProfileFormData) => void;
  studentData: StudentFormData;
  setStudentData: (data: StudentFormData) => void;
  isAdmin: boolean;
  isEditing?: boolean;
}

export function StaffDetailsForm({
  data,
  setData,
  studentData,
  setStudentData,
  isAdmin,
  isEditing,
}: StaffDetailsFormProps) {
  const roleLabel = roleLabels[data.role] || "User";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{roleLabel} Details</CardTitle>
        <CardDescription>Enter additional profile information for the {roleLabel.toLowerCase()}.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={studentData.dateOfBirth}
              onChange={(e) =>
                setStudentData({ ...studentData, dateOfBirth: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={studentData.gender}
              onValueChange={(v) => setStudentData({ ...studentData, gender: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="enroll-user-phone">
              Phone <span className="text-destructive">*</span>
            </Label>
            <Input
              id="enroll-user-phone"
              value={data.phone}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
              placeholder="e.g., +1 555-0100"
              autoComplete="tel"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="presentAddress">Present Address</Label>
            <Input
              id="presentAddress"
              value={studentData.presentAddress}
              onChange={(e) =>
                setStudentData({ ...studentData, presentAddress: e.target.value })
              }
              placeholder="e.g., 123 Main St, Springfield"
            />
          </div>
          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={data.status}
                onValueChange={(v) =>
                  setData({ ...data, status: v as "active" | "inactive" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

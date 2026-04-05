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
import { ProfileFormData, StudentFormData, AccountFormData, roleLabels } from "@/pages/users/user.types";
import { DatePickerField } from "@/components/common/DatePickerField";
import { PhoneInputField } from "@/components/common/PhoneInputField";
import { User, Calendar, MapPin } from "lucide-react";

export interface StaffDetailsFormProps {
  data: ProfileFormData;
  setData: (data: ProfileFormData) => void;
  studentData: StudentFormData;
  setStudentData: (data: StudentFormData) => void;
  accountData: AccountFormData;
  setAccountData: (data: AccountFormData) => void;
  isAdmin: boolean;
  isEditing?: boolean;
}

type Gender = "male" | "female" | "other";

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const STATUS_OPTIONS: { value: "active" | "inactive"; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export function StaffDetailsForm({
  data,
  setData,
  studentData,
  setStudentData,
  accountData,
  setAccountData,
  isEditing,
}: StaffDetailsFormProps): React.JSX.Element {
  const roleLabel = roleLabels[data.role] || "User";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{roleLabel} Details</CardTitle>
        <CardDescription>Enter additional profile information for the {roleLabel.toLowerCase()}.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <DatePickerField
            id="staff-dob"
            label="Date of Birth"
            value={studentData.dateOfBirth || ""}
            onChange={(date) => setStudentData({ ...studentData, dateOfBirth: date })}
            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
            required
          />
          <DatePickerField
            id="staff-join-date"
            label="Join Date"
            value={accountData.joinDate || ""}
            onChange={(date) => setAccountData({ ...accountData, joinDate: date })}
            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
            required
          />
          <div className="space-y-2">
            <Label htmlFor="gender" className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Gender <span className="text-destructive">*</span>
            </Label>
            <Select
              name="gender"
              value={studentData.gender}
              onValueChange={(v: Gender) => setStudentData({ ...studentData, gender: v })}
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {GENDER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <PhoneInputField
            id="enroll-user-phone"
            label="Phone"
            required
            value={data.phone}
            onChange={(v) => setData({ ...data, phone: v })}
          />
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="presentAddress" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Present Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="presentAddress"
              name="presentAddress"
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
                name="status"
                value={data.status}
                onValueChange={(v: "active" | "inactive") =>
                  setData({ ...data, status: v })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


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
import { ProfileFormData, StudentFormData, AccountFormData } from "@/pages/users/user.types";
import { DatePickerField } from "@/components/common/DatePickerField";
import { PhoneInputField } from "@/components/common/PhoneInputField";
import { User, Calendar, Heart, MapPin } from "lucide-react";

export interface ProfileDetailsFormProps {
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

export function ProfileDetailsForm({
  data,
  setData,
  studentData,
  setStudentData,
  isAdmin,
  isEditing,
}: ProfileDetailsFormProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Details</CardTitle>
        <CardDescription>Enter additional profile information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <DatePickerField
            id="student-dob"
            label="Date of Birth"
            value={studentData.dateOfBirth || ""}
            onChange={(date) => setStudentData({ ...studentData, dateOfBirth: date })}
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

          {/* Guardian Information */}
          <div className="md:col-span-2 pt-4">
            <h4 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Guardian Information</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guardianName" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Guardian Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="guardianName"
                  name="guardianName"
                  value={studentData.guardianName}
                  onChange={(e) =>
                    setStudentData({ ...studentData, guardianName: e.target.value })
                  }
                  placeholder="e.g., Robert Smith"
                />
              </div>
              <PhoneInputField
                id="guardianPhoneNumber"
                label="Guardian Contact"
                required
                value={studentData.guardianPhoneNumber}
                onChange={(v) => setStudentData({ ...studentData, guardianPhoneNumber: v })}
              />
              <div className="space-y-2">
                <Label htmlFor="guardianRelation" className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  Relationship <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="guardianRelation"
                  name="guardianRelation"
                  value={studentData.guardianRelation}
                  onChange={(e) =>
                    setStudentData({ ...studentData, guardianRelation: e.target.value })
                  }
                  placeholder="e.g., Father"
                />
              </div>
            </div>
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


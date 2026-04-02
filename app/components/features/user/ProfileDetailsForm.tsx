// /app/src/pages/sidebar/user_management/components/enrollment/ProfileDetailsForm.tsx

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
import { ProfileFormData, StudentFormData } from "@/pages/sidebar/user/user.types";
import { Calendar as CalendarIcon } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";


interface ProfileDetailsFormProps {
  data: ProfileFormData;
  setData: (data: ProfileFormData) => void;
  studentData: StudentFormData;
  setStudentData: (data: StudentFormData) => void;
  isAdmin: boolean;
  isEditing?: boolean;
}

export function ProfileDetailsForm({
  data,
  setData,
  studentData,
  setStudentData,
  isAdmin,
  isEditing,
}: ProfileDetailsFormProps) {
  const { theme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Details</CardTitle>
        <CardDescription>Enter additional profile information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Popover>
              <div className="relative">
                <Input
                  id="dateOfBirth"
                  placeholder="yyyy/mm/dd"
                  value={studentData.dateOfBirth || ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    let formatted = value;
                    if (value.length > 4) {
                      formatted = `${value.slice(0, 4)}/${value.slice(4)}`;
                    }
                    if (value.length > 6) {
                      formatted = `${value.slice(0, 4)}/${value.slice(4, 6)}/${value.slice(6, 8)}`;
                    }
                    setStudentData({ ...studentData, dateOfBirth: formatted });
                  }}
                  maxLength={10}
                  className="pr-10 w-full"
                />
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                    aria-label="Open calendar"
                  >
                    <CalendarIcon
                      className="h-4 w-4 text-muted-foreground"
                      color={theme === "dark" ? "#ffffff" : undefined}
                    />
                  </button>
                </PopoverTrigger>
              </div>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    studentData.dateOfBirth && !isNaN(Date.parse(studentData.dateOfBirth))
                      ? new Date(studentData.dateOfBirth)
                      : undefined
                  }
                  onSelect={(date) =>
                    setStudentData({
                      ...studentData,
                      dateOfBirth: date ? date.toISOString().split('T')[0] : ""
                    })
                  }
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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

          {/* Guardian Information */}
          <div className="md:col-span-2 pt-4">
            <h4 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Guardian Information</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guardianName">Guardian Name</Label>
                <Input
                  id="guardianName"
                  value={studentData.guardianName}
                  onChange={(e) =>
                    setStudentData({ ...studentData, guardianName: e.target.value })
                  }
                  placeholder="e.g., Robert Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardianPhoneNumber">Guardian Contact</Label>
                <Input
                  id="guardianPhoneNumber"
                  value={studentData.guardianPhoneNumber}
                  onChange={(e) =>
                    setStudentData({ ...studentData, guardianPhoneNumber: e.target.value })
                  }
                  placeholder="e.g., +1 555-0100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardianRelation">Relationship</Label>
                <Input
                  id="guardianRelation"
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

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
import { ProfileFormData } from "../../users";

interface ProfileDetailsFormProps {
  data: ProfileFormData;
  setData: (data: ProfileFormData) => void;
  isAdmin: boolean;
  userDepartment?: string;
}

const departments = [
  "Administration",
  "Computer Science",
  "Business Administration",
  "Mechanical Engineering",
  "Physics",
  "Mathematics",
];

export function ProfileDetailsForm({
  data,
  setData,
  isAdmin,
  userDepartment,
}: ProfileDetailsFormProps) {
  const displayDepartment = isAdmin ? userDepartment : data.department;

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>Enter additional profile information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="department">
              Department <span className="text-destructive">*</span>
            </Label>
            <Select
              value={displayDepartment}
              onValueChange={(v) => setData({ ...data, department: v })}
              disabled={isAdmin}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments
                  .filter(
                    (d) =>
                      data.role === "super_admin" || d !== "Administration",
                  )
                  .map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
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
        </div>
      </CardContent>
    </Card>
  );
}

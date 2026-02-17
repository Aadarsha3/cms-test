import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { StudentFormData } from "../../users";

interface StudentAcademicFormProps {
  data: StudentFormData;
  setData: (data: StudentFormData) => void;
}

const classes = [
  "BCS Year 1",
  "BCS Year 2",
  "BCS Year 3",
  "BCS Year 4",
  "MBA Year 1",
  "MBA Year 2",
  "BME Year 1",
  "BME Year 2",
  "BME Year 3",
  "BME Year 4",
];

const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

export function StudentAcademicForm({
  data,
  setData,
}: StudentAcademicFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Student Academic Details
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="enroll-university-id">University ID</Label>
            <Input
              id="enroll-university-id"
              value={data.universityId}
              onChange={(e) =>
                setData({ ...data, universityId: e.target.value })
              }
              placeholder="e.g., UNI2024001"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={data.dateOfBirth}
              onChange={(e) =>
                setData({ ...data, dateOfBirth: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={data.gender}
              onValueChange={(v) => setData({ ...data, gender: v })}
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
            <Label htmlFor="currentClass">Class</Label>
            <Select
              value={data.currentClass}
              onValueChange={(v) => setData({ ...data, currentClass: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="semester">Semester</Label>
            <Select
              value={data.semester}
              onValueChange={(v) => setData({ ...data, semester: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((s) => (
                  <SelectItem key={s} value={s}>
                    Semester {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Guardian Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guardianName">Guardian Name</Label>
            <Input
              id="guardianName"
              value={data.guardianName}
              onChange={(e) =>
                setData({ ...data, guardianName: e.target.value })
              }
              placeholder="e.g., Robert Smith"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianContact">Guardian Contact</Label>
            <Input
              id="guardianContact"
              value={data.guardianContact}
              onChange={(e) =>
                setData({ ...data, guardianContact: e.target.value })
              }
              placeholder="e.g., +1 555-0100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianRelationship">Relationship</Label>
            <Input
              id="guardianRelationship"
              value={data.guardianRelationship}
              onChange={(e) =>
                setData({ ...data, guardianRelationship: e.target.value })
              }
              placeholder="e.g., Father"
            />
          </div>
        </div>
      </div>
      <Separator />
    </div>
  );
}

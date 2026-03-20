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
import { StudentFormData } from "../../user.types";

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
    </div>
  );
}

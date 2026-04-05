import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROGRAM_DURATIONS, PROGRAM_TYPES } from "@/lib/constants";

interface ProgramFormData {
  name: string;
  code: string;
  type: string;
  duration: string;
}

interface ProgramFormProps {
  data: ProgramFormData;
  onChange: (field: keyof ProgramFormData, value: string) => void;
  isLoading?: boolean;
}

export function ProgramForm({
  data,
  onChange,
  isLoading = false,
}: ProgramFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="program-name">
            Program Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="program-name"
            placeholder="e.g. Computer Science"
            value={data.name}
            onChange={(e) => onChange("name", e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="program-code">
            Program Code <span className="text-destructive">*</span>
          </Label>
          <Input
            id="program-code"
            placeholder="e.g. CS101"
            value={data.code}
            onChange={(e) => onChange("code", e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="program-type">
            Program Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={data.type}
            onValueChange={(v) => onChange("type", v)}
            disabled={isLoading}
          >
            <SelectTrigger id="program-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {PROGRAM_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="program-duration">
            Program Duration <span className="text-destructive">*</span>
          </Label>
          <Select
            value={data.duration}
            onValueChange={(v) => onChange("duration", v)}
            disabled={isLoading}
          >
            <SelectTrigger id="program-duration">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {PROGRAM_DURATIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

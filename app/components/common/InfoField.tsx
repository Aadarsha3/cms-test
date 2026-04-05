import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LucideIcon } from "lucide-react";

export interface InfoFieldProps {
  label: string;
  value: any;
  icon?: LucideIcon | any;
  isEditable?: boolean;
  isEditing?: boolean;
  fieldKey?: string;
  editFormData?: any;
  setEditFormData?: (data: any) => void;
  options?: { label: string; value: string }[];
  inputType?: string;
  numericOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement> | string) => void;
}

export const InfoField = ({
  label,
  value,
  icon: Icon,
  isEditable = false,
  isEditing = false,
  fieldKey = "",
  editFormData,
  setEditFormData,
  options,
  inputType = "text",
  numericOnly = false,
  onChange,
}: InfoFieldProps) => {
  const currentValue = editFormData && fieldKey && editFormData[fieldKey] !== undefined 
    ? editFormData[fieldKey] 
    : value;

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldKey} className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        {label}
      </Label>
      {isEditable && isEditing ? (
        options ? (
          <Select
            name={fieldKey}
            value={currentValue as string || ""}
            onValueChange={(val) => {
              if (onChange) {
                (onChange as any)(val);
              } else if (setEditFormData && editFormData && fieldKey) {
                setEditFormData({ ...editFormData, [fieldKey]: val });
              }
            }}
          >
            <SelectTrigger id={fieldKey} className="h-9">
              <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            id={fieldKey}
            name={fieldKey}
            type={inputType}
            className="h-9"
            value={currentValue as string || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (numericOnly) {
                e.target.value = e.target.value.replace(/\D/g, "");
              }
              if (onChange) {
                (onChange as any)(e);
              } else if (setEditFormData && editFormData && fieldKey) {
                setEditFormData({ ...editFormData, [fieldKey]: e.target.value });
              }
            }}
          />
        )
      ) : (
        <p className="text-sm font-medium py-2 break-all">{value || "N/A"}</p>
      )}
    </div>
  );
};

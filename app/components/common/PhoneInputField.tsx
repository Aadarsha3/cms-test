import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Phone } from "lucide-react";

interface PhoneInputFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    id?: string;
    required?: boolean;
    placeholder?: string;
    autoComplete?: string;
    disabled?: boolean;
}

export function PhoneInputField({
    label,
    value,
    onChange,
    id,
    required,
    placeholder = "e.g., 98XXXXXXXX",
    autoComplete = "tel",
    disabled = false,
}: PhoneInputFieldProps) {
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow digits and limit to 10
        const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
        onChange(digits);
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {label} {required && <span className="text-destructive">*</span>}
            </Label>
            {disabled ? (
                <p className="text-sm font-medium py-2 break-all">{value || "N/A"}</p>
            ) : (
                <Input
                    id={id}
                    type="tel"
                    value={value}
                    onChange={handlePhoneChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    maxLength={10}
                    className="w-full h-9"
                />
            )}
        </div>
    );
}

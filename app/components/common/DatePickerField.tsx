import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DatePickerFieldProps {
    label: string;
    value: string;
    onChange: (date: string) => void;
    id?: string;
    required?: boolean;
    placeholder?: string;
    disabled?: boolean;
    icon?: React.ReactNode;
}

export function DatePickerField({
    label,
    value,
    onChange,
    id,
    required,
    placeholder = "yyyy-mm-dd",
    disabled,
    icon,
}: DatePickerFieldProps) {
    const [inputValue, setInputValue] = React.useState(value || "");

    React.useEffect(() => {
        setInputValue(value || "");
    }, [value]);

    const handleInputManual = (val: string) => {
        if (!val) {
            setInputValue("");
            onChange("");
            return;
        }

        const digits = val.replace(/\D/g, "");
        let formatted = digits;
        if (digits.length > 4) formatted = `${digits.slice(0, 4)}-${digits.slice(4)}`;
        if (digits.length > 6) formatted = `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;

        setInputValue(formatted);
        if (formatted.length === 10 && !isNaN(Date.parse(formatted))) {
            onChange(formatted);
        }
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="flex items-center gap-2">
                {icon}
                {label} {required && <span className="text-destructive">*</span>}
            </Label>
            {disabled ? (
                <p className="text-sm font-medium py-2">{value || "N/A"}</p>
            ) : (
                <div className="flex gap-2">
                    <Popover>
                        <div className="relative flex-1">
                            <Input
                                id={id}
                                name={id}
                                placeholder={placeholder}
                                value={inputValue}
                                onChange={(e) => handleInputManual(e.target.value)}
                                maxLength={10}
                                className="pr-10 w-full h-9"
                            />
                            <PopoverTrigger asChild>
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                                    aria-label="Open calendar"
                                >
                                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                </button>
                            </PopoverTrigger>
                        </div>
                        <PopoverContent className="w-auto p-0" align="start">
                            <div className="p-3 border-b flex items-center justify-between">
                                <span className="text-xs font-medium text-muted-foreground">Select date</span>
                                {value && (
                                    <button
                                        type="button"
                                        onClick={() => onChange("")}
                                        className="text-xs text-destructive hover:underline"
                                    >
                                        Clear date
                                    </button>
                                )}
                            </div>
                            <Calendar
                                mode="single"
                                selected={value && !isNaN(Date.parse(value)) ? new Date(value) : undefined}
                                onSelect={(date) => {
                                    if (date) {
                                        const formattedDate = format(date, "yyyy-MM-dd");
                                        onChange(formattedDate);
                                    } else {
                                        onChange("");
                                    }
                                }}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                            />
                        </PopoverContent>

                    </Popover>
                </div>
            )}
        </div>
    );
}

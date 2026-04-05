import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Converts Spring Boot LocalDate arrays like [2026, 4, 4] to "2026-04-04"
export function fixDateArray(value: any): string | null {
  if (Array.isArray(value)) {
    const [y, m, d] = value;
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }
  return typeof value === "string" ? value : null;
}

// Fix all known date fields on a data object in-place
export function fixDates(data: any, fields: string[]) {
  if (!data) return;
  for (const f of fields) {
    if (data[f] != null) {
      data[f] = fixDateArray(data[f]) ?? data[f];
    }
  }
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  code?: string;
  details?: Record<string, any>;
}

/**
 * Extracts a readable error message from various error formats.
 */
export function extractErrorMessage(
  err: any,
  defaultMsg: string = "An error occurred"
): string {
  if (typeof err === "string") return err;
  if (!err) return defaultMsg;

  const apiError = err.response?.data as ApiErrorResponse | undefined;
  if (apiError?.message && typeof apiError.message === "string") {
    return apiError.message;
  }
  if (apiError?.error && typeof apiError.error === "string") {
    return apiError.error;
  }

  if (err.message && typeof err.message === "string") {
    return err.message;
  }

  return defaultMsg;
}

/**
 * Logs structured error details for debugging.
 */
export function logError(context: string, err: any) {
  console.error(`[${context}]`, {
    message: err?.message,
    status: err?.response?.status,
    data: err?.response?.data,
    stack: err?.stack,
  });
}

/**
 * Validates required fields and returns an error message if any are empty.
 */
export function validateRequiredFields(fields: Record<string, any>): string | null {
  const emptyFields = Object.entries(fields)
    .filter(([, value]) => !value || (typeof value === "string" && value.trim() === ""))
    .map(([key]) => key);

  if (emptyFields.length > 0) {
    return `Please fill in all required fields: ${emptyFields.join(", ")}`;
  }

  return null;
}

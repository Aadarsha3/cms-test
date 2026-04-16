export interface ApiErrorResponse {
  message?: string;
  error?: string;
  code?: string;
  details?: Record<string, any>;
}

export function extractErrorMessage(
  err: any,
  defaultMsg: string = "An error occurred",
  duplicateMsg?: string
): string {
  if (typeof err === "string") return err;
  if (!err) return defaultMsg;

  const apiData = err.response?.data;
  const searchableText = apiData ? (typeof apiData === 'string' ? apiData : JSON.stringify(apiData)).toLowerCase() : "";

  if (searchableText.includes("duplicate") || searchableText.includes("already exists") || searchableText.includes("unique")) {
    return duplicateMsg || "This information already exists.";
  }

  if (apiData && typeof apiData === 'object') {
    const apiError = apiData as ApiErrorResponse;
    const explicitMsg = apiError.message || apiError.error;
    if (explicitMsg && typeof explicitMsg === 'string' && !explicitMsg.toLowerCase().includes("internal server error")) {
      return explicitMsg;
    }
  }

  const status = err.response?.status;
  if (status) {
    switch (status) {
      case 400: return "Invalid information. Please check and try again.";
      case 401: return "Session expired. Please log in again.";
      case 403: return "Access denied.";
      case 404: return "Record not found.";
      case 409: return duplicateMsg || "This code or ID is already in use.";
      case 500:
        return duplicateMsg || "Something went wrong. Please check for duplicate data.";
      case 502:
      case 503:
        return "Server is temporarily unavailable.";
    }
  }

  if (err.message && typeof err.message === "string") {
    const lowMsg = err.message.toLowerCase();
    if (lowMsg.includes("status code") || lowMsg.includes("failed") || lowMsg.includes("500")) {
      return defaultMsg;
    }
    return err.message;
  }

  return defaultMsg;
}

// Logs structured error details for debugging.
export function logError(context: string, err: any) {
  console.error(`[${context}]`, {
    message: err?.message,
    status: err?.response?.status,
    data: err?.response?.data,
    stack: err?.stack,
  });
}

// Validates required fields and returns an error message if any are empty.
export function validateRequiredFields(fields: Record<string, any>): string | null {
  const emptyFields = Object.entries(fields)
    .filter(([, value]) => !value || (typeof value === "string" && value.trim() === ""))
    .map(([key]) => key);

  if (emptyFields.length > 0) {
    return `Please fill in all required fields: ${emptyFields.join(", ")}`;
  }

  return null;
}

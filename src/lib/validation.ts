import { z } from "zod";
import { toast } from "sonner";

// Generic validation function
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T | null {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Show first validation error
      const firstError = error.issues[0];
      toast.error("Dữ liệu không hợp lệ", {
        description: firstError.message,
      });
    }
    return null;
  }
}

// Validation function that returns errors instead of showing toast
export function validateDataSilent<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
} {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    return { success: false };
  }
}

// Format Zod errors for form display
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const formattedErrors: Record<string, string> = {};
  
  error.issues.forEach((err) => {
    const path = err.path.join('.');
    formattedErrors[path] = err.message;
  });
  
  return formattedErrors;
}

// Get first error message from ZodError
export function getFirstErrorMessage(error: z.ZodError): string {
  return error.issues[0]?.message || "Dữ liệu không hợp lệ";
}

// Validate form data and return formatted errors
export function validateFormData<T>(
  schema: z.ZodSchema<T>, 
  data: unknown
): { isValid: boolean; data?: T; errors?: Record<string, string> } {
  const result = validateDataSilent(schema, data);
  
  if (result.success) {
    return { isValid: true, data: result.data };
  }
  
  if (result.errors) {
    return { 
      isValid: false, 
      errors: formatZodErrors(result.errors) 
    };
  }
  
  return { isValid: false };
}
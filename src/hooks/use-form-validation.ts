import { useState, useCallback } from "react";
import { z } from "zod";
import { validateFormData } from "@/lib/validation";

interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>;
  onSubmit?: (data: T) => void | Promise<void>;
  onError?: (errors: Record<string, string>) => void;
}

export function useFormValidation<T>({
  schema,
  onSubmit,
  onError,
}: UseFormValidationOptions<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  const validate = useCallback((data: unknown): T | null => {
    setIsValidating(true);
    const result = validateFormData(schema, data);

    if (result.isValid && result.data) {
      setErrors({});
      setIsValidating(false);
      return result.data;
    } else {
      const formErrors = result.errors || {};
      setErrors(formErrors);
      onError?.(formErrors);
      setIsValidating(false);
      return null;
    }
  }, [schema, onError]);

  const handleSubmit = useCallback(async (data: unknown) => {
    const validData = validate(data);
    if (validData && onSubmit) {
      try {
        await onSubmit(validData);
      } catch (error) {
        console.error("Form submission error:", error);
      }
    }
  }, [validate, onSubmit]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const setFieldError = useCallback((field: string, message: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: message,
    }));
  }, []);

  return {
    errors,
    isValidating,
    validate,
    handleSubmit,
    clearErrors,
    clearError,
    setFieldError,
    hasErrors: Object.keys(errors).length > 0,
  };
}
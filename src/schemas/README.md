# Validation Schemas

This directory contains Zod validation schemas for the foo-fund-frontend application.

## Structure

```
src/schemas/
├── auth.schema.ts          # Authentication related schemas
├── user.schema.ts          # User profile and account schemas  
├── campaign.schema.ts      # Campaign creation and management schemas
├── organization.schema.ts  # Organization related schemas
├── index.ts               # Export all schemas
└── README.md             # This file
```

## Usage

### Basic Validation

```typescript
import { signInSchema } from "@/schemas";
import { validateData } from "@/lib/validation";

// Validate and show toast on error
const validData = validateData(signInSchema, formData);
if (validData) {
  // Use validated data
  console.log(validData.email, validData.password);
}
```

### Silent Validation

```typescript
import { signUpSchema } from "@/schemas";
import { validateDataSilent } from "@/lib/validation";

// Validate without showing toast
const result = validateDataSilent(signUpSchema, formData);
if (result.success) {
  // Use result.data
} else {
  // Handle result.errors
}
```

### Form Validation Hook

```typescript
import { useFormValidation } from "@/hooks/use-form-validation";
import { createCampaignSchema } from "@/schemas";

function CampaignForm() {
  const { errors, validate, handleSubmit } = useFormValidation({
    schema: createCampaignSchema,
    onSubmit: async (data) => {
      // Handle valid form submission
      await createCampaign(data);
    },
    onError: (errors) => {
      // Handle validation errors
      console.log("Validation errors:", errors);
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(formData);
    }}>
      <input 
        type="text" 
        className={errors.title ? "border-red-500" : ""} 
      />
      {errors.title && <span className="text-red-500">{errors.title}</span>}
    </form>
  );
}
```

### Manual Form Validation

```typescript
import { validateFormData } from "@/lib/validation";
import { updateProfileSchema } from "@/schemas";

function handleFormSubmit(formData: unknown) {
  const { isValid, data, errors } = validateFormData(updateProfileSchema, formData);
  
  if (isValid && data) {
    // Submit valid data
    updateProfile(data);
  } else {
    // Display errors
    setFormErrors(errors || {});
  }
}
```

## Available Schemas

### Authentication
- `signInSchema` - Email and password login
- `signUpSchema` - User registration with password confirmation
- `confirmSignUpSchema` - Email confirmation with 6-digit code
- `forgotPasswordSchema` - Password reset request
- `confirmForgotPasswordSchema` - Password reset confirmation

### User Management
- `updateProfileSchema` - User profile updates
- `updateUserAccountSchema` - Admin user account updates

### Campaign Management
- `createCampaignSchema` - Campaign creation with full validation
- `updateCampaignSchema` - Campaign updates (partial)
- `campaignFilterSchema` - Campaign filtering and search
- `changeCampaignStatusSchema` - Campaign status changes

### Organization Management
- `createOrganizationRequestSchema` - Organization creation requests
- `joinOrganizationRequestSchema` - Join organization requests
- `updateOrganizationSchema` - Organization updates
- `changeOrganizationStatusSchema` - Organization status changes

## Validation Features

### Built-in Validations
- **Email validation** - Proper email format
- **Password strength** - Minimum 8 chars, uppercase, lowercase, number
- **Phone numbers** - Vietnamese phone number format
- **URLs** - Valid URL format
- **Dates** - Valid date strings and logical date ordering
- **Percentages** - 0-100 range with decimal support
- **Amounts** - Positive numbers with decimal support
- **UUIDs** - Valid UUID format

### Custom Validations
- **Password confirmation** - Ensures passwords match
- **Budget percentages** - Must sum to 100%
- **Date ordering** - Logical sequence of campaign dates
- **String lengths** - Appropriate min/max lengths for different fields

## Error Handling

The validation system provides Vietnamese error messages and multiple ways to handle errors:

1. **Toast notifications** - `validateData()` shows toast on error
2. **Silent validation** - `validateDataSilent()` returns errors without UI
3. **Form errors** - `validateFormData()` returns formatted field errors
4. **Custom handling** - Use validation hooks for custom error handling

## TypeScript Integration

All schemas export TypeScript types that can be used throughout your application:

```typescript
import type { SignInInput, CreateCampaignInput } from "@/schemas";

// Use the types in your components and services
function loginUser(credentials: SignInInput) {
  // TypeScript knows the exact shape of credentials
}
```
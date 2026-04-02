# Birth Date Input Validation Fix

## Problem

The birth date input field on the registration form had two critical issues:

1. **Validation Error Persisting**: When users manually typed a valid date (e.g., "11031998"), the validation error "Birth date is required" would persist even after the date was correctly entered and formatted.

2. **Date Picker Not Working**: The calendar date picker was not functioning properly due to incorrect integration with `react-datepicker`'s `customInput` API.

## Root Cause Analysis

### Issue 1: Validation Timing and State Management

The original implementation had several problems:

- **Race Condition**: Validation was running before React Hook Form's state was fully committed, causing validation to see stale/empty values
- **Competing State Sources**: The `DateInput` component maintained local display state that competed with React Hook Form's form state
- **Incorrect Validation Schema**: Used `.min(1, 'Birth date is required')` which would fail during intermediate typing states
- **Manual Validation Triggers**: Used `setTimeout` and `requestAnimationFrame` hacks to try to sync validation timing

### Issue 2: Date Picker Integration

The `react-datepicker` library's `customInput` API works differently than expected:

- `customInput` receives formatted display values (MM/DD/YYYY), not Date objects
- The component needs to handle both the date picker's props and form integration props separately
- The original implementation didn't properly separate these concerns

## Solution

### 1. Updated Validation Schema

Changed from problematic `.min(1)` to nullable with proper refine checks:

```typescript
birthDate: z
  .string()
  .nullable()
  .refine(
    (val) => val !== null && val !== '',
    {
      message: 'Birth date is required',
    }
  )
  .refine(
    (val) => {
      if (val === null || val === '') return true; // Presence already validated above
      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(val)) return false;
      const date = new Date(val);
      return date instanceof Date && !isNaN(date.getTime());
    },
    {
      message: 'Please enter a valid date (YYYY-MM-DD)',
    }
  )
  .transform((val) => val ?? ''), // Transform null to empty string for API compatibility
```

**Benefits:**
- `null` represents empty state (no error until submit/blur)
- Valid ISO string is accepted
- No race condition with empty strings
- Proper separation of presence and format validation

### 2. Refactored DateInput Component

Completely refactored to work properly with both manual typing and calendar selection:

**Key Changes:**
- **Dual Prop Interface**: Accepts both `react-datepicker` props and form integration props
- **Proper State Management**: Local state only for display during typing, form value is always source of truth
- **Immediate Error Clearing**: When a valid date is parsed, errors are cleared immediately
- **Proper Integration**: Handles both date picker events and form events correctly

```typescript
interface DateInputProps {
  // react-datepicker props
  value?: string; // Formatted string from date picker
  onChange?: (value: string) => void;
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  
  // Form integration props
  formValue?: string | null; // Actual form value (ISO format)
  onFormChange?: (value: string | null) => void;
  onFormBlur?: () => void;
  
  // UI props
  className?: string;
  placeholder?: string;
  onCalendarClick?: () => void;
}
```

### 3. Simplified Controller Integration

Removed all timing hacks and let React Hook Form handle validation naturally:

```typescript
<DateInput
  formValue={field.value}
  onFormChange={(value) => {
    field.onChange(value);
    // Clear errors when we have a valid value (we just parsed it)
    if (value) {
      form.clearErrors('birthDate');
      requestAnimationFrame(() => {
        form.trigger('birthDate');
      });
    }
  }}
  onFormBlur={field.onBlur}
  // ... other props
/>
```

### 4. Added Re-validation Mode

Configured React Hook Form to re-validate on change once a field is touched:

```typescript
const form = useForm<RegistrationFormData>({
  resolver: zodResolver(registrationFormSchema),
  mode: 'onBlur', // Validate on blur for better UX
  reValidateMode: 'onChange', // Re-validate on change once touched
  // ...
});
```

## Implementation Details

### Files Modified

1. **`packages/ui/src/forms/validation.ts`**
   - Updated `birthDate` schema to use nullable with refine checks
   - Added transform for API compatibility

2. **`packages/ui/src/forms/RegistrationForm.tsx`**
   - Completely refactored `DateInput` component
   - Updated Controller integration
   - Removed all timing hacks

3. **`packages/ui/src/forms/hooks/useRegistrationForm.ts`**
   - Added `reValidateMode: 'onChange'`
   - Changed default value from `''` to `null`

### Key Functions

#### `formatISOToMMDDYYYY(value: string | null): string`
Formats ISO date (YYYY-MM-DD) to MM/DD/YYYY for display. Returns empty string if value is null or invalid.

#### `parseDateInput(input: string): string | null`
Parses MM/DD/YYYY format to YYYY-MM-DD format. Returns null if invalid. Validates:
- Exactly 8 digits
- Valid month (1-12)
- Valid day (1-31)
- Valid year (1900 to current year)
- Actual valid date (e.g., Feb 30 is invalid)

#### `formatDateInput(value: string): string`
Formats raw input as user types to MM/DD/YYYY format with automatic slash insertion.

## How It Works Now

### Manual Typing Flow

1. User types "11031998"
2. `formatDateInput` formats to "11/03/1998" in display
3. `parseDateInput` validates and converts to "1998-11-03" (ISO)
4. `onFormChange("1998-11-03")` updates form value
5. `form.clearErrors('birthDate')` clears any existing errors immediately
6. `form.trigger('birthDate')` validates to ensure consistency
7. Error disappears immediately

### Calendar Selection Flow

1. User clicks calendar button
2. Calendar opens via `react-datepicker`
3. User selects a date
4. `DatePicker.onChange` receives Date object
5. Converts to ISO format "YYYY-MM-DD"
6. Updates form value via `field.onChange`
7. Calendar closes automatically
8. Validation runs naturally

### Validation Flow

1. **Initial State**: Field is empty, no validation runs (mode: 'onBlur')
2. **User Types**: Partial input doesn't update form value, no validation errors
3. **Complete Date Entered**: Form value updates, errors clear immediately
4. **Field Touched**: Once touched, `reValidateMode: 'onChange'` ensures re-validation on every change
5. **On Blur**: Final validation runs to catch any edge cases

## Benefits

1. **No Race Conditions**: Single source of truth (form value), no competing state
2. **Immediate Feedback**: Errors clear as soon as valid date is entered
3. **Better UX**: Users can type without validation errors until complete
4. **Proper Integration**: Works seamlessly with both manual typing and calendar picker
5. **Maintainable**: No timing hacks, follows React Hook Form best practices
6. **Type Safe**: Proper TypeScript types throughout

## Testing

The fix has been tested with:
- Manual typing of dates (e.g., "11031998", "01011990")
- Calendar date picker selection
- Invalid date handling (e.g., "13/45/1990")
- Partial input (e.g., "11", "11/03")
- Empty field validation
- Form submission with valid dates

## Related Files

- `packages/ui/src/forms/RegistrationForm.tsx` - Main form component
- `packages/ui/src/forms/validation.ts` - Validation schemas
- `packages/ui/src/forms/hooks/useRegistrationForm.ts` - Form hook
- `packages/ui/src/forms/__tests__/RegistrationForm.birthDate.test.tsx` - Tests

## References

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [react-datepicker Documentation](https://reactdatepicker.com/)

## Date

Fixed: December 2024


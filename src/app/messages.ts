export const messages = {
	requiredField: $localize`:required field message|Validation error message for a required field@@required_msg:This field is required`,
	invalidEmail: $localize`:invalid email message|Validation error message for an email field@@invalid_email:Invalid email address`,
	unknownError: $localize`:unkonwn error|An action failed with an unknown cause:An unknown error occurred`,
	passwordMinLength: (length: 8) => $localize`:password minimum length|The minimum length of a password:Password must be at least ${length} characters long`,
	passwordMismatch: $localize`Passwords do not match`,
	serverUnreachable: $localize`Could not reach the server. Please try again`
} as const;

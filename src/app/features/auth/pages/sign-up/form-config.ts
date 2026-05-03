import { email, minLength, required, SchemaPathTree, validate } from '@angular/forms/signals';
import { Strict } from "@app/types";
import { EmailSignUpRequest } from "@civilio/sdk/models";

export function defaultSignUpFormData(): Strict<EmailSignUpRequest> {
	return {
		email: '',
		confirmPassword: null,
		lastName: '',
		password: '',
		firstName: null
	} as unknown as Strict<EmailSignUpRequest>;
}

export function configureSignUpForm(schemaPath: SchemaPathTree<EmailSignUpRequest>) {
	required(schemaPath.email, { message: 'This field is required' });
	email(schemaPath.email, { message: 'Please enter a valid email address' });

	required(schemaPath.password, { message: 'This field is required' });
	minLength(schemaPath.password, 8, { message: 'Password must be at least 8 characters long' });

	required(schemaPath.confirmPassword, { message: 'This field is required' });
	validate(schemaPath.confirmPassword, ({ valueOf, value }) => {
		const password = valueOf(schemaPath.password);
		const v = value();
		if (!password && !v) return null;
		return password === v ? null : { message: 'Passwords do not match', kind: 'passwordMismatch' };
	});
}

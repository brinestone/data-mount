import { email, minLength, required, SchemaPathTree, validate } from '@angular/forms/signals';
import { messages } from '@app/messages';
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
	required(schemaPath.email, { message: messages.requiredField });
	email(schemaPath.email, { message: messages.invalidEmail });

	required(schemaPath.password, { message: messages.requiredField });
	minLength(schemaPath.password, 8, { message: messages.passwordMinLength(8) });

	required(schemaPath.confirmPassword, { message: messages.requiredField });
	validate(schemaPath.confirmPassword, ({ valueOf, value }) => {
		const password = valueOf(schemaPath.password);
		const v = value();
		if (!password && !v) return null;
		return password === v ? null : { message: messages.passwordMismatch, kind: 'passwordMismatch' };
	});
}

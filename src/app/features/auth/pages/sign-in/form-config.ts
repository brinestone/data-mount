import { disabled, email, required, schema } from '@angular/forms/signals';
import { messages } from '@app/messages';
import { EmailSignInRequest } from '@datamount/sdk/models';
import { Strict } from '~/types';

export function defaultSignInData() {
	return EmailSignInRequest.required().parse({
		email: null,
		staySignedIn: false,
		password: null,
	}) as unknown as Strict<EmailSignInRequest>;
}

export const loginFormSchema = schema<Strict<EmailSignInRequest>>((paths) => {
	required(paths.email, { message: messages.requiredField });
	email(paths.email, { message: messages.invalidEmail });
	disabled(paths.email, ({ stateOf }) => stateOf(paths).submitting());

	required(paths.password, { message: messages.requiredField });
	disabled(paths.password, ({ stateOf }) => stateOf(paths).submitting());

	disabled(paths.staySignedIn, ({ stateOf }) => stateOf(paths).submitting());
});

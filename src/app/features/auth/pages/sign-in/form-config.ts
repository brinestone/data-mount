import { email, required, schema } from "@angular/forms/signals";
import { Strict } from "@app/types";
import { EmailSignInRequest } from "@civilio/sdk/models";

export function defaultSignInData() {
	return EmailSignInRequest.required().parse({
		email: null,
		staySignedIn: false,
		password: null
	}) as unknown as Strict<EmailSignInRequest>;
}

export const loginFormSchema = schema<Strict<EmailSignInRequest>>(paths => {
	required(paths.email, { message: 'This field is required' });
	email(paths.email, { message: 'Invalid email address' });

	required(paths.password, { message: 'This field is required' });
})

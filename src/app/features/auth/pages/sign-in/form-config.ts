import { email, required, schema } from "@angular/forms/signals";
import { messages } from "@app/messages";
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
	required(paths.email, { message: messages.requiredField });
	email(paths.email, { message: messages.invalidEmail });

	required(paths.password, { message: messages.requiredField });
})

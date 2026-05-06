import { NgTemplateOutlet } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { form, FormField, FormRoot, ValidationError } from "@angular/forms/signals";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { PasswordInput } from "@app/components";
import { EmailSignInValidationErrors } from "@app/types";
import { AuthService } from "@civilio/sdk/services/auth/auth.service";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lobeGoogleColor } from "@ng-icons/lobe-icons/color";
import { lucideAlertCircle, lucideLoader } from "@ng-icons/lucide";
import { HlmAlert, HlmAlertDescription } from "@spartan-ng/helm/alert";
import { HlmButton } from "@spartan-ng/helm/button";
import { HlmCheckbox } from "@spartan-ng/helm/checkbox";
import { HlmField, HlmFieldDescription, HlmFieldError, HlmFieldLabel, HlmFieldSeparator, HlmFieldSet } from "@spartan-ng/helm/field";
import { HlmInput } from "@spartan-ng/helm/input";
import { HlmSpinner } from "@spartan-ng/helm/spinner";
import { lastValueFrom } from "rxjs";
import { defaultSignInData, loginFormSchema } from "./form-config";
import { messages } from "@app/messages";

@Component({
	selector: 'dm-sign-in-page',
	templateUrl: './sign-in.page.html',
	styleUrl: './sign-in.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		FormRoot,
		FormField,
		HlmAlert,
		HlmAlertDescription,
		NgIcon,
		NgTemplateOutlet,
		HlmSpinner,
		HlmField,
		HlmFieldLabel,
		HlmFieldSeparator,
		HlmFieldDescription,
		HlmFieldError,
		HlmFieldSet,
		PasswordInput,
		HlmInput,
		HlmButton,
		HlmCheckbox,
		RouterLink
	],
	viewProviders: [
		provideIcons({
			lucideAlertCircle,
			lucideLoader,
			lobeGoogleColor
		})
	]
})
export class SignInPage {
	private readonly router = inject(Router);
	private readonly authService = inject(AuthService);

	protected readonly route = inject(ActivatedRoute);
	protected readonly errorTitle = signal('');
	protected readonly formData = signal(defaultSignInData());
	protected readonly formModel = form(this.formData, loginFormSchema, {
		submission: {
			action: async (field) => {
				this.errorTitle.set('');
				try {
					const session = await lastValueFrom(this.authService.emailSignIn({
						email: field.email().value(),
						password: field.password().value(),
						staySignedIn: field.staySignedIn().value()
					}));
					if (field.staySignedIn().value()) {
						localStorage.setItem('session', JSON.stringify(session));
					} else {
						sessionStorage.setItem('session', JSON.stringify(session));
					}
				} catch (e) {
					const result: ValidationError.WithFieldTree[] = [];
					if (e instanceof HttpErrorResponse) {
						const isValidationError = e.status == 400;
						this.errorTitle.set(e.error?.title ?? messages.unknownError);
						if (isValidationError) {
							const { errors: { Email, Password } } = e.error as EmailSignInValidationErrors;
							Email?.forEach(message => result.push({ kind: 'validationError', fieldTree: field.email, message }));
							Password?.forEach(message => result.push({ kind: 'validationError', fieldTree: field.password, message }));
						} else if (e.status < 500) {
							return { kind: 'validationError', message: e.error?.detail ?? e.error?.message ?? e.message, fieldTree: field };
						} else if (e.status == 0) {
							return { kind: 'serverError', message: messages.serverUnreachable, fieldTree: field };
						} else {
							return { kind: 'serverError', message: e.error?.detail ?? e.error?.message ?? e.message };
						}
					} else {
						return { kind: 'serverError', message: (e as Error)?.message ?? messages.unknownError, fieldTree: field };
					}
					return result;
				}
				const redirect = decodeURIComponent(this.route.snapshot.queryParams['continue'] ?? '%252F');
				this.router.navigate([redirect],);
				return null;
			}
		}
	});

	protected readonly authMethods: { icon: string, label: string, handler: () => void }[] = [
		// { label: 'Google', icon: 'lobeGoogleColor', handler: this.googleSignInHandler.bind(this) }
	];

	private googleSignInHandler() {

	}
}

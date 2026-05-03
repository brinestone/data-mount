import { NgTemplateOutlet } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { form, FormField, FormRoot, ValidationError } from "@angular/forms/signals";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { EmailSignUpValidationErrors } from "@app/types";
import { AuthService } from "@civilio/sdk/services/auth/auth.service";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lobeGoogleColor } from '@ng-icons/lobe-icons/color';
import { lucideAlertCircle, lucideDot, lucideEye, lucideEyeOff, lucideInfo, lucideLoader } from "@ng-icons/lucide";
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { lastValueFrom } from "rxjs";
import { configureSignUpForm, defaultSignUpFormData } from "./form-config";
import { PasswordInput } from "@app/components";

@Component({
	selector: 'dm-sign-up-page',
	templateUrl: './sign-up.page.html',
	styleUrl: './sign-up.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	viewProviders: [
		provideIcons({
			lucideLoader,
			lucideDot,
			lucideEye,
			lucideEyeOff,
			lobeGoogleColor,
			lucideAlertCircle
		})
	],
	imports: [
		HlmInputGroupImports,
		HlmAlertImports,
		HlmFieldImports,
		FormRoot,
		FormField,
		HlmInput,
		HlmSpinner,
		HlmButton,
		RouterLink,
		PasswordInput,
		NgTemplateOutlet,
		NgIcon,
		HlmSpinner,
	]
})
export class SignUpPage {

	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);
	private readonly authService = inject(AuthService);

	protected readonly formData = signal(defaultSignUpFormData());
	protected readonly formModel = form(this.formData, configureSignUpForm, {
		submission: {
			action: async (field) => {
				try {
					await lastValueFrom(this.authService.emailSignUp(field().value()));
				} catch (e) {
					const result: ValidationError.WithFieldTree[] = [];
					if (e instanceof HttpErrorResponse) {
						const isValidationError = e.status == 400;
						if (isValidationError) {
							const { errors: { ConfirmPassword, Email, Password } } = e.error as EmailSignUpValidationErrors;
							ConfirmPassword?.forEach(message => result.push({ kind: 'validationError', fieldTree: field.confirmPassword, message }));
							Email?.forEach(message => result.push({ kind: 'validationError', fieldTree: field.email, message }));
							Password?.forEach(message => result.push({ kind: 'validationError', fieldTree: field.password, message }));
						} else if (e.status < 500) {
							return { kind: 'validationError', message: e.error?.message ?? e.message, fieldTree: field };
						} else if (e.status == 0) {
							return { kind: 'serverError', message: 'Could not reach the server', fieldTree: field };
						} else {
							return { kind: 'serverError', message: e.error?.title ?? e.message };
						}
					} else {
						return { kind: 'serverError', message: (e as Error)?.message ?? 'An unexpected error occurred', fieldTree: field };
					}
					return result;
				}

				this.router.navigate(['..', 'signin'], { relativeTo: this.route, queryParamsHandling: 'preserve', state: { newIdentifier: field.email().value(), type: 'email' } });
				return null;
			}
		}
	});
	protected readonly links: { path: string, label: string }[] = [
		// { path: '/about', label: 'About' },
		// { path: '/legal', label: 'Legal' },
	];
	protected readonly authMethods: { icon: string, label: string, handler: () => void }[] = [
		{ label: 'Google', icon: 'lobeGoogleColor', handler: this.googleSignInHandler.bind(this) }
	];

	private googleSignInHandler() {

	}
}


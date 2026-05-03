import { booleanAttribute, ChangeDetectionStrategy, Component, ElementRef, input, linkedSignal, model, numberAttribute, signal, viewChild } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideEye, lucideEyeOff } from '@ng-icons/lucide';
import { HlmInputGroup, HlmInputGroupAddon, HlmInputGroupButton, HlmInputGroupInput } from '@spartan-ng/helm/input-group';

@Component({
	selector: 'dm-password-input',
	imports: [
		HlmInputGroupAddon,
		HlmInputGroupButton,
		HlmInputGroupInput,
		NgIcon
	],
	viewProviders: [
		provideIcons({
			lucideEye,
			lucideEyeOff
		})
	],
	template: `
		<input
			[id]="id()"
			[autocomplete]="autocomplete() ?? 'current-password'"
			[type]="showToggle() && showingPassword() ? 'text' : 'password'"
			[placeholder]="placeholder()"
			[name]="name()"
			[value]="value()"
			[disabled]="disabled()"
			[readonly]="readonly()"
			[hidden]="hidden()"
			[attr.maxlength]="_maxLength()"
			[attr.minlength]="_minLength()"
			[required]="required()"
			[class.ng-invalid]="invalid()"
			[class.ng-touched]="touched()"
			[class.ng-dirty]="dirty()"
			(blur)="onBlur()"
			(input)="value.set($event.target.value)"
			class="pl-1!"
			hlmInputGroupInput
			#input
		/>
		@if(showToggle()) {
			<div hlmInputGroupAddon align="inline-end">
				<button [disabled]="disabled()" [attr.tabindex]="-1" type="button" (click)="onToggleButtonClicked()" hlmInputGroupButton class="rounded-full" size="icon-xs">
					<ng-icon [name]="showingPassword() ? 'lucideEyeOff' : 'lucideEye'"/>
				</button>
			</div>
		}
	`,
	hostDirectives: [
		HlmInputGroup
	],
	styleUrl: './password-input.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordInput implements FormValueControl<string | undefined> {
	private readonly passwordInput = viewChild.required<ElementRef<HTMLInputElement>>('input');
	protected readonly showingPassword = signal(false);
	readonly showToggle = model<boolean>(true);
	readonly autocomplete = input<string>();
	readonly id = input<string>();
	readonly placeholder = input<string>('');
	readonly name = input<string, any>('', { transform: v => String(v ?? '') });
	readonly disabled = input<boolean, unknown>(false, { transform: booleanAttribute });
	readonly readonly = input<boolean, unknown>(false, { transform: booleanAttribute });
	readonly hidden = input<boolean, unknown>(false, { transform: booleanAttribute });
	readonly invalid = input<boolean, unknown>(false, { transform: booleanAttribute });
	readonly touched = model<boolean>(false);
	readonly dirty = input<boolean, unknown>(false, { transform: booleanAttribute });
	readonly required = input<boolean, unknown>(false, { transform: booleanAttribute });
	readonly minLength = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
	readonly maxLength = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
	protected readonly _maxLength = linkedSignal(() => {
		const min = this.minLength();
		const max = this.maxLength();
		if (min === undefined) return max;
		else if (max === undefined) return Number.POSITIVE_INFINITY;
		else return undefined;
	});
	protected readonly _minLength = linkedSignal(() => {
		const min = this.minLength();
		const max = this.maxLength();
		if (max === undefined) return min;
		else if (min === undefined) return Number.NEGATIVE_INFINITY;
		else return undefined;
	})

	readonly value = model<string | undefined>('');
	focus?(options?: FocusOptions): void {
		this.passwordInput().nativeElement.focus(options);
		this.touched.set(true);
	}
	protected onToggleButtonClicked() {
		this.showingPassword.update(v => !v);
	}

	protected onBlur() {
		this.touched.set(true)
	}
}

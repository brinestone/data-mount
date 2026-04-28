import { ChangeDetectionStrategy, Component } from "@angular/core";
import { HlmButton } from '@spartan-ng/helm/button';

@Component({
	selector: 'dm-auth-layout',
	templateUrl: './auth.layout.html',
	styleUrl: './auth.layout.scss',
	imports: [
		HlmButton
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayout {
}

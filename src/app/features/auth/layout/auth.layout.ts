import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { NgxFlickeringGridComponent } from '@omnedia/ngx-flickering-grid';


@Component({
	selector: 'dm-auth-layout',
	templateUrl: './auth.layout.html',
	styleUrl: './auth.layout.scss',
	imports: [
		RouterLinkActive,
		RouterLink,
		RouterOutlet,
		NgxFlickeringGridComponent
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayout {
	protected links = [
		{ label: 'Sign up', path: 'signup' },
		{ label: 'Sign in', path: 'signin' },
	]
}

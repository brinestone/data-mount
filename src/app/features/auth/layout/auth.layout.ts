import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HlmButton } from '@spartan-ng/helm/button';
import { NgxFlickeringGridComponent } from '@omnedia/ngx-flickering-grid';

@Component({
	selector: 'dm-auth-layout',
	templateUrl: './auth.layout.html',
	styleUrl: './auth.layout.scss',
	imports: [
		HlmButton,
		RouterOutlet,
		NgxFlickeringGridComponent
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayout {
}

import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { isUserSignedIn } from '@app/features/auth/utils';
import { ThemeService } from '@app/features/themeing/theme.service';
import { NgxFlickeringGridComponent } from '@omnedia/ngx-flickering-grid';
import { NgxGradientTextComponent } from '@omnedia/ngx-gradient-text';
import { HlmButton } from '@spartan-ng/helm/button';

@Component({
	selector: 'dm-landing',
	imports: [
		RouterLink,
		HlmButton,
		NgxFlickeringGridComponent,
		NgxGradientTextComponent,
		HlmButton,
	],
	templateUrl: './landing.page.html',
	styleUrl: './landing.page.scss',
})
export class LandingPage {
	protected signedIn = isUserSignedIn();
	protected readonly theme = inject(ThemeService).themeSignal;
}

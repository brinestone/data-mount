import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Banner } from '@app/components/banner/banner';
import { RootMenu } from '@app/components/root-menu/root-menu';
import { ThemeService } from '@app/features/themeing/theme.service';

@Component({
	selector: 'dm-root',
	imports: [
		RouterOutlet,
		Banner,
		RootMenu,

	],
	templateUrl: './root.layout.html',
	styleUrl: './root.layout.scss',
})
export class RootLayout {
	protected readonly theme = inject(ThemeService).themeSignal;
}

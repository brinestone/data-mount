import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '@app/features/themeing/theme.service';

@Component({
	selector: 'dm-banner',
	imports: [
		RouterLink
	],
	templateUrl: './banner.html',
	styleUrl: './banner.scss',
})
export class Banner {
	protected readonly theme = inject(ThemeService).themeSignal;
}

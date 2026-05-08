import { ChangeDetectionStrategy, Component, isDevMode } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideDot } from "@ng-icons/lucide";
import { NgxFlickeringGridComponent } from '@omnedia/ngx-flickering-grid';

type PageLink = {
	path: string, label: string
}

@Component({
	selector: 'dm-auth-layout',
	templateUrl: './auth.layout.html',
	styleUrl: './auth.layout.scss',
	imports: [
		RouterLinkActive,
		RouterLink,
		// NgOptimizedImage,
		RouterOutlet,
		NgxFlickeringGridComponent,
		NgIcon
	],
	viewProviders: [
		provideIcons({
			lucideDot
		})
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayout {
	protected links: PageLink[] = [
		{ label: $localize`Sign up`, path: 'signup' },
		{ label: $localize`Sign in`, path: 'signin' },
	];
	protected readonly footLinks: PageLink[] = [
		{ path: '/', label: $localize`:landing page:Home` },
		{ path: '/about', label: $localize`:about page|The about page for the website@@site_about:About` },
		{ path: '/legal', label: $localize`:legal page|The legal page for the website@@site_legal:Legal` },
	];
	protected readonly usePlaceholders = !isDevMode();
}

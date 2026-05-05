import { ChangeDetectionStrategy, Component, isDevMode } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { NgxFlickeringGridComponent } from '@omnedia/ngx-flickering-grid';
import { NgOptimizedImage } from '@angular/common';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideDot } from "@ng-icons/lucide";

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
		NgOptimizedImage,
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
		{ label: 'Sign up', path: 'signup' },
		{ label: 'Sign in', path: 'signin' },
	];
	protected readonly footLinks: PageLink[] = [
		{ path: '/about', label: 'About' },
		{ path: '/legal', label: 'Legal' },
	];
	protected readonly usePlaceholders = !isDevMode();
}

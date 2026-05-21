import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Banner } from '@app/components/banner/banner';
import { ThemeService } from '@app/features/themeing/theme.service';
import { AuthService } from '@civilio/sdk/services/auth/auth.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronUp, lucideLogOut, lucideSettings } from '@ng-icons/lucide';
import { select } from '@ngxs/store';
import { HlmAvatar, HlmAvatarFallback, HlmAvatarImage } from '@spartan-ng/helm/avatar';
import {
	HlmDropdownMenu,
	HlmDropdownMenuItem,
	HlmDropdownMenuTrigger,
} from '@spartan-ng/helm/dropdown-menu';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { principal } from '~/app/stores/selectors';

@Component({
	selector: 'dm-root',
	viewProviders: [
		provideIcons({
			lucideChevronUp,
			lucideSettings,
			lucideLogOut,
		}),
	],
	imports: [
		HlmSidebarImports,
		HlmAvatar,
		HlmAvatarImage,
		HlmAvatarFallback,
		HlmDropdownMenuTrigger,
		HlmDropdownMenu,
		HlmDropdownMenuItem,
		RouterOutlet,
		Banner,
		NgIcon,
		RouterLink,
	],
	templateUrl: './app.layout.html',
	styleUrl: './app.layout.scss',
})
export class AppLayout {
	private readonly router = inject(Router);
	protected readonly principal = select(principal);
	private readonly authService = inject(AuthService);
	protected readonly theme = inject(ThemeService).themeSignal;

	protected onSignOutButtonClicked() {
		this.authService.signOut().subscribe({
			complete: () => {
				localStorage.clear();
				sessionStorage.clear();
				this.router.navigate(['/app']);
			},
		});
	}
}

import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { rxResource, takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Banner } from '@app/components/banner/banner';
import { ThemeService } from '@app/features/themeing/theme.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronDown, lucideChevronUp, lucideLogOut, lucidePlus, lucideSettings } from '@ng-icons/lucide';
import { Actions, dispatch, select } from '@ngxs/store';
import { HlmAvatar, HlmAvatarFallback, HlmAvatarImage } from '@spartan-ng/helm/avatar';
import {
	HlmDropdownMenu,
	HlmDropdownMenuItem,
	HlmDropdownMenuTrigger
} from '@spartan-ng/helm/dropdown-menu';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { forkJoin } from 'rxjs';
import { LoadPrincipal, LoadSession, SelectOrganization, SignOut } from '~/app/stores/auth/actions';
import { activeOrganization, principal } from '~/app/stores/selectors';
import { OrganizationService } from '~/sdk/services/organization/organization.service';
import { ProjectService } from '~/sdk/services/project/project.service';
import { ofActionInProgress } from '~/utils';

import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { BrnDialogState } from '@spartan-ng/brain/dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { NewProjectForm } from '~/app/components/forms';


@Component({
	selector: 'dm-root-layout',
	viewProviders: [
		provideIcons({
			lucidePlus,
			lucideCheck,
			lucideLogOut,
			lucideChevronUp,
			lucideChevronDown,
			lucideSettings,
		}),
	],
	imports: [
		HlmDialogImports,
		HlmSidebarImports,
		HlmAvatar,
		HlmSkeleton,
		HlmAvatarImage,
		HlmButton,
		HlmAvatarFallback,
		HlmDropdownMenuTrigger,
		HlmDropdownMenu,
		HlmDropdownMenuItem,
		RouterOutlet,
		NewProjectForm,
		Banner,
		NgIcon,
		RouterLink,
	],
	templateUrl: './app.layout.html',
	styleUrl: './app.layout.scss',
})
export class AppLayout implements OnInit {
	private readonly signOutAction = dispatch(SignOut);
	private readonly loadPrincipal = dispatch(LoadPrincipal);
	private readonly loadSession = dispatch(LoadSession);
	private readonly selectOrganization = dispatch(SelectOrganization);
	private readonly router = inject(Router);
	private readonly projectService = inject(ProjectService);
	private readonly orgService = inject(OrganizationService);
	private readonly actions$ = inject(Actions);

	protected readonly newProjectDialogState = signal<BrnDialogState>('open');
	protected readonly principal = select(principal);
	protected readonly currentOrg = select(activeOrganization);
	protected readonly theme = inject(ThemeService).themeSignal;
	protected readonly orgs = rxResource({
		stream: () => {
			return this.orgService.lookupMemberedOrganizations();
		},
		defaultValue: []
	});
	protected readonly projects = rxResource({
		stream: () => {
			return this.projectService.lookupProjects();
		},
		defaultValue: []
	});
	protected readonly selectedOrg = computed(() => {
		const id = this.currentOrg();
		return this.orgs.value().find(o => o.id === id);
	});
	protected readonly fetchingPrincipal = toSignal(this.actions$.pipe(
		takeUntilDestroyed(),
		ofActionInProgress(LoadPrincipal),
	), { initialValue: true });

	ngOnInit() {
		forkJoin([
			this.loadPrincipal(),
			this.loadSession(),
		]).subscribe();
	}

	protected onAddProjectButtonClicked() {
		this.newProjectDialogState.set('open');
	}

	protected onSignOutButtonClicked() {
		this.signOutAction().subscribe({
			error: e => {
				console.error(e);
			},
			complete: () => {
				this.router.navigate(['/app'], { replaceUrl: true, skipLocationChange: true, onSameUrlNavigation: 'reload' });
			}
		});
	}

	protected onSelectOrganizationButtonClicked(id: string) {
		const isCurrent = this.currentOrg() === id;
		if (isCurrent) return;
		this.selectOrganization(id).subscribe({
			error: (e: Error) => console.error(e), // TODO: show a toast to the user
		})
	}
}

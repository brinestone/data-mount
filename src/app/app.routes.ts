import { Routes } from "@angular/router";
import { signedInGuard } from "./features/auth/guards/signed-in.guard";
import { provideAuth } from "@civilio/sdk/providers";
import { anonymousGuard } from "./features/auth/guards/anonymous.guard";


const requireAuth = signedInGuard('/auth');
const redirectToDashboard = anonymousGuard('/dashboard');

export const appRoutes: Routes = [
	{ canActivate: [redirectToDashboard], path: 'auth', loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes), providers: [provideAuth()] },
	{
		path: 'dashboard',
		loadComponent: () => import('./features/dashboard/dashboard.page').then(m => m.DashboardPage),
		canActivate: [
			requireAuth
		],
	},
	{ path: 'landing', loadComponent: () => import('./pages/landing/landing.page').then(m => m.LandingPage), },
	{ path: 'forbidden', loadComponent: () => import('./pages/forbidden/forbidden.page').then(m => m.ForbiddenPage) },
	{ path: '', pathMatch: 'full', redirectTo: 'landing' },
	{ path: '**', loadComponent: () => import('./pages/not-found/not-found.page').then(m => m.NotFoundPage) }
];

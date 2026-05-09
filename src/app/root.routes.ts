import { Routes } from "@angular/router";
import { signedInGuard } from "./features/auth/guards/signed-in.guard";
import { provideAuth } from "@civilio/sdk/providers";
import { anonymousGuard } from "./features/auth/guards/anonymous.guard";


const redirectToDashboard = anonymousGuard('/app');
const requireAuth = signedInGuard('/auth');
export const rootRoutes: Routes = [
	{ canActivate: [redirectToDashboard], path: 'auth', loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes), providers: [provideAuth()] },
	{ canActivate: [requireAuth], path: 'app', loadComponent: () => import('./layouts/root/root.layout').then(m => m.RootLayout), loadChildren: () => import('./app.routes').then(m => m.appRoutes) },
	{ path: 'landing', loadComponent: () => import('./pages/landing/landing.page').then(m => m.LandingPage), },
	{ path: 'forbidden', loadComponent: () => import('./pages/forbidden/forbidden.page').then(m => m.ForbiddenPage) },
	{ path: '', pathMatch: 'full', redirectTo: 'landing' },
	{ path: '**', loadComponent: () => import('./pages/not-found/not-found.page').then(m => m.NotFoundPage) }
];

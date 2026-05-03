import { Routes } from "@angular/router";

export const authRoutes: Routes = [
	{
		path: '', loadComponent: () => import('./layout/auth.layout').then(m => m.AuthLayout), children: [
			{ path: 'signin', loadComponent: () => import('./pages/sign-in/sign-in.page').then(m => m.SignInPage) },
			{ path: 'signup', loadComponent: () => import('./pages/sign-up/sign-up.page').then(m => m.SignUpPage) },
			{ path: '', redirectTo: 'signup', pathMatch: 'full' },
		]
	}
];

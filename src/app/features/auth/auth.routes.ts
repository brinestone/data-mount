import { Routes } from "@angular/router";

export const authRoutes: Routes = [
	{
		path: '', loadComponent: () => import('./layout/auth.layout').then(m => m.AuthLayout), children: [
			{ title: $localize`:login page title|The title of the login page:Sign into Your account`, path: 'signin', loadComponent: () => import('./pages/sign-in/sign-in.page').then(m => m.SignInPage) },
			{ title: $localize`:sign up page title|The title of the sign up page:Register your account Today!`, path: 'signup', loadComponent: () => import('./pages/sign-up/sign-up.page').then(m => m.SignUpPage) },
			{ path: '', redirectTo: 'signup', pathMatch: 'full' },
		]
	}
];

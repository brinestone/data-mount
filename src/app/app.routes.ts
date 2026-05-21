import { Routes } from "@angular/router";

export const appRoutes: Routes = [
	{
		path: 'dashboard',
		title: $localize`Dashboard`,
		loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage),
	},
	{ path: '', pathMatch: 'full', redirectTo: 'dashboard' }
]

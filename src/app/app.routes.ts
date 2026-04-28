import { Routes } from "@angular/router";
import { signedInGuard } from "./features/auth/guards/signed-in.guard";

export const appRoutes: Routes = [
  { path: 'auth', loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes) },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.page').then(m => m.DashboardPage),
    canActivate: [
      signedInGuard('/auth')
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
];

import { Routes } from "@angular/router";

export const authRoutes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./layout/auth.layout').then(m => m.AuthLayout), children: [] }
];

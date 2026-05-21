import { Route } from '@angular/router';
import { MainLayoutComponent } from '@my-micro-frontend/shared-ui';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from '@my-micro-frontend/shared-core';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadChildren: () => import('auth-app/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'user-app',
        loadChildren: () => import('user-app/Routes').then((m) => m!.remoteRoutes),
      },
      {
        path: 'workflow-app',
        loadChildren: () => import('workflowApp/Routes').then((m) => m!.remoteRoutes),
      },
      {
        path: 'form-app',
        loadChildren: () => import('formApp/Routes').then((m) => m!.remoteRoutes),
      },
    ]
  }
];

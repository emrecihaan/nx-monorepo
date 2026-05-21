import { Route } from '@angular/router';

export const remoteRoutes: Route[] = [
    { path: '', loadComponent: () => import('../login/login.component').then(m => m.LoginComponent) }
];

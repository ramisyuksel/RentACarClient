import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('../pages/layouts/layouts'),
    children: [
      {
        path: 'login',
        loadComponent: () => import('../pages/login/login')
      },
      {
        path: '',
        loadComponent: () => import('../pages/dashboard/dashboard'),
      }
    ]
  }
];

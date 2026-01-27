import { Route } from '@angular/router';
import { authGuard } from '../guards/auth-guard';
import { Common } from '../services/common';
import { inject } from '@angular/core';

export const appRoutes: Route[] = [
  {
    path: 'unauthorize',
    loadComponent: () => import('../pages/unauthorize/unauthorize'),
  },
  {
    path: 'unavailable',
    loadComponent: () => import('../pages/unavailable/unavailable'),
  },
  {
    path: 'login',
    loadComponent: () => import('../pages/auth/login/login'),
  },
  {
    path: 'reset-password/:id',
    loadComponent: () => import('../pages/auth/reset-password/reset-password'),
  },
  {
    path: '',
    loadComponent: () => import('../pages/layouts/layouts'),
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('../pages/dashboard/dashboard'),
        canActivate: [
          () => inject(Common).checkPermissionForRoute('dashboard:view'),
        ],
      },
      {
        path: 'branches',
        loadChildren: () => import('../pages/branches/route'),
      },
      {
        path: 'roles',
        loadChildren: () => import('../pages/roles/route'),
      },
      {
        path: 'categories',
        loadChildren: () => import('../pages/categories/route'),
      },
      {
        path: 'protection-packages',
        loadChildren: () => import('../pages/protection-packages/route'),
      },
      {
        path: 'users',
        loadChildren: () => import('../pages/users/route'),
      },
      {
        path: 'customers',
        loadChildren: () => import('../pages/customers/route'),
      },
      {
        path: 'extra',
        loadChildren: () => import('../pages/rental-extras/route'),
      },
      {
        path: 'vehicles',
        loadChildren: () => import('../pages/vehicles/route'),
      },
      {
        path: 'reservations',
        loadChildren: () => import('../pages/reservations/route'),
      }
    ],
  },
];

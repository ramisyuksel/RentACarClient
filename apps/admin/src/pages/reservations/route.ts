import { Common } from '../../services/common';
import { Routes } from '@angular/router';
import { inject } from '@angular/core';

const router: Routes = [
  {
    path: '',
    loadComponent: () => import('./reservations'),
    canActivate: [
      () => inject(Common).checkPermissionForRoute('reservation:view'),
    ],
  },
  {
      path: 'add',
      loadComponent: () => import('./create/create'),
      canActivate: [() => inject(Common).checkPermissionForRoute('reservation:create')]
  },
  {
      path: 'edit/:id',
      loadComponent: () => import('./create/create'),
      canActivate: [() => inject(Common).checkPermissionForRoute('reservation:edit')]
  },
  {
      path: 'detail/:id',
      loadComponent: () => import('./detail/detail'),
      canActivate: [() => inject(Common).checkPermissionForRoute('vehicle:view')]
  }
];

export default router;

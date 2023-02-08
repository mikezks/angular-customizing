import { Routes } from '@angular/router';
import { CardComponentFactory, matchDynamicRoutes } from '@flight42/shared-customizing';
import { HomeComponent } from './core';


export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  matchDynamicRoutes(),
  {
    path: 'booking',
    loadChildren: () => import('./booking')
  },
  {
    path: '**',
    component: CardComponentFactory('⚠️ Error ⚠️', '<p>This view is not available.</p>')
  }
];

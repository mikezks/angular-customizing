import { Routes } from "@angular/router";
import { matchDynamicRoutes } from "@flight42/shared-customizing";

export const BOOKING_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'flight',
        pathMatch: 'full'
      },
      matchDynamicRoutes(),
      {
        path: 'flight',
        loadChildren: () => import('./flight')
      },
      {
        path: 'passenger',
        loadChildren: () => import('./passenger')
      },
      {
        path: 'ticket',
        loadChildren: () => import('./ticket')
      }
    ]
  }
];

export default BOOKING_ROUTES;

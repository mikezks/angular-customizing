import { Routes } from "@angular/router";
import { CardComponentFactory, matchDynamicRoutes } from "@flight42/shared-customizing";


export const TICKET_ROUTES: Routes = [
  {
    path: '',
    children: [
      matchDynamicRoutes(),
      {
        path: '**',
        component: CardComponentFactory('⚠️ Tickets ⚠️', '<p>This feature is not available yet.</p>')
      }
    ]
  }

];

export default TICKET_ROUTES;

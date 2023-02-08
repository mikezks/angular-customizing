import { Routes } from "@angular/router";
import { matchDynamicRoutes } from "@flight42/shared-customizing";
import { EditComponent } from "./features/edit/edit.component";
import { SearchComponent } from './features/search/search.component';


export const PASSENGER_ROUTES: Routes = [
  {
    path: '',
    children: [
      matchDynamicRoutes(),
      {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full'
      },
      {
        path: 'search',
        component: SearchComponent,
      },
      {
        path: 'edit/:id',
        component: EditComponent
      }
    ]
  }

];

export default PASSENGER_ROUTES;

import { Routes } from '@angular/router';
import { ListFormComponent } from './list-form.component';

export const listFormRoutes: Routes = [
  {
    path: '',
    component: ListFormComponent,
  },
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('@pages/list-form/form-detail/form-detail.component').then(
        (m) => m.FormDetailComponent
      ),
  },
];

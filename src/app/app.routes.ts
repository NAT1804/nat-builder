import { Routes } from '@angular/router';
import { MainLayoutComponent } from '@components/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('@pages/home/home.component').then((m) => m.HomeComponent),
      },
    ],
  },
];

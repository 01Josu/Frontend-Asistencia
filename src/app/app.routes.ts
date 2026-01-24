import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'asistencia',
    loadComponent: () =>
      import('./asistencia/asistencia.component').then(m => m.AsistenciaComponent)
  }
];

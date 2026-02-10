import { Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guards';

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
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    canActivateChild: [AdminGuard],
    loadComponent: () =>
      import('./admin/admin.component').then(m => m.AdminComponent),
    children: [
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./admin/usuarios/usuarios.component')
            .then(m => m.UsuariosComponent)
      },
      {
        path: 'empleados',
        loadComponent: () =>
          import('./admin/empleados/empleados.component')
            .then(m => m.EmpleadosComponent)
      },
      {
        path: 'horarios',
        loadComponent: () =>
          import('./admin/horarios/horarios.component')
            .then(m => m.HorariosComponent)
      },
      {
        path: 'justificaciones',
        loadComponent: () =>
          import('./admin/justificaciones/justificaciones.component')
            .then(m => m.JustificacionesComponent)
      },
      {
        path: 'reportes',
        loadComponent: () =>
          import('./admin/reportes/reportes.component')
            .then(m => m.ReportesComponent)
      },
      {
        path: '',
        redirectTo: 'empleados',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AsistenciaComponent } from './asistencia/asistencia.component';

export const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'asistencia', component: AsistenciaComponent } 
];

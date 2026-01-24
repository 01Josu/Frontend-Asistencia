import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService, LoginResponse } from '../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario = '';
  contrasena = '';
  mensaje = '';
  loading = false;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  login() {
    if (!this.usuario || !this.contrasena) {
      this.mensaje = 'Usuario y contraseña son obligatorios';
      return;
    }

    this.loading = true;
    this.mensaje = '';

    this.loginService.login(this.usuario, this.contrasena).subscribe({
      next: (res: LoginResponse) => {
        this.loading = false;

        // ❌ Login fallido
        if (!res.success || !res.token || !res.idUsuario) {
          this.mensaje = res.mensaje || 'Error inesperado';
          return;
        }

        // ⚠️ Login OK pero SIN empleado
        if (!res.idEmpleado) {
          this.mensaje = 'Tu usuario no tiene un empleado asignado. Comunícate con RRHH.';
          // 🔐 No dejamos sesión abierta
          localStorage.removeItem('token');
          return;
        }

        // ✅ Login OK + empleado
        localStorage.setItem('token', res.token);
        localStorage.setItem('idUsuario', res.idUsuario.toString());
        localStorage.setItem('idEmpleado', res.idEmpleado.toString());
        localStorage.setItem('nombres', res.nombres || '');
        localStorage.setItem('apellidos', res.apellidos || '');
        localStorage.setItem('rol', res.rol || '');

        this.router.navigate(['/asistencia']);
      },
      error: () => {
        this.loading = false;
        this.mensaje = 'Error al conectar con el servidor';
      }
    });
  }
}

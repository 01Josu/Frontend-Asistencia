import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService, LoginResponse } from '../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario = '';
  contrasena = '';
  mensaje = '';
  loading = false;

  constructor(private loginService: LoginService, private router: Router) {}

  login() {
    // Validación local
    if (!this.usuario || !this.contrasena) {
      this.mensaje = 'Usuario y contraseña son obligatorios';
      return;
    }

    this.loading = true;
    this.mensaje = '';

    this.loginService.login(this.usuario, this.contrasena).subscribe({
      next: (res: LoginResponse) => {
        this.loading = false;
        if (res.success && res.idUsuario && res.idEmpleado) {
          localStorage.setItem('idUsuario', res.idUsuario.toString());
          localStorage.setItem('idEmpleado', res.idEmpleado.toString());
          localStorage.setItem('nombres', res.nombres!);
          localStorage.setItem('apellidos', res.apellidos!);
          this.router.navigate(['/asistencia']);
        } else {
          this.mensaje = res.mensaje || 'Error inesperado';
        }
      },
      error: () => {
        this.loading = false;
        this.mensaje = 'Error al conectar con el servidor';
      }
    });
  }
}


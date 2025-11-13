import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario = '';
  contrasena = ''; // <-- cambió de "contraseña" a "contrasena"
  mensaje = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post('http://localhost:8080/api/login', {
      usuario: this.usuario,
      contraseña: this.contrasena // aquí no hay problema porque el backend espera "contraseña"
    }).subscribe((res: any) => {
      if(res.success) {
        localStorage.setItem('idEmpleado', res.empleado.id);
        localStorage.setItem('nombreEmpleado', res.empleado.nombre);
        this.router.navigate(['/asistencia']);
      } else {
        this.mensaje = res.mensaje;
      }
    });
  }
}

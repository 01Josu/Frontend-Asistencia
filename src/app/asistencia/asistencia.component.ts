import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- IMPORTAR
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asistencia',
  standalone: true, // <-- marcar como standalone
  imports: [CommonModule], // <-- agregar aquí
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css']
})
export class AsistenciaComponent {
  mensaje = '';

  constructor(private http: HttpClient, private router: Router) {}

  marcarEntrada() {
    const idEmpleado = localStorage.getItem('idEmpleado') || '';
    const nombre = localStorage.getItem('nombreEmpleado') || '';

    this.http.post('http://localhost:8080/api/asistencia/marcarEntrada', { idEmpleado, nombre })
      .subscribe((res: any) => {
        this.mensaje = res.mensaje;
      }, err => {
        this.mensaje = 'Error al registrar entrada';
      });
  }

  marcarSalida() {
    const idEmpleado = localStorage.getItem('idEmpleado') || '';
    const nombre = localStorage.getItem('nombreEmpleado') || '';

    this.http.post('http://localhost:8080/api/asistencia/marcarSalida', { idEmpleado, nombre })
      .subscribe((res: any) => {
        this.mensaje = res.mensaje;
      }, err => {
        this.mensaje = 'Error al registrar salida';
      });
  }

  logout() {
    localStorage.removeItem('idEmpleado');
    localStorage.removeItem('nombreEmpleado');
    this.router.navigate(['']);
  }
}

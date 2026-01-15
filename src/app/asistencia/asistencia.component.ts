import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AsistenciaService, MarcarAsistenciaResponse, Asistencia } from '../services/asistencia.service';

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css']
})
export class AsistenciaComponent implements OnInit {
  mensaje = '';
  asistencias: Asistencia[] = [];
  idUsuario!: number;
  idEmpleado!: number;

  constructor(private asistenciaService: AsistenciaService, private router: Router) {}

  ngOnInit() {
    const storedIdUsuario = localStorage.getItem('idUsuario');
    const storedIdEmpleado = localStorage.getItem('idEmpleado');

    if (!storedIdUsuario || !storedIdEmpleado) {
      this.router.navigate(['/']); 
      return;
    }

    this.idUsuario = +storedIdUsuario;
    this.idEmpleado = +storedIdEmpleado;

    this.cargarAsistencias();
  }

  marcarEntrada() {
    this.asistenciaService.marcarEntrada(this.idUsuario).subscribe({
      next: (res: MarcarAsistenciaResponse) => {
        this.mensaje = res.mensaje;
        this.cargarAsistencias();
      },
      error: () => this.mensaje = 'Error al registrar entrada'
    });
  }

  marcarSalida() {
    this.asistenciaService.marcarSalida(this.idUsuario).subscribe({
      next: (res: MarcarAsistenciaResponse) => {
        this.mensaje = res.mensaje;
        this.cargarAsistencias();
      },
      error: () => this.mensaje = 'Error al registrar salida'
    });
  }

  cargarAsistencias() {
    this.asistenciaService.listarPorEmpleado(this.idEmpleado).subscribe({
      next: (res) => this.asistencias = res,
      error: () => this.mensaje = 'Error al cargar asistencias'
    });
  }

  logout() {
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('idEmpleado');
    localStorage.removeItem('nombres');
    localStorage.removeItem('apellidos');
    this.router.navigate(['/']);
  }
}

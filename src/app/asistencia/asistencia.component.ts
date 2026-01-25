import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  AsistenciaService,
  MarcarAsistenciaResponse
} from '../services/asistencia.service';

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css']
})
export class AsistenciaComponent implements OnInit {

  mensaje = '';

  idUsuario!: number;
  nombres = '';
  apellidos = '';

  constructor(
    private asistenciaService: AsistenciaService,
    private router: Router,
    private zone: NgZone   // 👈 IMPORTANTE
  ) {}

  ngOnInit(): void {
    const idUsuario = localStorage.getItem('idUsuario');

    if (!idUsuario) {
      this.router.navigate(['/']);
      return;
    }

    this.idUsuario = +idUsuario;
  }

  marcarEntrada(): void {
    this.obtenerUbicacion((lat, lng) => {
      this.asistenciaService.marcarEntrada({
        idUsuario: this.idUsuario,
        latitud: lat,
        longitud: lng
      }).subscribe({
        next: (res: MarcarAsistenciaResponse) => {
          this.zone.run(() => {           // 👈 FUERZA REFRESH
            this.mensaje = res.mensaje;
          });
        },
        error: (err) => {
          this.zone.run(() => {
            this.mensaje = err.error?.mensaje || 'Error al registrar entrada';
          });
        }
      });
    });
  }

  marcarSalida(): void {
    this.obtenerUbicacion((lat, lng) => {
      this.asistenciaService.marcarSalida({
        idUsuario: this.idUsuario,
        latitud: lat,
        longitud: lng
      }).subscribe({
        next: (res: MarcarAsistenciaResponse) => {
          this.zone.run(() => {
            this.mensaje = res.mensaje;
          });
        },
        error: (err) => {
          this.zone.run(() => {
            this.mensaje = err.error?.mensaje || 'Error al registrar salida';
          });
        }
      });
    });
  }

  obtenerUbicacion(callback: (lat: number, lng: number) => void): void {
    navigator.geolocation.getCurrentPosition(
      pos => {
        callback(pos.coords.latitude, pos.coords.longitude);
      },
      err => {
        this.zone.run(() => {
          this.mensaje = 'Debes permitir la ubicación para marcar asistencia';
        });
      }
    );
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}

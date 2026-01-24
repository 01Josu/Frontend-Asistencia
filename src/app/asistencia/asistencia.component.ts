import { Component, OnInit } from '@angular/core';
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
    private router: Router
  ) {}

  ngOnInit(): void {
    const idUsuario = localStorage.getItem('idUsuario');

    if (!idUsuario) {
      this.router.navigate(['/']);
      return;
    }

    this.idUsuario = +idUsuario;

    this.nombres = localStorage.getItem('nombres') || '';
    this.apellidos = localStorage.getItem('apellidos') || '';
  }

  marcarEntrada(): void {
    this.obtenerUbicacion((lat, lng) => {

      console.log('📤 ENTRADA → Enviando al backend:', {
        idUsuario: this.idUsuario,
        latitud: lat,
        longitud: lng
      });

      this.asistenciaService.marcarEntrada({
        idUsuario: this.idUsuario,
        latitud: lat,
        longitud: lng
      }).subscribe({
        next: (res: MarcarAsistenciaResponse) => {
          this.mensaje = res.mensaje;
        },
        error: (err) => {
          this.mensaje = err.error?.mensaje || 'Error al registrar entrada';
        }
      });
    });
  }

  marcarSalida(): void {
    this.obtenerUbicacion((lat, lng) => {

      console.log('📤 SALIDA → Enviando al backend:', {
        idUsuario: this.idUsuario,
        latitud: lat,
        longitud: lng
      });

      this.asistenciaService.marcarSalida({
        idUsuario: this.idUsuario,
        latitud: lat,
        longitud: lng
      }).subscribe({
        next: (res: MarcarAsistenciaResponse) => {
          this.mensaje = res.mensaje;
        },
        error: (err) => {
          this.mensaje = err.error?.mensaje || 'Error al registrar salida';
        }
      });
    });
  }

  obtenerUbicacion(callback: (lat: number, lng: number) => void): void {
    if (!navigator.geolocation) {
      this.mensaje = 'Tu navegador no soporta geolocalización';
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        console.log('📍 FRONTEND - Ubicación detectada');
        console.log('Latitud:', lat);
        console.log('Longitud:', lng);
        console.log('Precisión (metros):', pos.coords.accuracy);

        callback(lat, lng);
      },
      err => {
        console.error('❌ Error geolocalización:', err);
        this.mensaje = 'Debes permitir la ubicación para marcar asistencia';
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}

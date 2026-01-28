import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  AsistenciaService,
  MarcarAsistenciaResponse
} from '../services/asistencia.service';
import { FormsModule } from '@angular/forms';
import { JustificacionService } from '../services/justificacion.service';


@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css']
})
export class AsistenciaComponent implements OnInit {

  mensaje = '';
  requiereJustificacion = false;
  tipoJustificacion: 'TARDANZA' | 'SOBRETIEMPO' | null = null;
  idAsistencia?: number;

  mostrarModalJustificacion = false;
  motivoJustificacion = '';

  idUsuario!: number;
  nombres = '';
  apellidos = '';

  constructor(
    private asistenciaService: AsistenciaService,
    private justificacionService: JustificacionService,
    private router: Router,
    private zone: NgZone
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
          this.zone.run(() => {

            console.log('RESPUESTA ENTRADA 👉', res);
            this.mensaje = res.mensaje;

            this.idAsistencia = res.idAsistencia;
            this.requiereJustificacion = !!res.requiereJustificacion;
            this.tipoJustificacion = res.tipoJustificacion ?? null;
            if (this.requiereJustificacion) {
              this.mostrarModalJustificacion = true;
            }
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

            console.log('RESPUESTA SALIDA 👉', res);
            this.mensaje = res.mensaje;

            this.idAsistencia = res.idAsistencia;
            this.requiereJustificacion = !!res.requiereJustificacion;
            this.tipoJustificacion = res.tipoJustificacion ?? null;
            if (this.requiereJustificacion) {
              this.mostrarModalJustificacion = true;
            }
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


  enviarJustificacion(): void {

    if (!this.idAsistencia) {
      this.mensaje = 'No se pudo identificar la asistencia';
      return;
    }

    if (!this.motivoJustificacion.trim()) {
      this.mensaje = 'Debe ingresar un motivo';
      return;
    }

    this.justificacionService.registrarJustificacion({
      idAsistencia: this.idAsistencia,
      motivo: this.motivoJustificacion
    }).subscribe({
      next: (res) => {
        this.zone.run(() => {
          console.log('JUSTIFICACIÓN GUARDADA 👉', res);

          this.mensaje = res;
          this.mostrarModalJustificacion = false;
          this.motivoJustificacion = '';
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.mensaje = err.error || 'Error al registrar justificación';
        });
      }
    });
  }
}

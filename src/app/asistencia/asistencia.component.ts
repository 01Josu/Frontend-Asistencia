import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  AsistenciaService,
  MarcarAsistenciaResponse
} from '../services/asistencia.service';
import { FormsModule } from '@angular/forms';
import { JustificacionService } from '../services/justificacion.service';
import { LoginService } from '../services/login.service';

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
  tipoJustificacion: 'SOBRETIEMPO' | null = null;
  idAsistencia?: number;

  mostrarModalJustificacion = false;
  motivoJustificacion = '';

  justificacionesPendientes: any[] = [];
  cantidadPendientes = 0;

  mostrarListaPendientes = false;

  idEmpleado!: number;
  idUsuario!: number;
  nombres = '';
  apellidos = '';

  constructor(
    private asistenciaService: AsistenciaService,
    private justificacionService: JustificacionService,
    private loginService: LoginService,
    private router: Router,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    const idUsuario = localStorage.getItem('idUsuario');
    const idEmpleado = localStorage.getItem('idEmpleado');

    if (!idUsuario || !idEmpleado) {
      this.router.navigate(['/']);
      return;
    }

    this.idUsuario = +idUsuario;
    this.idEmpleado = +idEmpleado;

    this.cargarJustificacionesPendientes();
  }

  cargarJustificacionesPendientes(): void {

    this.justificacionService
      .obtenerPendientes(this.idEmpleado)
      .subscribe({
        next: (data) => {
          this.justificacionesPendientes = data;
          this.cantidadPendientes = data.length;

          console.log("PENDIENTES 👉", data);
        },
        error: (err) => {
          console.error("Error cargando pendientes", err);
        }
      });
  }

  togglePendientes(): void {
    this.mostrarListaPendientes = !this.mostrarListaPendientes;
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

            this.requiereJustificacion = res.requiereJustificacion === true;

            this.tipoJustificacion = res.tipoJustificacion ?? null;

            if (this.requiereJustificacion) {
              this.mostrarModalJustificacion = true;
            }
            this.cargarJustificacionesPendientes();
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
    console.log('CLICK LOGOUT');

    this.loginService.logout().subscribe({
      next: () => {
        console.log('LLAMÓ AL BACKEND');
        localStorage.clear();
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('ERROR BACKEND', err);
        localStorage.clear();
        this.router.navigate(['/']);
      }
    });
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
          this.idAsistencia = undefined;
          this.cargarJustificacionesPendientes();
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.mensaje = err.error || 'Error al registrar justificación';
        });
      }
    });
  }

  abrirJustificacion(idAsistencia: number): void {
    this.idAsistencia = idAsistencia;
    this.motivoJustificacion = '';
    this.mostrarModalJustificacion = true;
  }
}
